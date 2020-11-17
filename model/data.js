import { action, computed, decorate, observable } from 'mobx';
import { COURSE_OFFERING, USER } from '../consts';
import { fetchCachedChildren, fetchLastSearch } from './lms.js';
import { OrgUnitSelectorFilter, RoleSelectorFilter, SemesterSelectorFilter } from './selectorFilters.js';
import StateHistory from './stateHistory';
import { Tree } from '../components/tree-filter';

/**
 * Data from the server, along with filter settings that are passed in server calls.
 */

export class Data {
	constructor({ recordProvider }) {

		this._history = new StateHistory();
		this.recordProvider = recordProvider;
		this.orgUnitTree = new Tree({ history: this._history });
		this.userDictionary = null;

		// @observables
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
			selectedRolesIds: [],
			selectedSemestersIds: [],
			defaultViewOrgUnitIds: null
		};

		this._selectorFilters = {
			role: new RoleSelectorFilter(this.serverData),
			semester: new SemesterSelectorFilter(this.serverData, this.orgUnitTree),
			orgUnit: new OrgUnitSelectorFilter(this.serverData, this.orgUnitTree)
		};

		this._history.registerCtrlZ();

		this.loadData({ defaultView: true });
	}

	loadData({ newRoleIds = null, newSemesterIds = null, newOrgUnitIds = null, defaultView = false }) {
		this.isLoading = true;
		const filters = {
			roleIds: newRoleIds || this._selectorFilters.role.selected,
			semesterIds: newSemesterIds || this._selectorFilters.semester.selected,
			orgUnitIds: newOrgUnitIds || this._selectorFilters.orgUnit.selected,
			defaultView
		};
		this.recordProvider(filters).then(data => this.onServerDataReload(data));
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
				null,
			history: this._history
		});

		this.userDictionary = new Map(newServerData.users.map(user => [user[USER.ID], user]));
		this.isLoading = false;
		this.serverData = newServerData;

		this._selectorFilters = {
			role: new RoleSelectorFilter(this.serverData),
			semester: new SemesterSelectorFilter(this.serverData, this.orgUnitTree),
			orgUnit: new OrgUnitSelectorFilter(this.serverData, this.orgUnitTree)
		};

		this._history.register('role-filter', this.undoSetSelectedRoleIds.bind(this));
		this._history.register('semester-filter', this.undoSetSelectedSemesterIds.bind(this));
	}

	saveSelectedRoleIds(target) {
		this._history.save(
			'role-filter',
			{ target, data: Array.from(this._selectorFilters.role.selected) }
		);
	}

	undoSetSelectedRoleIds(oldRoles) {
		const target = oldRoles.target;
		const data = oldRoles.data;
		this._selectorFilters.role.selected = data;
		target.selected = data;
	}

	set selectedRoleIds(newRoleIds) {
		if (this._selectorFilters.role.shouldReloadFromServer(newRoleIds)) {
			this.loadData({ newRoleIds });
		} else {
			this._selectorFilters.role.selected = newRoleIds;
		}
	}

	get selectedRoleIds() {
		return this._selectorFilters.role.selected;
	}

	saveSelectedSemesterIds() {
		this._history.save(
			'semester-filter',
			this._selectorFilters.semester.selected
		);
	}

	undoSetSelectedSemesterIds(oldSemesters) {
		this._selectorFilters.semester.selected = oldSemesters;
	}

	set selectedSemesterIds(newSemesterIds) {
		if (this._selectorFilters.semester.shouldReloadFromServer(newSemesterIds)) {
			this.loadData({ newSemesterIds });
		} else {
			this.saveSelectedSemesterIds();
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
	records: computed,
	onServerDataReload: action
});
