const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';
const semestersEndpoint = '/d2l/api/ap/unstable/insights/data/semesters';
const dataEndpoint = '/d2l/api/ap/unstable/insights/data/engagement';
const canSendEmailEndpoint = '/d2l/api/ap/unstable/insights/data/canSendEmail';
const relevantChildrenEndpoint = orgUnitId => `/d2l/api/ap/unstable/insights/data/orgunits/${orgUnitId}/children`;
const ouSearchEndpoint = '/d2l/api/ap/unstable/insights/data/orgunits';

/**
 * @param {[Number]} roleIds
 * @param {[Number]} semesterIds
 * @param {[Number]} orgUnitIds
 * @param {Boolean} defaultView if true, request that the server select a limited set of data for first view
 */
export async function fetchData({ roleIds = [], semesterIds = [], orgUnitIds = [], defaultView = false }) {
	const url = new URL(dataEndpoint, window.location.origin);
	if (roleIds) {
		url.searchParams.set('selectedRolesCsv', roleIds.join(','));
	}
	if (semesterIds) {
		url.searchParams.set('selectedSemestersCsv', semesterIds.join(','));
	}
	if (orgUnitIds) {
		url.searchParams.set('selectedOrgUnitIdsCsv', orgUnitIds.join(','));
	}
	url.searchParams.set('defaultView', defaultView ? 'true' : 'false');
	const response = await fetch(url.toString());
	return await response.json();
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

export async function canSendEmailToSelectedUsers(selectedUserIds) {
	const url = new URL(canSendEmailEndpoint, window.location.origin);
	const response = await fetch(url.toString(), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(selectedUserIds)
	});

	return response.status === 200;
}
