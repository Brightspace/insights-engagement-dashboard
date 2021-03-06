import '@brightspace-ui-labs/pagination/pagination';
import '@brightspace-ui/core/components/inputs/input-text';
import './table.js';

import { action, computed, decorate, observable, reaction } from 'mobx';
import { css, html } from 'lit-element';
import { defaultSort, SortMixin, userNameSort } from '../model/sorts.js';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { RECORD, USER } from '../consts';
import { COLUMN_TYPES } from './table';
import { formatDateTimeFromTimestamp } from '@brightspace-ui/intl/lib/dateTime.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

export const TABLE_USER = {
	SELECTOR_VALUE: 0,
	NAME_INFO: 1,
	COURSES: 2,
	AVG_GRADE: 3,
	AVG_TIME_IN_CONTENT: 4,
	AVG_DISCUSSION_ACTIVITY: 5,
	LAST_ACCESSED_SYS: 6
};

export const numberFormatOptions = { maximumFractionDigits: 2 };

const DEFAULT_PAGE_SIZE = 20;

function avgOf(records, field) {
	const total = records.reduce((sum, r) => sum + r[field], 0);
	return total / records.length;
}

/**
 * The mobx data object is doing filtering logic
 *
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Number} _currentPage
 * @property {Number} _pageSize
 * @property {Number} _sortColumn - The index of the column that is currently sorted
 * @property {String} _sortOrder - either 'asc' or 'desc'
 * @property {Set} selectedUserIds - ids of users that are selected in the table
 */
class UsersTable extends SortMixin(SkeletonMixin(Localizer(MobxLitElement))) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			_currentPage: { type: Number, attribute: false },
			_pageSize: { type: Number, attribute: false },
			selectedUserIds: { type: Object, attribute: false },

			// user preferences:
			showCoursesCol: { type: Boolean, attribute: 'courses-col', reflect: true },
			showDiscussionsCol: { type: Boolean, attribute: 'discussions-col', reflect: true },
			showGradeCol: { type: Boolean, attribute: 'grade-col', reflect: true },
			showLastAccessCol: { type: Boolean, attribute: 'last-access-col', reflect: true },
			showTicCol: { type: Boolean, attribute: 'tic-col', reflect: true }
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

				.d2l-insights-users-table-total-users {
					margin-bottom: 30px;
					width: 100%;
				}

				.d2l-insights-scroll-container {
					overflow-x: auto;
				}
			`
		];
	}

	constructor() {
		super();
		this.data = {
			users: []
		};
		this._currentPage = 1;
		this._pageSize = DEFAULT_PAGE_SIZE;
		this._sortOrder = 'desc';
		this._sortColumn = TABLE_USER.NAME_INFO;
		this.selectedUserIds = new Set();
		this.showCoursesCol = false;
		this.showDiscussionsCol = false;
		this.showGradeCol = false;
		this.showLastAccessCol = false;
		this.showTicCol = false;

		this.sorts = [
			undefined, // we don't sort the checkboxes
			userNameSort,
			defaultSort,
			defaultSort,
			defaultSort,
			defaultSort,
			defaultSort
		];

		// reset selectedUserIds whenever the input data changes
		reaction(
			() => this.data.users,
			() => { this._resetSelectedUserIds(); }
		);

		this.selectorAriaLabel = this.localize('usersTable:selectorAriaLabel');
	}

	get _itemsCount() {
		return this._preprocessedData.length;
	}

	get _maxPages() {
		const itemsCount = this._itemsCount;
		return itemsCount ? Math.ceil(itemsCount / this._pageSize) : 0;
	}

	// should be reset whenever data, page or sorting state changes
	_resetSelectedUserIds() {
		this.selectedUserIds = new Set();
	}

	// don't use displayData.length to get the itemsCount. When we display a skeleton view, displayData.length is
	// the number of skeleton rows we're displaying, but the Total Users count should still be 0
	get _displayData() {
		if (this.skeleton) {
			const loadingPlaceholderText = this.localize('usersTable:loadingPlaceholder');

			// a DEFAULT_PAGE_SIZE x columnInfoLength 2D array filled with a generic string
			return Array(DEFAULT_PAGE_SIZE).fill(Array(this.columnInfo.length).fill(loadingPlaceholderText));
		}

		if (this._itemsCount) {

			const start = this._pageSize * (this._currentPage - 1);
			const end = this._pageSize * (this._currentPage); // it's ok if this goes over the end of the array
			const visibleColumns = this._visibleColumns;
			return this._formatForTable(this._sortedData.slice(start, end))
				.map(user => visibleColumns.map(column => user[column]));
		}

		return [];
	}

	_handleColumnSort(e) {
		this._sortOrder = e.detail.order;
		// convert from index in visible columns to general column index matching TABLE_USER
		this._sortColumn = this._visibleColumns[e.detail.column];
		this._currentPage = 0;

		this._resetSelectedUserIds();
	}

	_preProcessData(user) {
		// this method preps data that is then used for sorting; this means it runs on
		// every user (up to 50k with default limits) and should not do extra work.
		const recordsByUser = this.data.recordsByUser;

		const userId = user[USER.ID];
		const userLastFirstName = `${user[USER.LAST_NAME]}, ${user[USER.FIRST_NAME]}`;
		const selectorInfo = {
			// we don't use this column for sorting, so don't do additional work until formatting for
			// display, which runs after paging
			userId, userLastFirstName
		};
		const userInfo = [user[USER.ID], user[USER.FIRST_NAME], user[USER.LAST_NAME], user[USER.USERNAME]];
		const userRecords = recordsByUser.get(user[USER.ID]);
		const coursesWithGrades = userRecords.filter(r => r[RECORD.CURRENT_FINAL_GRADE] !== null);
		const avgFinalGrade = avgOf(coursesWithGrades, RECORD.CURRENT_FINAL_GRADE);
		const threads = avgOf(userRecords, RECORD.DISCUSSION_ACTIVITY_THREADS);
		const reads = avgOf(userRecords, RECORD.DISCUSSION_ACTIVITY_READS);
		const replies = avgOf(userRecords, RECORD.DISCUSSION_ACTIVITY_REPLIES);

		const userLastSysAccess = user[USER.LAST_SYS_ACCESS] ? new Date(user[USER.LAST_SYS_ACCESS]) : undefined;

		return [
			selectorInfo,
			userInfo,
			userRecords.length, // courses
			avgFinalGrade,
			avgOf(userRecords, RECORD.TIME_IN_CONTENT),
			[Math.round(threads), Math.round(reads), Math.round(replies)],
			userLastSysAccess
		];
	}

	_formatDataForDisplay(user, isForExport) {
		// runs for each user being drawn on the current page or exported
		const lastSysAccessFormatted = user[TABLE_USER.LAST_ACCESSED_SYS]
			? formatDateTimeFromTimestamp(user[TABLE_USER.LAST_ACCESSED_SYS], { format: 'medium' })
			: this.localize('usersTable:null');
		const averageGrade = user[TABLE_USER.AVG_GRADE]
			? formatPercent(user[TABLE_USER.AVG_GRADE] / 100, numberFormatOptions)
			: this.localize('usersTable:noGrades');
		const selectorData = user[TABLE_USER.SELECTOR_VALUE];
		// save time during export by not building aria strings which will not be used anyway
		const selectorInfo = isForExport ? {} : {
			value: selectorData.userId,
			ariaLabel: this.localize('usersTable:selectorAriaLabel', { userLastFirstName: selectorData.userLastFirstName }),
			selected: this.selectedUserIds.has(selectorData.userId)
		};

		return [
			selectorInfo,
			user[TABLE_USER.NAME_INFO],
			user[TABLE_USER.COURSES],
			averageGrade,
			formatNumber(user[TABLE_USER.AVG_TIME_IN_CONTENT] / 60, numberFormatOptions),
			user[TABLE_USER.AVG_DISCUSSION_ACTIVITY],
			lastSysAccessFormatted
		];
	}

	// @computed
	get _sortedData() {
		const sortFunction = this._chosenSortFunction(this._sortColumn, this._sortOrder);
		return this._preprocessedData.sort(sortFunction);
	}

	// @computed
	get _preprocessedData() {
		// map to a 2D userData array, with column 1 as a sub-array of [id, FirstName, LastName, UserName]
		return this.data.users
			.map(this._preProcessData, this);
	}

	_formatForTable(page) {
		return page
			.map(u => this._formatDataForDisplay(u))
			.map(data => [
				data[TABLE_USER.SELECTOR_VALUE],
				[`${data[TABLE_USER.NAME_INFO][USER.LAST_NAME]}, ${data[TABLE_USER.NAME_INFO][USER.FIRST_NAME]}`,
					`${data[TABLE_USER.NAME_INFO][USER.USERNAME]} - ${data[TABLE_USER.NAME_INFO][USER.ID]}`],
				data[TABLE_USER.COURSES],
				data[TABLE_USER.AVG_GRADE],
				data[TABLE_USER.AVG_TIME_IN_CONTENT],
				data[TABLE_USER.AVG_DISCUSSION_ACTIVITY],
				data[TABLE_USER.LAST_ACCESSED_SYS]
			]);
	}

	get dataForExport() {
		const visibleColumns = this._visibleColumns;
		const sortedData = this._sortedData;
		return sortedData
			.map(u => this._formatDataForDisplay(u, true))
			.map(user => visibleColumns.flatMap(column => {
				const val = user[column];
				if (column === TABLE_USER.NAME_INFO) {
					// setting a different order for these columns
					return [val[USER.LAST_NAME], val[USER.FIRST_NAME], val[USER.USERNAME], val[USER.ID]];
				}
				return val;
			})
				// skip the selector column
				.slice(1)
			);
	}

	get headersForExport() {
		const headers = [
			this.localize('usersTableExport:lastName'),
			this.localize('usersTableExport:FirstName'),
			this.localize('usersTableExport:UserName'),
			this.localize('usersTableExport:UserID')
		];
		if (this.showCoursesCol) headers.push(this.localize('usersTable:courses'));
		if (this.showGradeCol) headers.push(this.localize('usersTable:avgGrade'));
		if (this.showTicCol) headers.push(this.localize('usersTable:avgTimeInContent'));
		if (this.showDiscussionsCol) {
			headers.push(this.localize('discussionActivityCard:threads'));
			headers.push(this.localize('discussionActivityCard:reads'));
			headers.push(this.localize('discussionActivityCard:replies'));
		}
		if (this.showLastAccessCol) headers.push(this.localize('usersTable:lastAccessedSys'));

		return headers;
	}

	get _visibleColumns() {
		const columns = [TABLE_USER.SELECTOR_VALUE, TABLE_USER.NAME_INFO];

		if (this.showCoursesCol) columns.push(TABLE_USER.COURSES);
		if (this.showGradeCol) columns.push(TABLE_USER.AVG_GRADE);
		if (this.showTicCol) columns.push(TABLE_USER.AVG_TIME_IN_CONTENT);
		if (this.showDiscussionsCol) columns.push(TABLE_USER.AVG_DISCUSSION_ACTIVITY);
		if (this.showLastAccessCol) columns.push(TABLE_USER.LAST_ACCESSED_SYS);

		return columns;
	}

	get columnInfo() {
		const columnInfo = [
			{
				headerText: '', // no text should appear for this column header
				columnType: COLUMN_TYPES.ROW_SELECTOR
			},
			{
				headerText: this.localize('usersTable:lastFirstName'),
				columnType: COLUMN_TYPES.TEXT_SUB_TEXT,
				clickable: true,
				ariaLabelFn: (cellValue) => {
					return this.localize('usersTable:openUserPage', { userName: cellValue[0] });
				}
			},
			{
				headerText: this.localize('usersTable:courses'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('usersTable:avgGrade'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('usersTable:avgTimeInContent'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			},
			{
				headerText: this.localize('usersTable:avgDiscussionActivity'),
				columnType: COLUMN_TYPES.SUB_COLUMNS
			},
			{
				headerText: this.localize('usersTable:lastAccessedSys'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			}
		];

		return this._visibleColumns.map(column => columnInfo[column]);
	}

	render() {
		return html`
			<d2l-insights-table
				title="${this.localize('usersTable:title')}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="1"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
				@d2l-insights-table-select-changed="${this._handleSelectChanged}"
				@d2l-insights-table-cell-clicked="${this._handleCellClick}"
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

			${this._renderTotalUsers()}
		`;
	}

	_renderTotalUsers() {
		const itemCounts = this.skeleton ? 0 : this._itemsCount;

		return html`
			<div class="d2l-insights-users-table-total-users">
				${this.localize('usersTable:totalUsers', { num: itemCounts })}
			</div>
		`;
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

	_handlePageChange(event) {
		this._currentPage = event.detail.page;
		this._resetSelectedUserIds();
	}

	_handlePageSizeChange(event) {
		this._currentPage = 1;
		this._pageSize = Number(event.detail.itemCount); // itemCount comes back as a string
		this._resetSelectedUserIds();
	}

	_handleSelectChanged(event) {
		const changedUserIds = event.detail.values.map(value => Number(value));
		if (event.detail.selected) {
			this.selectedUserIds = new Set([...this.selectedUserIds, ...changedUserIds]);
		} else {
			this.selectedUserIds = new Set([...this.selectedUserIds].filter(userId => !changedUserIds.includes(userId)));
		}
	}

	_handleCellClick(event) {
		const table = this.shadowRoot.querySelector('d2l-insights-table');
		const row = table.data[event.detail.rowIdx];
		this.dispatchEvent(new CustomEvent('d2l-insights-users-table-cell-clicked', {
			detail: {
				userId: row[TABLE_USER.SELECTOR_VALUE].value,
				row: row,
				columnIdx: event.detail.columnIdx
			}
		}));
	}
}
decorate(UsersTable, {
	selectedUserIds: observable,
	headersForExport: computed,
	dataForExport: computed,
	_preprocessedData: computed,
	_sortedData: computed,
	_sortColumn: observable,
	_sortOrder: observable,
	_handleColumnSort: action
});
customElements.define('d2l-insights-users-table', UsersTable);
