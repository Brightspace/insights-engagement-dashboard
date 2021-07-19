import { action, computed, decorate, observable } from 'mobx';
import { COURSE_OFFERING, RECORD, USER } from '../consts';
import { fetchCachedChildren, fetchLastSearch, fetchRelevantChildren, orgUnitSearch } from './dataApiClient.js';
import { OrgUnitSelectorFilter, RoleSelectorFilter, SemesterSelectorFilter, UserSelectorFilter } from './selectorFilters.js';
import { OuFilterDataManager } from '@brightspace-ui-labs/ou-filter/ou-filter';
import { Tree } from '@brightspace-ui-labs/ou-filter/tree-filter';
/**
 * Adapter class that represents all necessary API for OuFilter
 */
class EngagementOuFilterDataManager extends OuFilterDataManager {

	constructor(data) {
		super();
		this._data = data;
	}

	async fetchRelevantChildren(orgUnitId, bookmark) {
		return await fetchRelevantChildren(orgUnitId, this._data.selectedSemesterIds, bookmark);
	}

	async orgUnitSearch(searchString, bookmark) {
		return await orgUnitSearch(searchString, this._data.selectedSemesterIds, bookmark);
	}

	get orgUnitTree() {
		return this._data.orgUnitTree;
	}

	get isLoading() {
		return this._data.isLoading;
	}
}

/**
 * Data from the server, along with filter settings that are passed in server calls.
 */
export class Data {
	constructor({ recordProvider, includeRoles, metronEndpoint }) {
		this.recordProvider = recordProvider;
		this._metronEndpoint = metronEndpoint;
		this.orgUnitTree = new Tree({});
		this._serverData = {
			records: [],
			orgUnits: [],
			users: [],

			// NB: isDefaultView just means that data was loaded using the defaultViewDataProvider. It does not
			// necessarily mean that the client-side has preselected OUs - also see get defaultViewPopupDisplayData
			isDefaultView: false,

			isRecordsTruncated: false,
			isOrgUnitsTruncated: false,
			semesterTypeId: null,
			numDefaultSemesters: 0,
			selectedOrgUnitIds: [],
			selectedRolesIds: includeRoles || [],
			selectedSemestersIds: [],
			selectedUserId: null,
			defaultViewOrgUnitIds: null,
			isStudentSuccessSys: false
		};

		// @observables
		this.isQueryError = false;
		this.isLoading = true;

		// because this._serverData itself is only updated onServerDataReload, we can safely use a simple
		// counter to let mobx know it has changed, rather than incurring the overhead of mobx-ifying
		// all the server data. This gives considerable speedup across the app for 50k enrollments.
		this._serverDataProxy = 0;

		this._selectorFilters = {
			role: new RoleSelectorFilter(this),
			semester: new SemesterSelectorFilter(this),
			orgUnit: new OrgUnitSelectorFilter(this),
			user: new UserSelectorFilter(this)
		};

		this._ouFilterDataManager = new EngagementOuFilterDataManager(this);
	}

	get serverData() {
		// eslint-disable-next-line no-unused-vars
		const forceMobxToCheckTheProxy = this._serverDataProxy;
		return this._serverData;
	}

	async loadData({ newRoleIds = null, newSemesterIds = null, newOrgUnitIds = null, newSelectedUserId = null, defaultView = false }) {
		this.isLoading = true;
		const filters = {
			roleIds: newRoleIds || this._selectorFilters.role.selected,
			semesterIds: newSemesterIds || this._selectorFilters.semester.selected,
			orgUnitIds: newOrgUnitIds || this._selectorFilters.orgUnit.selected,
			selectedUserId: newSelectedUserId || this._selectorFilters.user.selected,
			defaultView
		};
		try {
			const data = await this.recordProvider(filters, this._metronEndpoint);
			// Fixes a case where an existing users role selections are excluded by the
			// config variable. This scenario causes the selectedRolesIds to be null.
			// This block does not affect first time users with no role selections.
			if (data.selectedRolesIds === null) {
				this.onServerDataReload(this.serverData);
				this.isQueryError = false;
				return;
			}
			this.onServerDataReload(data);
			this.isQueryError = false;
		} catch (ignored) {
			this.onServerDataReload(this.serverData);
			this.isQueryError = true;
		}
	}

	// @action
	onServerDataReload(newServerData) {
		const lastSearchResults = fetchLastSearch(newServerData.selectedSemestersIds);
		const nodes = lastSearchResults ? [...newServerData.orgUnits, ...lastSearchResults] : newServerData.orgUnits;

		this.orgUnitTree = new Tree({
			// add in any nodes from the most recent search (if the semester filter didn't change); otherwise
			// the search will blink out and come back, and also drop any "load more" results
			nodes,
			leafTypes: [COURSE_OFFERING],
			invisibleTypes: [newServerData.semesterTypeId],
			selectedIds: newServerData.defaultViewOrgUnitIds || newServerData.selectedOrgUnitIds || [],
			ancestorIds: newServerData.selectedSemestersIds || [],
			oldTree: this.orgUnitTree,
			isDynamic: newServerData.isOrgUnitsTruncated,
			// preload the tree with any children queries we've already run: otherwise parts of the
			// tree blink out and then come back as they are loaded again
			extraChildren: newServerData.isOrgUnitsTruncated ?
				fetchCachedChildren(newServerData.selectedSemestersIds) || new Map() :
				null
		});

		this.isLoading = false;
		this._serverData = newServerData;
		this._serverDataProxy++;
		this._selectorFilters.semester.selected = this.serverData.selectedSemestersIds || [];
		this._selectorFilters.user.selected = this.serverData.selectedUserId;
	}

	set selectedRoleIds(newRoleIds) {
		this._selectorFilters.role.selected = newRoleIds;
		if (this._selectorFilters.role.shouldReloadFromServer(newRoleIds)) {
			this.loadData({ newRoleIds });
		}
	}

	get selectedRoleIds() {
		return this._selectorFilters.role.selected;
	}

	get userDictionary() {
		this._serverDataProxy;
		return new Map(this._serverData.users.map(user => [user[USER.ID], user]));
	}

	get userEnrollmentDictionary() {
		this._serverDataProxy;

		const selectedCourses = this.orgUnitTree.allSelectedCourses;
		if (selectedCourses.length === 0) return this.userDictionary;

		const userEnrollments = new Map();
		this._serverData.records.forEach(record => {
			const orgUnitId = record[RECORD.ORG_UNIT_ID];
			const userId = record[RECORD.USER_ID];
			if (selectedCourses.includes(orgUnitId)) {
				userEnrollments.set(userId, this.userDictionary.get(userId));
			}
		});
		return userEnrollments;
	}

	set selectedSemesterIds(newSemesterIds) {
		if (this._selectorFilters.semester.shouldReloadFromServer(newSemesterIds)) {
			this.loadData({ newSemesterIds });
		} else {
			this._selectorFilters.semester.selected = newSemesterIds;
		}
	}

	get selectedSemesterIds() {
		return this._selectorFilters.semester.selected;
	}

	set selectedOrgUnitIds(newOrgUnitIds) {
		if (this._selectorFilters.orgUnit.shouldReloadFromServer(newOrgUnitIds)) {
			this.loadData({ newOrgUnitIds });
		}
		// no need to update the filter here: it uses the same data structure as the web component that renders it
	}

	get selectedOrgUnitIds() {
		return this._selectorFilters.orgUnit.selected;
	}

	set selectedUserId(newSelectedUserId) {
		newSelectedUserId = Number(newSelectedUserId);
		if (this._selectorFilters.user.shouldReloadFromServer(newSelectedUserId)) {
			this.loadData({ newSelectedUserId });
		} else {
			this._selectorFilters.user.selected = newSelectedUserId;
		}
	}

	// returns OU ids (and respective names) that have been preselected to create the client-side default view, if any.
	// NB: it's possible for isDefaultView to be true but for there to be no preselected ids; this happens if the
	// defaultCourses and defaultSemesters config variables are set to 0
	get defaultViewPopupDisplayData() {
		let courseIdsToDisplay = [];

		if (this.serverData.isDefaultView) {
			if (this.serverData.defaultViewOrgUnitIds && this.serverData.defaultViewOrgUnitIds.length) {
				courseIdsToDisplay = this.serverData.defaultViewOrgUnitIds;
			} else if (this.serverData.selectedOrgUnitIds && this.serverData.selectedOrgUnitIds.length) {
				courseIdsToDisplay = this.serverData.selectedOrgUnitIds;
			}
		} // else return empty array

		return courseIdsToDisplay.map(id => {
			return { id, name: this.orgUnitTree.getName(id) };
		});
	}

	get numDefaultSemesters() {
		return this.serverData.numDefaultSemesters;
	}

	get isDefaultView() {
		return this.serverData.isDefaultView;
	}

	get semesterTypeId() {
		return this.serverData.semesterTypeId;
	}

	// @computed
	get records() {
		return this.serverData.records.filter(record => {
			return Object.values(this._selectorFilters).every(filter => filter.shouldInclude(record));
		});
	}

	get ouFilterDataManager() {
		return this._ouFilterDataManager;
	}
}

decorate(Data, {
	_serverDataProxy: observable,
	orgUnitTree: observable,
	isLoading: observable,
	isQueryError: observable,
	records: computed,
	selectedOrgUnitIds: computed,
	selectedRoleIds: computed,
	selectedSemesterIds: computed,
	userDictionary: computed,
	userEnrollmentDictionary: computed,
	onServerDataReload: action,
});
