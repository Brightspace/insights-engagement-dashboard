import { action, autorun, computed, decorate, observable } from 'mobx';
import { COURSE_OFFERING, RECORD, USER } from '../consts';
import { fetchCachedChildren, fetchLastSearch } from './lms.js';
import { formatNumber, formatPercent } from '@brightspace-ui/intl/lib/number.js';
import { OrgUnitSelectorFilter, RoleSelectorFilter, SemesterSelectorFilter } from './selectorFilters.js';
import { CardFilter } from './cardFilter.js';
import { TABLE_USER } from '../components/users-table';
import { Tree } from '../components/tree-filter';

const numberFormatOptions = { maximumFractionDigits: 2 };

function unique(array) {
	return [...new Set(array)];
}

function countUnique(records, field) {
	return new Set(records.map(r => r[field])).size;
}
const TiCVsGradesFilterId = 'd2l-insights-time-in-content-vs-grade-card';
const OverdueAssignmentsFilterId = 'd2l-insights-overdue-assignments-card';
const CourseLastAccessFilterId = 'd2l-insights-course-last-access-card';
const CurrentFinalGradeFilterId = 'd2l-insights-current-final-grade-card';

function avgOf(records, field) {
	const total = records.reduce((sum, r) => sum + r[field], 0);
	return total / records.length;
}

export class Data {
	constructor({ recordProvider, cardFilters }) {
		this.recordProvider = recordProvider;
		this.orgUnitTree = new Tree({});
		this._userDictionary = null;

		// @observables
		this.selectedLastAccessCategory = new Set();
		this.selectedGradesCategories = new Set();
		this.tiCVsGradesQuadrant = 'leftBottom';
		this.avgTimeInContent = 0;
		this.avgGrades = 0;
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

		this.cardFilters = {};

		// additional setup
		cardFilters
			.map(params => new CardFilter(params, this))
			.forEach(f => this.cardFilters[f.id] = f);

		this._restore();

		// mobx will run _persist() whenever relevant state changes
		autorun(() => this._persist());

		this.loadData({ defaultView: true });
	}

	loadData({ newRoleIds = null, newSemesterIds = null, newOrgUnitIds = null, defaultView = false }) {
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
				null
		});

		this._userDictionary = new Map(newServerData.users.map(user => [user[USER.ID], user]));
		this.isLoading = false;
		this.serverData = newServerData;

		this._selectorFilters = {
			role: new RoleSelectorFilter(this.serverData),
			semester: new SemesterSelectorFilter(this.serverData, this.orgUnitTree),
			orgUnit: new OrgUnitSelectorFilter(this.serverData, this.orgUnitTree)
		};
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

	// @computed
	get records() {
		return this.serverData.records.filter(record => {
			return Object.values(this._selectorFilters).every(filter => filter.shouldInclude(record));
		});
	}

	// @computed
	get users() {
		const userIdsInView = unique(this.getRecordsInView().map(record => record[RECORD.USER_ID]));
		return userIdsInView.map(userId => this._userDictionary.get(userId));
	}

	// @computed
	get userDataForDisplay() {
		// map to a 2D userData array, with column 0 as a sub-array of [lastFirstName, username - id]
		// then sort by lastFirstName
		const recordsByUser = this.recordsByUser;
		return this.users
			.map(user => {
				const records = recordsByUser.get(user[USER.ID]);
				const recordsWithGrades = records.filter(r => r[RECORD.CURRENT_FINAL_GRADE] !== null);
				const avgFinalGrade = avgOf(recordsWithGrades, RECORD.CURRENT_FINAL_GRADE);
				return [
					[`${user[USER.LAST_NAME]}, ${user[USER.FIRST_NAME]}`, `${user[USER.USERNAME]} - ${user[USER.ID]}`],
					records.length, // courses
					avgFinalGrade ? formatPercent(avgFinalGrade / 100, numberFormatOptions) : '',
					formatNumber(avgOf(records, RECORD.TIME_IN_CONTENT) / 60, numberFormatOptions)
				];
			})
			.sort((user1, user2) => {
				// sort by lastFirstName
				return user1[TABLE_USER.NAME_INFO][0].localeCompare(user2[TABLE_USER.NAME_INFO][0]);
			});
	}

	get recordsByUser() {
		const recordsByUser = new Map();
		this.getRecordsInView().forEach(r => {
			if (!recordsByUser.has(r[RECORD.USER_ID])) {
				recordsByUser.set(r[RECORD.USER_ID], []);
			}
			recordsByUser.get(r[RECORD.USER_ID]).push(r);
		});
		return recordsByUser;
	}

	get currentFinalGrades() {
		//keep in count students with 0 grade, but remove with null
		return this.getRecordsInView(CurrentFinalGradeFilterId)
			.filter(record => record[RECORD.CURRENT_FINAL_GRADE] !== null && record[RECORD.CURRENT_FINAL_GRADE] !== undefined)
			.map(record => [record[RECORD.TIME_IN_CONTENT], record[RECORD.CURRENT_FINAL_GRADE]])
			.filter(item => item[0] || item[1])
			.map(item => this.gradeCategory(item[1]));
	}

	gradeCategory(grade) {
		if (grade === null || grade === 0) {
			return grade;
		}
		else if (grade === 100) {
			return 90; // put grade 100 in bin 90-100
		}
		else {
			return Math.floor(grade / 10) * 10;
		}
	}

	setGradesCategoryEmpty() {
		this.selectedGradesCategories.clear();
	}

	addToGradesCategory(category) {
		this.selectedGradesCategories.add(category);
	}

	get courseLastAccessDates() {
		// return an array of size 6, each element mapping to a category on the course last access bar chart
		const dateBucketCounts = [0, 0, 0, 0, 0, 0];
		const lastAccessDatesArray = this.getRecordsInView(CourseLastAccessFilterId).map(record => [record[RECORD.COURSE_LAST_ACCESS] === null ? -1 : (Date.now() - record[RECORD.COURSE_LAST_ACCESS])]);
		lastAccessDatesArray.forEach(record => dateBucketCounts[ this._bucketCourseLastAccessDates(record) ]++);
		return dateBucketCounts;
	}

	_bucketCourseLastAccessDates(courseLastAccessDateRange) {
		const fourteenDayMillis = 1209600000;
		const sevenDayMillis = 604800000;
		const fiveDayMillis = 432000000;
		const oneDayMillis = 86400000;
		if (courseLastAccessDateRange < 0) {
			return 0;
		}
		if (courseLastAccessDateRange >= fourteenDayMillis) {
			return 1;
		}
		if (courseLastAccessDateRange <= oneDayMillis) {
			return 5;
		}
		if (courseLastAccessDateRange <= fiveDayMillis) {
			return 4;
		}
		if (courseLastAccessDateRange <= sevenDayMillis) {
			return 3;
		}
		if (courseLastAccessDateRange <= fourteenDayMillis) {
			return 2;
		}
	}

	addToLastAccessCategory(category) {
		this.selectedLastAccessCategory.add(category);
	}

	setLastAccessCategoryEmpty() {
		this.selectedLastAccessCategory.clear();
	}

	get tiCVsGrades() {
		return this.getRecordsInView(TiCVsGradesFilterId)
			.filter(record => record[RECORD.CURRENT_FINAL_GRADE] !== null && record[RECORD.CURRENT_FINAL_GRADE] !== undefined)
			.map(record => [record[RECORD.TIME_IN_CONTENT], record[RECORD.CURRENT_FINAL_GRADE]])
			.filter(item => item[0] || item[1])
			.map(item => [item[0] !== 0 ? Math.floor(item[0] / 60) : 0, item[1]]); //keep in count students either without grade or without time in content
	}

	setTiCVsGradesQuadrant(quadrant) {
		this.tiCVsGradesQuadrant = quadrant;
	}

	get tiCVsGradesAvgValues() {
		const arrayOfTimeInContent =  this.tiCVsGrades.map(item => item[0]);
		this.avgTimeInContent = arrayOfTimeInContent.length ? Math.floor(arrayOfTimeInContent.reduce((a, b) => a + b, 0) / arrayOfTimeInContent.length) : 0;

		const arrayOfGrades = this.tiCVsGrades.map(item => item[1]);
		this.avgGrades = arrayOfGrades.length ? Math.floor(arrayOfGrades.reduce((a, b) => a + b, 0) / arrayOfGrades.length) : 0;
		return [this.avgTimeInContent, this.avgGrades];
	}

	get usersCountsWithOverdueAssignments() {
		return this.getRecordsInView(OverdueAssignmentsFilterId)
			.reduce((acc, record) => {
				if (!acc.has(record[RECORD.USER_ID]) && record[RECORD.OVERDUE] !== 0) {
					acc.add(record[RECORD.USER_ID]);
				}
				return acc;
			}, 	new Set()).size;
	}

	getRecordsInView(id) {
		// if id is omitted, all applied filters will be used
		const otherFilters = Object.values(this.cardFilters).filter(f => f.isApplied && f.id !== id);
		return this.records.filter(r => otherFilters.every(f => f.shouldInclude(r)));
	}

	getStats(id) {
		const recordsInView = this.getRecordsInView(id);

		const filter = this.cardFilters[id];

		// NB: due to compact API response, we'll need to map field names to array indices
		const matchingRecords = recordsInView.filter(r => !filter.filter || filter.shouldInclude(r));
		const value = countUnique(matchingRecords, filter.countUniqueField);

		let delta = null;
		if (filter.deltaField) {
			const deltaMatchingRecords = recordsInView.filter(r => r[filter.deltaField] < filter.threshold);
			const oldValue = countUnique(deltaMatchingRecords, filter.countUniqueField);
			delta = value - oldValue;
		}

		return {
			value,
			delta
		};
	}

	// @action
	setApplied(id, isApplied) {
		if (this.cardFilters[id]) this.cardFilters[id].isApplied = isApplied;
	}

	_persist() {
		//It's save only the list of filters, then will be a separate story for keep state
		localStorage.setItem('d2l-insights-engagement-dashboard.state', JSON.stringify(
			Object.keys(this.cardFilters)
				.map(f => ({ id: f }))
		));
	}

	_restore() {
		// this might be better handled by url-rewriting
		const state = JSON.parse(localStorage.getItem('d2l-insights-engagement-dashboard.state') || '[]');
		state.forEach(filterState => this.setApplied(filterState.id));
	}
}

decorate(Data, {
	serverData: observable,
	orgUnitTree: observable,
	records: computed,
	users: computed,
	userDataForDisplay: computed,
	usersCountsWithOverdueAssignments: computed,
	courseLastAccessDates: computed,
	tiCVsGrades: computed,
	tiCVsGradesAvgValues: computed,
	currentFinalGrades: computed,
	cardFilters: observable,
	isLoading: observable,
	tiCVsGradesQuadrant: observable,
	selectedLastAccessCategory: observable,
	selectedGradesCategories: observable,
	onServerDataReload: action,
	setApplied: action,
	setGradesCategoryEmpty: action,
	addToGradesCategory: action,
	addToLastAccessCategory: action,
	setLastAccessCategoryEmpty: action
});
