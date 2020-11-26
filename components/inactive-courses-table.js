import './table.js';
import { action, computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { COLUMN_TYPES } from './table';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

export const TABLE_COURSES = {
	COURSE_NAME: 0,
	CURRENT_GRADE: 1,
	PREDICTED_GRADE: 2,
	TIME_IN_CONTENT: 3,
	DISCUSSION_ACTIVITY: 4,
	COURSE_LAST_ACCESS: 5
};

const numberFormatOptions = { maximumFractionDigits: 2 };

const DEFAULT_PAGE_SIZE = 20;

/**
 * The mobx data object is doing filtering logic
 *
 * @property {Object} data - an instance of Data from model/data.js filtered to only one user
 * @property {Object} orgUnitTree - an instance of orgUnitTree from model/data.js
 * @property {Number} _sortColumn - The index of the column that is currently sorted
 * @property {String} _sortOrder - either 'asc' or 'desc'
 */
class InactiveCoursesTable extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			orgUnitTree: { type: Object, attribute: false },
			_sortColumn: { type: Number, attribute: false },
			_sortOrder: { type: String, attribute: false },
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
			`
		];
	}

	constructor() {
		super();
		this._sortOrder = 'desc';
		this._sortColumn = TABLE_COURSES.COURSE_NAME;
	}

	get _itemsCount() {
		return this.userDataForDisplayFormatted.length;
	}

	// don't use displayData.length to get the itemsCount. When we display a skeleton view, displayData.length is
	// the number of skeleton rows we're displaying, but the Total Users count should still be 0
	get _displayData() {
		if (this.skeleton) {
			const loadingPlaceholderText = this.localize('components.insights-users-table.loadingPlaceholder');

			// a DEFAULT_PAGE_SIZE x columnInfoLength 2D array filled with a generic string
			return Array(DEFAULT_PAGE_SIZE).fill(Array(this.columnInfo.length).fill(loadingPlaceholderText));
		}

		if (this._itemsCount) {
			return this.userDataForDisplayFormatted;
		}

		return [];
	}

	_handleColumnSort(e) {
		this._sortOrder = e.detail.order;
		this._sortColumn = e.detail.column;
	}

	_preProcessData(userRecords) {
		const orgUnitId =  userRecords.get(RECORD.ORG_UNIT_ID);
		const orgUnitName = this.orgUnitTree._nodes.get(orgUnitId)[1];
		const finalGrade = userRecords.get(RECORD.CURRENT_FINAL_GRADE);
		const predictedGrade = userRecords.get(RECORD.CURRENT_FINAL_GRADE);
		const timeInContent = userRecords.get(RECORD.TIME_IN_CONTENT);
		const threads = userRecords.get(RECORD.DISCUSSION_ACTIVITY_THREADS);
		const reads = userRecords.get(RECORD.DISCUSSION_ACTIVITY_READS);
		const replies = userRecords.get(RECORD.DISCUSSION_ACTIVITY_REPLIES);
		const lastCourseAccess = userRecords.get(RECORD.COURSE_LAST_ACCESS) ? new Date(userRecords.get(RECORD.COURSE_LAST_ACCESS)) : undefined;

		return [
			this.localize('components.tree-filter.node-name', { orgUnitName, id: orgUnitId }),
			finalGrade,
			predictedGrade,
			timeInContent,
			[threads, reads, replies],
			lastCourseAccess
		];
	}

	_choseSortFunction(column, order) {
		const ORDER = {
			'asc': [-1, 1, 0],
			'desc': [1, -1, 0]
		};
		if (column === TABLE_COURSES.COURSE_NAME) {
			// NB: "desc" and "asc" are inverted for course info: desc sorts a-z whereas asc sorts z-a
			return (course1, course2) => {
				const courseId1 = course1[TABLE_COURSES.COURSE_NAME].toLowerCase();
				const courseId2 = course2[TABLE_COURSES.COURSE_NAME].toLowerCase();
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
		const lastSysAccessFormatted = user[TABLE_COURSES.COURSE_LAST_ACCESS]
			? formatDateTime(new Date(user[TABLE_COURSES.COURSE_LAST_ACCESS]), { format: 'medium' })
			: this.localize('components.insights-users-table.null');
		return [
			user[TABLE_COURSES.COURSE_NAME],
			user[TABLE_COURSES.CURRENT_GRADE] ? formatPercent(user[TABLE_COURSES.CURRENT_GRADE] / 100, numberFormatOptions) : '',
			user[TABLE_COURSES.PREDICTED_GRADE] ? formatPercent(user[TABLE_COURSES.PREDICTED_GRADE] / 100, numberFormatOptions) : '',
			formatNumber(user[TABLE_COURSES.TIME_IN_CONTENT] / 60, numberFormatOptions),
			user[TABLE_COURSES.DISCUSSION_ACTIVITY],
			lastSysAccessFormatted
		];
	}

	// @computed
	get userDataForDisplay() {
		// map to a 2D userData array, with column 1 as a sub-array of [id, FirstName, LastName, UserName]
		// then sort by the selected sorting function
		const sortFunction = this._choseSortFunction(this._sortColumn, this._sortOrder);
		return this.data
			.map(this._preProcessData, this)
			.sort(sortFunction)
			.map(this._formatDataForDisplay, this);
	}

	get userDataForDisplayFormatted() {
		return this.userDataForDisplay.map(data => {
			return [
				data[TABLE_COURSES.COURSE_NAME],
				data[TABLE_COURSES.CURRENT_GRADE],
				data[TABLE_COURSES.PREDICTED_GRADE],
				data[TABLE_COURSES.TIME_IN_CONTENT],
				data[TABLE_COURSES.DISCUSSION_ACTIVITY],
				data[TABLE_COURSES.COURSE_LAST_ACCESS]];
		});
	}

	get columnInfo() {
		return [
			{
				headerText: this.localize('components.insights-active-courses-table.course'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('components.insights-active-courses-table.currentGrade'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('components.insights-active-courses-table.predictedGrade'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('components.insights-active-courses-table.timeInContent'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('components.insights-active-courses-table.discussions'),
				columnType: COLUMN_TYPES.SUB_COLUMNS
			},
			{
				headerText: this.localize('components.insights-active-courses-table.courseLastAccess'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			}
		];
	}

	render() {
		return html`
			<d2l-insights-table
				title="${this.localize('components.insights-users-table.title')}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="0"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
			></d2l-insights-table>
		`;
	}

}
decorate(InactiveCoursesTable, {
	userDataForDisplay: computed,
	userDataForDisplayFormatted: computed,
	_sortColumn: observable,
	_sortOrder: observable,
	_handleColumnSort: action
});
customElements.define('d2l-insights-inactive-courses-table', InactiveCoursesTable);
