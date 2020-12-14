import './table.js';
import '@brightspace-ui-labs/pagination/pagination';
import { action, computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { COLUMN_TYPES } from './table';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

export const ACTIVE_TABLE_COURSES = {
	COURSE_NAME: 0,
	CURRENT_GRADE: 1,
	PREDICTED_GRADE: 2,
	TIME_IN_CONTENT: 3,
	DISCUSSION_ACTIVITY: 4,
	COURSE_LAST_ACCESS: 5
};

export const IS_ACTIVE_COURSE = 6;

export const INACTIVE_TABLE_COURSES = {
	COURSE_NAME: 0,
	CURRENT_GRADE: 1,
	TIME_IN_CONTENT: 2,
	DISCUSSION_ACTIVITY: 3,
	COURSE_LAST_ACCESS: 4
};

const numberFormatOptions = { maximumFractionDigits: 2 };

const DEFAULT_PAGE_SIZE = 20;

/**
 * The mobx data object is doing filtering logic
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Object} user - {firstName, lastName, username, userId}
 * @property {Boolean} isActiveTable - whether we want the active or inactive table to render
 */
class UserDrillCoursesTable extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			user: { type: Object, attribute: false },
			isActiveTable: { type: Boolean, attribute: false, reflect: true },
			_currentPage: { type: Number, attribute: false },
			_pageSize: { type: Number, attribute: false },
			isStudentSuccessSys: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
				d2l-labs-pagination {
					margin: 15px 0;
					max-width: 1200px;
				}
			`
		];
	}

	constructor() {
		super();
		this._sortOrder = 'desc';
		this._sortColumn = ACTIVE_TABLE_COURSES.COURSE_NAME;
		this._currentPage = 1;
		this._pageSize = DEFAULT_PAGE_SIZE;
	}

	get _itemsCount() {
		return this.userDataForDisplay.length;
	}

	get _maxPages() {
		const itemsCount = this._itemsCount;
		return itemsCount ? Math.ceil(itemsCount / this._pageSize) : 0;
	}

	// don't use displayData.length to get the itemsCount. When we display a skeleton view, displayData.length is
	// the number of skeleton rows we're displaying, but the Total Users count should still be 0
	get _displayData() {
		if (this.skeleton) {
			const loadingPlaceholderText = this.localize('inactiveCoursesTable:loadingPlaceholder');

			// a DEFAULT_PAGE_SIZE x columnInfoLength 2D array filled with a generic string
			return Array(DEFAULT_PAGE_SIZE).fill(Array(this.columnInfo.length).fill(loadingPlaceholderText));
		}

		if (this._itemsCount) {
			const start = this._pageSize * (this._currentPage - 1);
			const end = this._pageSize * (this._currentPage); // it's ok if this goes over the end of the array
			const numCols = this.isActiveTable ? Array.from(Array(6), (_, x) => x) : Array.from(Array(5), (_, x) => x);
			return this.userDataForDisplay
				.slice(start, end)
				.map(user => numCols.map(column => user[column]));
		}

		return [];
	}

	_handleColumnSort(e) {
		this._sortOrder = e.detail.order;
		this._sortColumn = e.detail.column;
		this._currentPage = 1;
	}

	_shouldDisplayinTable(record) {
		const orgUnitId = record[RECORD.ORG_UNIT_ID];
		if (record[RECORD.USER_ID] === this.user.userId && this.isActiveTable) {
			return this.data.orgUnitTree.getActiveStatus(orgUnitId);
		}
		if (record[RECORD.USER_ID] === this.user.userId && !this.isActiveTable) {
			return !this.data.orgUnitTree.getActiveStatus(orgUnitId);
		}
		return false;
	}

	_preProcessData(record) {
		const orgUnitId =  record[RECORD.ORG_UNIT_ID];
		const orgUnitName = this.data.orgUnitTree.getName(orgUnitId);
		const finalGrade = record[RECORD.CURRENT_FINAL_GRADE];
		const predictedGrade = record[RECORD.PREDICTED_GRADE];
		const timeInContent = record[RECORD.TIME_IN_CONTENT];
		const threads = record[RECORD.DISCUSSION_ACTIVITY_THREADS];
		const reads = record[RECORD.DISCUSSION_ACTIVITY_READS];
		const replies = record[RECORD.DISCUSSION_ACTIVITY_REPLIES];
		const lastCourseAccess = record[RECORD.COURSE_LAST_ACCESS] ? new Date(record[RECORD.COURSE_LAST_ACCESS]) : undefined;

		if (this.isActiveTable) {
			return [
				this.localize('treeFilter:nodeName', { orgUnitName, id: orgUnitId }),
				finalGrade,
				predictedGrade,
				timeInContent,
				[threads, reads, replies],
				lastCourseAccess
			];
		} else {
			return [
				this.localize('treeFilter:nodeName', { orgUnitName, id: orgUnitId }),
				finalGrade,
				timeInContent,
				[threads, reads, replies],
				lastCourseAccess
			];
		}
	}

	_choseSortFunction(column, order) {
		const ORDER = {
			'asc': [-1, 1, 0],
			'desc': [1, -1, 0]
		};
		if (column === ACTIVE_TABLE_COURSES.COURSE_NAME) {
			// NB: "desc" and "asc" are inverted for course info: desc sorts a-z whereas asc sorts z-a
			return (course1, course2) => {
				const courseId1 = course1[ACTIVE_TABLE_COURSES.COURSE_NAME].toLowerCase();
				const courseId2 = course2[ACTIVE_TABLE_COURSES.COURSE_NAME].toLowerCase();
				return (courseId1 > courseId2 ? ORDER[order][0] :
					courseId1 < courseId2 ? ORDER[order][1] :
						ORDER[order][2]);
			};
		}

		return (course1, course2) => {
			// undefined is neither greater or less then a value so we set it to -infinity
			const record1 = course1[column] ? course1[column] : Number.NEGATIVE_INFINITY;
			const record2 = course2[column] ? course2[column] : Number.NEGATIVE_INFINITY;
			return (record1 > record2 ? ORDER[order][1] :
				record1 < record2 ? ORDER[order][0] :
					ORDER[order][2]);
		};
	}

	_formatDataForDisplay(user) {
		if (this.isActiveTable) {
			return [
				user[ACTIVE_TABLE_COURSES.COURSE_NAME],
				user[ACTIVE_TABLE_COURSES.CURRENT_GRADE] ? formatPercent(user[ACTIVE_TABLE_COURSES.CURRENT_GRADE] / 100, numberFormatOptions) : this.localize('activeCoursesTable:noGrade'),
				user[ACTIVE_TABLE_COURSES.PREDICTED_GRADE] ? formatPercent(user[ACTIVE_TABLE_COURSES.PREDICTED_GRADE], numberFormatOptions) : this.localize('activeCoursesTable:noPredictedGrade'),
				formatNumber(user[ACTIVE_TABLE_COURSES.TIME_IN_CONTENT] / 60, numberFormatOptions),
				user[ACTIVE_TABLE_COURSES.DISCUSSION_ACTIVITY],
				user[ACTIVE_TABLE_COURSES.COURSE_LAST_ACCESS] ? formatDateTime(new Date(user[ACTIVE_TABLE_COURSES.COURSE_LAST_ACCESS]), { format: 'medium' }) : this.localize('usersTable:null')
			];
		} else {
			return [
				user[INACTIVE_TABLE_COURSES.COURSE_NAME],
				user[INACTIVE_TABLE_COURSES.CURRENT_GRADE] ? formatPercent(user[INACTIVE_TABLE_COURSES.CURRENT_GRADE] / 100, numberFormatOptions) : this.localize('activeCoursesTable:noGrade'),
				formatNumber(user[INACTIVE_TABLE_COURSES.TIME_IN_CONTENT] / 60, numberFormatOptions),
				user[INACTIVE_TABLE_COURSES.DISCUSSION_ACTIVITY],
				user[INACTIVE_TABLE_COURSES.COURSE_LAST_ACCESS] ? formatDateTime(new Date(user[INACTIVE_TABLE_COURSES.COURSE_LAST_ACCESS]), { format: 'medium' }) : this.localize('usersTable:null')
			];
		}
	}

	// @computed
	get userDataForDisplay() {
		// map to a 2D userData array, with column 1 as a sub-array of [id, FirstName, LastName, UserName]
		// then sort by the selected sorting function
		const sortFunction = this._choseSortFunction(this._sortColumn, this._sortOrder);
		return this.data.records
			.filter(this._shouldDisplayinTable, this)
			.map(this._preProcessData, this)
			.sort(sortFunction)
			.map(this._formatDataForDisplay, this);
	}

	get columnInfo() {
		if (this.isActiveTable) {
			return [
				{
					headerText: this.localize('activeCoursesTable:course'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('activeCoursesTable:currentGrade'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('activeCoursesTable:predictedGrade'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('activeCoursesTable:timeInContent'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('activeCoursesTable:discussions'),
					columnType: COLUMN_TYPES.SUB_COLUMNS
				},
				{
					headerText: this.localize('activeCoursesTable:courseLastAccess'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				}
			];
		} else {
			return [
				{
					headerText: this.localize('inactiveCoursesTable:course'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('inactiveCoursesTable:grade'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('inactiveCoursesTable:content'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('inactiveCoursesTable:discussions'),
					columnType: COLUMN_TYPES.SUB_COLUMNS
				},
				{
					headerText: this.localize('inactiveCoursesTable:lastAccessedCourse'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				}
			];
		}
	}

	get headersForExport() {
		return [
			this.localize('activeCoursesTable:course'),
			this.localize('activeCoursesTable:grade'),
			this.localize('activeCoursesTable:predictedGrade'),
			this.localize('activeCoursesTable:timeInContent'),
			this.localize('discussionActivityCard:threads'),
			this.localize('discussionActivityCard:reads'),
			this.localize('discussionActivityCard:replies'),
			this.localize('activeCoursesTable:courseLastAccess'),
			this.localize('activeCoursesTable:isActive')
		];
	}

	get dataForExport() {
		const arrayOfHeaderColumnIndexes = Object.values(ACTIVE_TABLE_COURSES);
		arrayOfHeaderColumnIndexes.push(IS_ACTIVE_COURSE);
		const sortFunction = this._choseSortFunction(this._sortColumn, this._sortOrder);
		const userData = this.data.records
			.filter(record => record[RECORD.USER_ID] === this.user.userId)
			//since function call will always be for the first active table, then the isActiveTable will equal true
			.map(this._preProcessData, this)
			.sort(sortFunction)
			.map(this._formatDataForDisplay, this);

		return userData
			.map(user => arrayOfHeaderColumnIndexes.flatMap(column => {
				const val = user[column];
				if (column === IS_ACTIVE_COURSE) {
					const isCourseActive = this._activeCourseById(Number(this._getOrgIdFromCourseNameString(user[ACTIVE_TABLE_COURSES.COURSE_NAME])));
					return [isCourseActive];
				}
				return val;
			}));
	}

	_activeCourseById(orgUnitId) {
		return this.data.orgUnitTree.getActiveStatus(orgUnitId);
	}

	_getOrgIdFromCourseNameString(str) {
		const result = str.match(/\(Id: ([0-9]+)\)/);
		return result ? result[1] : 0;
	}

	_handlePageChange(event) {
		this._currentPage = event.detail.page;
	}

	_handlePageSizeChange(event) {
		this._currentPage = 1;
		this._pageSize = Number(event.detail.itemCount); // itemCount comes back as a string
	}

	updated() {
		if (this.skeleton) {
			this._currentPage = 0;
			return;
		}

		if (this._itemsCount === 0) {
			this._currentPage = 0;
		} else if (this._currentPage === 0) {
			this._currentPage = 1;
		}
	}

	render() {
		if (this._displayData.length !== 0 && this.isActiveTable) {
			return this._renderActiveCoursesTable();
		}
		else if (this._displayData.length !== 0 && !this.isActiveTable) {
			return this._renderInactiveCoursesTable();
		}
	}

	_renderActiveCoursesTable() {
		return html`
			<d2l-insights-table
				title="${this.localize('activeCoursesTable:title')}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="0"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
			></d2l-insights-table>
		`;
	}

	_renderInactiveCoursesTable() {
		return html`
			<d2l-insights-table
				title="${this.localize('inactiveCoursesTable:title')}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="0"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
			></d2l-insights-table>
			<d2l-labs-pagination
				show-item-count-select
				item-count-options="[10,20,50,100]"
				page-number="${this._currentPage}"
				max-page-number="${this._maxPages}"
				selected-count-option="${this._pageSize}"
				@pagination-page-change="${this._handlePageChange}"
				@pagination-item-counter-change="${this._handlePageSizeChange}"
			></d2l-labs-pagination>
			`;
	}
}
decorate(UserDrillCoursesTable, {
	userDataForDisplay: computed,
	headersForExport: computed,
	dataForExport: computed,
	_sortColumn: observable,
	_sortOrder: observable,
	_handleColumnSort: action
});
customElements.define('d2l-insights-user-drill-courses-table', UserDrillCoursesTable);
