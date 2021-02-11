import { action, computed, decorate, observable } from 'mobx';
import { COURSE_OFFERING, USER } from '../consts';
import { fetchCachedChildren, fetchLastSearch } from './lms.js';
import { OrgUnitSelectorFilter, RoleSelectorFilter, SemesterSelectorFilter } from './selectorFilters.js';
import { Tree } from '../components/tree-filter';

/**
 * Data from the server, along with filter settings that are passed in server calls.
 */
export class Data {
	constructor({ recordProvider, includeRoles, metronEndpoint }) {
		this.recordProvider = recordProvider;
		this._metronEndpoint = metronEndpoint;
		this.orgUnitTree = new Tree({});
		this.userDictionary = null;

		// @observables
		this.isQueryError = false;
		this.isLoading = true;
		this.serverData = {
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
			defaultViewOrgUnitIds: null,
			isStudentSuccessSys: false
		};

		this._selectorFilters = {
			role: new RoleSelectorFilter(this),
			semester: new SemesterSelectorFilter(this),
			orgUnit: new OrgUnitSelectorFilter(this)
		};
	}

	async loadData({ newRoleIds = null, newSemesterIds = null, newOrgUnitIds = null, defaultView = false }) {
		this.isLoading = true;
		const filters = {
			roleIds: newRoleIds || this._selectorFilters.role.selected,
			semesterIds: newSemesterIds || this._selectorFilters.semester.selected,
			orgUnitIds: newOrgUnitIds || this._selectorFilters.orgUnit.selected,
			defaultView
		};
		try {
			const data = await this.recordProvider(filters, this._metronEndpoint);
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
		this.orgUnitTree = new Tree({
			// add in any nodes from the most recent search (if the semester filter didn't change); otherwise
			// the search will blink out and come back, and also drop any "load more" results
			nodes: lastSearchResults ? [...newServerData.orgUnits, ...lastSearchResults] : newServerData.orgUnits,
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

		this.userDictionary = new Map(newServerData.users.map(user => [user[USER.ID], user]));
		this.isLoading = false;
		this.serverData = newServerData;
		this._selectorFilters.semester.selected = this.serverData.selectedSemestersIds || [];
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
}

decorate(Data, {
	serverData: observable,
	orgUnitTree: observable,
	isLoading: observable,
	isQueryError: observable,
	records: computed,
	selectedOrgUnitIds: computed,
	selectedRoleIds: computed,
	selectedSemesterIds: computed,
	onServerDataReload: action
});
