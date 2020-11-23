import '@brightspace-ui/core/components/inputs/input-text';
import './table.js';
import { action, computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { RECORD, USER } from '../consts';
import { COLUMN_TYPES } from './table';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

export const TABLE_USER = {
	COURSE: 0,
	CURRENT_GRADE: 1,
	AVG_TIME_IN_CONTENT: 2,
	AVG_DISCUSSION_ACTIVITY: 3,
	LAST_ACCESSED_SYS: 4
};

const numberFormatOptions = { maximumFractionDigits: 2 };

const DEFAULT_PAGE_SIZE = 20;

/**
 * The mobx data object is doing filtering logic
 *
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Number} _sortColumn - The index of the column that is currently sorted
 * @property {String} _sortOrder - either 'asc' or 'desc'
 */
class UsersTable extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
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
		this._sortOrder = 'desc';
		this._sortColumn = TABLE_USER.COURSE;
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
		const finalGrade = userRecords.get(RECORD.CURRENT_FINAL_GRADE);
		const predictedGrade = userRecords.get(RECORD.CURRENT_FINAL_GRADE);
		const threads = userRecords.get(RECORD.DISCUSSION_ACTIVITY_THREADS);
		const reads = userRecords.get(RECORD.DISCUSSION_ACTIVITY_READS);
		const replies = userRecords.get(RECORD.DISCUSSION_ACTIVITY_REPLIES);
		const timeInContent = userRecords.get(RECORD.TIME_IN_CONTENT);

		return [
			`Org Unit ID: ${orgUnitId}`,
			finalGrade,
			predictedGrade,
			[threads, reads, replies],
			timeInContent
		];
	}

	_choseSortFunction(column, order) {
		const ORDER = {
			'asc': [-1, 1, 0],
			'desc': [1, -1, 0]
		};

		return (user1, user2) => {
			// undefined is neither greater or less then a value so we set it to -infinity
			const record1 = user1[column] ? user1[column] : Number.NEGATIVE_INFINITY;
			const record2 = user2[column] ? user2[column] : Number.NEGATIVE_INFINITY;
			return (record1 > record2 ? ORDER[order][1] :
				record1 < record2 ? ORDER[order][0] :
					ORDER[order][2]);
		};
	}

	_formatDataForDisplay(user) {
		return [
			user[TABLE_USER.COURSE],
			user[TABLE_USER.CURRENT_GRADE] ? formatPercent(user[TABLE_USER.CURRENT_GRADE] / 100, numberFormatOptions) : '',
			user[TABLE_USER.CURRENT_GRADE] ? formatPercent(user[TABLE_USER.CURRENT_GRADE] / 100, numberFormatOptions) : '',
			user[TABLE_USER.AVG_DISCUSSION_ACTIVITY],
			user[TABLE_USER.AVG_TIME_IN_CONTENT]
		];
	}

	// @computed
	get userDataForDisplay() {
		// map to a 2D userData array, with column 1 as a sub-array of [id, FirstName, LastName, UserName]
		// then sort by the selected sorting function
		const sortFunction = this._choseSortFunction(this._sortColumn, this._sortOrder);
		return this.data.recordsByUser.get(100)
			.map(this._preProcessData, this)
			.sort(sortFunction)
			.map(this._formatDataForDisplay, this);
	}

	get userDataForDisplayFormatted() {
		return this.userDataForDisplay.map(data => {
			return [
				data[TABLE_USER.COURSE],
				data[TABLE_USER.CURRENT_GRADE],
				data[TABLE_USER.AVG_TIME_IN_CONTENT],
				data[TABLE_USER.AVG_DISCUSSION_ACTIVITY],
				data[TABLE_USER.LAST_ACCESSED_SYS]];
		});
	}

	get dataForExport() {
		return this.userDataForDisplay;
	}

	get headersForExport() {
		const headerArray = this.columnInfo.map(item => item.headerText);
		return [
			this.localize('components.insights-users-table-export.lastName'),
			this.localize('components.insights-users-table-export.FirstName'),
			this.localize('components.insights-users-table-export.UserName'),
			this.localize('components.insights-users-table-export.UserID'),
			headerArray[TABLE_USER.COURSE],
			headerArray[TABLE_USER.CURRENT_GRADE],
			headerArray[TABLE_USER.AVG_TIME_IN_CONTENT],
			this.localize('components.insights-discussion-activity-card.threads'),
			this.localize('components.insights-discussion-activity-card.reads'),
			this.localize('components.insights-discussion-activity-card.replies'),
			headerArray[TABLE_USER.LAST_ACCESSED_SYS]
		];
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
				headerText: this.localize('components.insights-active-courses-table.discussions'),
				columnType: COLUMN_TYPES.SUB_COLUMNS
			},
			{
				headerText: this.localize('components.insights-active-courses-table.timeInContent'),
				columnType: COLUMN_TYPES.NORMAL_TEXT
			}
		];
	}

	render() {
		return html`
			<d2l-insights-table
				title="${this.localize('components.insights-users-table.title')}"
				@d2l-insights-table-sort="${this._handleColumnSort}"
				sort-column="1"
				.columnInfo=${this.columnInfo}
				.data="${this._displayData}"
				?skeleton="${this.skeleton}"
				@d2l-insights-table-select-changed="${this._handleSelectChanged}"
			></d2l-insights-table>
		`;
	}

}
decorate(UsersTable, {
	userDataForDisplay: computed,
	userDataForDisplayFormatted: computed,
	headersForExport: computed,
	_sortColumn: observable,
	_sortOrder: observable,
	_handleColumnSort: action
});
customElements.define('d2l-insights-active-courses-table', UsersTable);
