import { d2lfetch } from 'd2l-fetch/src';
import { fetchAuth } from 'd2l-fetch-auth';
import { ORG_UNIT } from '../consts';
d2lfetch.use({ name: 'auth', fn: fetchAuth });

let isMocked = false;
export function mock() {
	isMocked = true;
}
export function restore() {
	isMocked = false;
}

const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';
const semestersEndpoint = '/d2l/api/ap/unstable/insights/data/semesters';
const dataEndpoint = 'unstable/insights/data/engagement';
const relevantChildrenEndpoint = orgUnitId => `/d2l/api/ap/unstable/insights/data/orgunits/${orgUnitId}/children`;
const ouSearchEndpoint = '/d2l/api/ap/unstable/insights/data/orgunits';
const saveSettingsEndpoint = '/d2l/api/ap/unstable/insights/mysettings/engagement';
const userDrillDataEndpoint = 'unstable/insights/data/userdrill';
const userListEndpoint = '/d2l/api/ap/unstable/insights/data/engagement/users';

function concatMetronUrl(endpoint, apiPath) {
	if (apiPath.startsWith('/')) {
		throw new Error('Api path should not have leading / symbol.');
	}

	return endpoint + (endpoint.endsWith('/') ? '' : '/') + apiPath;
}

function mapOrgUnits(orgunits) {
	return orgunits.map(orgunit => {
		if (!Array.isArray(orgunit)) return orgunit; // only map if in the old format
		return {
			Id: orgunit[ORG_UNIT.ID],
			Name: orgunit[ORG_UNIT.NAME],
			Type: orgunit[ORG_UNIT.TYPE],
			Parents: orgunit[ORG_UNIT.PARENTS],
			IsActive: orgunit[ORG_UNIT.IS_ACTIVE]
		};
	});
}

/**
 * @param {[Number]} roleIds
 * @param {[Number]} semesterIds
 * @param {[Number]} orgUnitIds
 * @param {Number} selectedUserId if provided, fetch data for just the specified user
 * @param {Boolean} defaultView if true, request that the server select a limited set of data for first view
 * @param {String} metronEndpoint
 */
export async function fetchData({ roleIds = [], semesterIds = [], orgUnitIds = [], selectedUserId = null, defaultView = false }, metronEndpoint) {
	const url = new URL(concatMetronUrl(metronEndpoint, dataEndpoint));
	if (roleIds) {
		url.searchParams.set('selectedRolesCsv', roleIds.join(','));
	}
	if (semesterIds) {
		url.searchParams.set('selectedSemestersCsv', semesterIds.join(','));
	}
	if (orgUnitIds) {
		url.searchParams.set('selectedOrgUnitIdsCsv', orgUnitIds.join(','));
	}
	if (selectedUserId) {
		url.searchParams.set('selectedUserId', selectedUserId);
	}
	url.searchParams.set('defaultView', defaultView ? 'true' : 'false');
	const uri = url.toString();

	let response = await d2lfetch.fetch(uri, { headers: { 'cache-control': 'no-store' } });
	let waitMs = 0;
	while (response.status === 202) {
		if (waitMs < 2000) waitMs += 250;
		await new Promise(resolve => setTimeout(resolve, waitMs));

		response = await d2lfetch.fetch(uri, { headers: { 'cache-control': 'no-store' } });
	}

	if (response.ok) {
		const results = await response.json();
		if (results.orgUnits) {
			results.orgUnits = mapOrgUnits(results.orgUnits);
		}
		return results;
	}
	else {
		throw new Error('query-failure');
	}
}

/**
 * @param {[Number]} orgUnitIds
 * @param {Number} userId
 * @param {String} metronEndpoint
 */
export async function fetchUserData(orgUnitIds = [], userId = 0, metronEndpoint) {
	const url = concatMetronUrl(metronEndpoint, userDrillDataEndpoint);
	const userDrillBody = {
		selectedUserId: userId,
		selectedOrgUnitIds: orgUnitIds
	};
	const response = await d2lfetch.fetch(new Request(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userDrillBody)
	}));
	if (response.ok) return await response.json();
	else {
		throw new Error('query-failure');
	}
}

/**
 * @returns {{Identifier: string, DisplayName: string, Code: string|null}[]}
 */
export async function fetchRoles() {
	const response = await fetch(rolesEndpoint);

	/**
	 * Expected data format from Roles API
	 * @type {{Identifier: string, DisplayName: string, Code: string|null}[]}
	 */
	return await response.json();
}

/**
 * @param {Number} pageSize
 * @param {string|null} bookmark - can be null
 * @param {string|null} search - can be null
 * @returns {{PagingInfo:{Bookmark: string, HasMoreItems: boolean}, Items: {orgUnitId: number, orgUnitName: string}[]}}
 */
export async function fetchSemesters(pageSize, bookmark, search) {
	const url = new URL(semestersEndpoint, window.location.origin);
	url.searchParams.set('pageSize', pageSize.toString());
	if (bookmark) {
		url.searchParams.set('bookmark', bookmark);
	}
	if (search) {
		url.searchParams.set('search', search);
	}
	const response = await fetch(url.toString());
	return await response.json();
}

const relevantChildrenCache = new Map();
const cacheKey = selectedSemesterIds => JSON.stringify(selectedSemesterIds || []);

export async function fetchRelevantChildren(orgUnitId, selectedSemesterIds, bookmark) {
	const url = new URL(relevantChildrenEndpoint(orgUnitId), window.location.origin);
	if (selectedSemesterIds) {
		url.searchParams.set('selectedSemestersCsv', selectedSemesterIds.join(','));
	}
	if (bookmark) {
		url.searchParams.set('bookmark', bookmark);
	}
	const response = await fetch(url.toString());
	const results = await response.json();
	results.Items = mapOrgUnits(results.Items);

	const key = cacheKey(selectedSemesterIds);
	if (!relevantChildrenCache.has(key)) relevantChildrenCache.set(key, new Map());
	if (!relevantChildrenCache.get(key).has(orgUnitId)) {
		relevantChildrenCache.get(key).set(orgUnitId, results);
	} else {
		const cached = relevantChildrenCache.get(key).get(orgUnitId);
		cached.Items.push(...results.Items);
		cached.PagingInfo = results.PagingInfo;
	}

	return results;
}

export function fetchCachedChildren(selectedSemesterIds) {
	return relevantChildrenCache.get(cacheKey(selectedSemesterIds));
}

const orgUnitSearchCache = {
	searchString: null,
	selectedSemesterIds: cacheKey(),
	nodes: null
};
export async function orgUnitSearch(searchString, selectedSemesterIds, bookmark) {
	const url = new URL(ouSearchEndpoint, window.location.origin);
	url.searchParams.set('search', searchString);
	if (selectedSemesterIds) {
		url.searchParams.set('selectedSemestersCsv', selectedSemesterIds.join(','));
	}
	if (bookmark) {
		url.searchParams.set('bookmark', bookmark);
	}
	const response = await fetch(url.toString());
	const results = await response.json();
	results.Items = mapOrgUnits(results.Items);

	const key = cacheKey(selectedSemesterIds);
	if (orgUnitSearchCache.searchString === searchString && orgUnitSearchCache.selectedSemesterIds === key) {
		orgUnitSearchCache.nodes = [...orgUnitSearchCache.nodes, ...results.Items];
	} else {
		orgUnitSearchCache.searchString = searchString;
		orgUnitSearchCache.selectedSemesterIds = key;
		orgUnitSearchCache.nodes = results.Items;
	}

	return results;
}

export function fetchLastSearch(selectedSemesterIds) {
	if (orgUnitSearchCache.selectedSemesterIds === cacheKey(selectedSemesterIds)) {
		return orgUnitSearchCache.nodes;
	}

	return null;
}

/**
 * Save user preferences to the LMS.
 * @param settings Must contain values for all the card and column settings (validated on call);
 * "lastAccessThresholdDays" (number) and "includeRoles" (array) fields are optional.
 */
export async function saveSettings(settings) {
	if (isMocked) return { ok: true };

	const requiredFields = [
		'showResultsCard',
		'showOverdueCard',
		'showDiscussionsCard',
		'showSystemAccessCard',
		'showGradesCard',
		'showTicGradesCard',
		'showCourseAccessCard',
		'showCoursesCol',
		'showGradeCol',
		'showTicCol',
		'showDiscussionsCol',
		'showLastAccessCol',
		'showContentViewCard'
	];
	requiredFields.forEach(field => {
		if (settings[field] !== true && settings[field] !== false) {
			throw new Error(`save settings: missing required field ${field}`);
		}
	});

	const url = new URL(saveSettingsEndpoint, window.location.origin);
	return await d2lfetch.fetch(new Request(url.toString(), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(settings)
	}));
}

export async function getVisibleUsers(searchOptions) {
	const url = new URL(userListEndpoint, window.location.origin);

	const allowedParams = ['search', 'sort', 'desc', 'bookmark'];
	Object.keys(searchOptions)
		.filter(param => allowedParams.includes(param) && searchOptions[param] !== undefined)
		.forEach(param => url.searchParams.set(param, searchOptions[param]));

	const response = await fetch(url.toString());
	return await response.json();
}
