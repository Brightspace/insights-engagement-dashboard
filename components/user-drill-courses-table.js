import '@brightspace-ui-labs/pagination/pagination';

import './table.js';
import './message-container';

import { action, computed, decorate, observable } from 'mobx';
import { courseNameSort, defaultSort, SortMixin } from '../model/sorts.js';
import { css, html } from 'lit-element';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { COLUMN_TYPES } from './table';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

const TABLE_COLUMNS = {
	COURSE_NAME: 0,
	CURRENT_GRADE: 1,
	PREDICTED_GRADE: 2,
	TIME_IN_CONTENT: 3,
	DISCUSSION_ACTIVITY: 4,
	COURSE_LAST_ACCESS: 5,
	SEMESTER_NAME: 6
};

const numberFormatOptions = { maximumFractionDigits: 2 };

const DEFAULT_PAGE_SIZE = 20;

/**
 * The mobx data object is doing filtering logic
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Object} user - {firstName, lastName, username, userId}
 * @property {Boolean} isActiveTable - whether we want the active or inactive table to render
 */
class UserDrillCoursesTable extends SortMixin(SkeletonMixin(Localizer(MobxLitElement))) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			user: { type: Object, attribute: false },
			isActiveTable: { type: Boolean, attribute: false, reflect: true },
			_currentPage: { type: Number, attribute: false },
			_pageSize: { type: Number, attribute: false },
			selectedCourses: { type: Object, attribute: false },

			s3Enabled: { type: Boolean, attribute: 'student-success-system-enabled' },
			showDiscussionsCol: { type: Boolean, attribute: 'discussions-col', reflect: true },
			showGradeCol: { type: Boolean, attribute: 'grade-col', reflect: true },
			showLastAccessCol: { type: Boolean, attribute: 'last-access-col', reflect: true },
			showTicCol: { type: Boolean, attribute: 'tic-col', reflect: true },
			showPredictedGradeCol: { type: Boolean, attribute: 'predicted-grade-col', reflect: true },
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
		this._sortColumn = TABLE_COLUMNS.COURSE_NAME;
		this._currentPage = 1;
		this._pageSize = DEFAULT_PAGE_SIZE;

		this.showDiscussionsCol = false;
		this.showGradeCol = false;
		this.showLastAccessCol = false;
		this.showTicCol = false;
		this.showPredictedGradeCol = false;
		this.s3Enabled = false;

		this.sorts = [
			courseNameSort,
			defaultSort,
			defaultSort,
			defaultSort,
			defaultSort,
			defaultSort
		];
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

			return this.userDataForDisplay
				.slice(start, end)
				.map(course => this._getVisibleColumns().map(column => course[column]));
		}

		return [];
	}

	_handleColumnSort(e) {
		this._sortOrder = e.detail.order;
		// convert from index in visible columns to general column index matching TABLE_COLUMNS
		this._sortColumn = this._getVisibleColumns()[e.detail.column];
		this._currentPage = 1;
	}

	_shouldDisplayinTable(record) {
		const orgUnitId = record[RECORD.ORG_UNIT_ID];
		return record[RECORD.USER_ID] === this.user.userId && this.isActiveTable === this.data.orgUnitTree.isActive(orgUnitId);
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
		const semesterOrgUnitName = this._getSemesterNameByOrgUnitId(orgUnitId);

		return [
			this.localize('treeFilter:nodeName', { orgUnitName, id: orgUnitId }),
			finalGrade,
			predictedGrade,
			timeInContent,
			[threads, reads, replies],
			lastCourseAccess,
			semesterOrgUnitName
		];
	}

	_getSemesterNameByOrgUnitId(orgUnitId) {
		const ancestors = [...this.data.orgUnitTree.getAncestorIds(orgUnitId)];
		const semesterTypeId =  this.data.semesterTypeId;
		const firstSemesterOrgUnitId = ancestors.find(id => this.data.orgUnitTree.getType(id) === semesterTypeId);
		const semesterOrgUnitName = this.data.orgUnitTree.getName(firstSemesterOrgUnitId);
		return firstSemesterOrgUnitId ? this.localize('semesterFilter:semesterName', { orgUnitName: semesterOrgUnitName, orgUnitId: firstSemesterOrgUnitId }) : '';
	}

	_formatDataForDisplay(course) {
		const courseLastAccessFormatted = course[TABLE_COLUMNS.COURSE_LAST_ACCESS]
			? formatDateTime(new Date(course[TABLE_COLUMNS.COURSE_LAST_ACCESS]), { format: 'medium' })
			: this.localize('usersTable:null');

		return [
			course[TABLE_COLUMNS.COURSE_NAME],
			course[TABLE_COLUMNS.CURRENT_GRADE] ? formatPercent(course[TABLE_COLUMNS.CURRENT_GRADE] / 100, numberFormatOptions) : this.localize('activeCoursesTable:noGrade'),
			course[TABLE_COLUMNS.PREDICTED_GRADE] ? formatPercent(course[TABLE_COLUMNS.PREDICTED_GRADE], numberFormatOptions) : this.localize('activeCoursesTable:noPredictedGrade'),
			formatNumber(course[TABLE_COLUMNS.TIME_IN_CONTENT] / 60, numberFormatOptions),
			course[TABLE_COLUMNS.DISCUSSION_ACTIVITY],
			courseLastAccessFormatted,
			course[TABLE_COLUMNS.SEMESTER_NAME]
		];

	}

	// @computed
	get userDataForDisplay() {
		// map to a 2D userData array,
		// then sort by the selected sorting function
		if (this.skeleton) return [];
		const sortFunction = this._chosenSortFunction(this._sortColumn, this._sortOrder);
		return this.data
			.records
			.filter(record => this.selectedCourses.isEmpty || this.selectedCourses.has(record[RECORD.ORG_UNIT_ID]))
			.filter(this._shouldDisplayinTable, this)
			.map(this._preProcessData, this)
			.sort(sortFunction)
			.map(this._formatDataForDisplay, this);
	}

	_getVisibleColumns(isExport) {
		const includePredictedGrade = (this.isActiveTable || isExport) && this.s3Enabled && this.showPredictedGradeCol;
		const includeSemester = !this.isActiveTable || isExport;
		const columns = [TABLE_COLUMNS.COURSE_NAME];

		if (this.showGradeCol) columns.push(TABLE_COLUMNS.CURRENT_GRADE);
		if (includePredictedGrade) columns.push(TABLE_COLUMNS.PREDICTED_GRADE);
		if (this.showTicCol) columns.push(TABLE_COLUMNS.TIME_IN_CONTENT);
		if (this.showDiscussionsCol) columns.push(TABLE_COLUMNS.DISCUSSION_ACTIVITY);
		if (this.showLastAccessCol) columns.push(TABLE_COLUMNS.COURSE_LAST_ACCESS);
		if (includeSemester) columns.push(TABLE_COLUMNS.SEMESTER_NAME);

		return columns;
	}

	get columnInfo() {
		const columnInfo = this.isActiveTable ?
			[
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
				// semester column never included in active table
			] :
			[
				{
					headerText: this.localize('inactiveCoursesTable:course'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					headerText: this.localize('inactiveCoursesTable:grade'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				},
				{
					// placeholder: predicted grade: will never be included in inactive table
					headerText: '-',
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
				},
				{
					headerText: this.localize('inactiveCoursesTable:semester'),
					columnType: COLUMN_TYPES.NORMAL_TEXT
				}
			];

		return this._getVisibleColumns().map(column => columnInfo[column]);
	}

	get headersForExport() {
		const headers = [this.localize('activeCoursesTable:course')];

		if (this.showGradeCol) headers.push(this.localize('activeCoursesTable:grade'));
		if (this.s3Enabled && this.showPredictedGradeCol) headers.push(this.localize('activeCoursesTable:predictedGrade'));
		if (this.showTicCol) headers.push(this.localize('activeCoursesTable:timeInContent'));
		if (this.showDiscussionsCol) {
			headers.push(this.localize('discussionActivityCard:threads'));
			headers.push(this.localize('discussionActivityCard:reads'));
			headers.push(this.localize('discussionActivityCard:replies'));
		}
		if (this.showLastAccessCol) headers.push(this.localize('activeCoursesTable:courseLastAccess'));
		headers.push(this.localize('inactiveCoursesTable:semester'));
		headers.push(this.localize('activeCoursesTable:isActive'));

		return headers;
	}

	get dataForExport() {
		const visibleColumns = this._getVisibleColumns(true);
		return this.userDataForDisplay
			.map(course => [...visibleColumns.flatMap(column => course[column]), this.isActiveTable]);
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
			this._currentPage = 1;
			return;
		}

		if (this._itemsCount === 0) {
			this._currentPage = 1;
		} else if (this._currentPage === 0) {
			this._currentPage = 1;
		}
	}

	render() {
		if (!this.skeleton && this._displayData.length === 0) {
			const textKey = this.isActiveTable ? 'activeCoursesTable:empty' : 'inactiveCoursesTable:empty';
			return html`
				<d2l-insights-message-container type="default" text="${this.localize(textKey)}"></d2l-insights-message-container>
			`;
		} else {
			return this._renderCoursesTable();
		}
	}

	_renderCoursesTable() {
		const titleKey = this.isActiveTable ? 'activeCoursesTable:title' : 'inactiveCoursesTable:title';
		return html`
			<d2l-insights-table
				title="${this.localize(titleKey)}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="0"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
			></d2l-insights-table>
			${this._renderTablePagination()}
		`;
	}

	_renderTablePagination() {
		return html`
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
	skeleton: observable,
	_sortColumn: observable,
	_sortOrder: observable,
	_handleColumnSort: action
});
customElements.define('d2l-insights-user-drill-courses-table', UserDrillCoursesTable);
