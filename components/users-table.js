import '@brightspace-ui/core/components/inputs/input-text';
import '@brightspace-ui-labs/pagination/pagination';
import './table.js';

import { css, html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

export const TABLE_USER = {
	LAST_FIRST_NAME: 0,
	// LAST_ACCESSED_SYSTEM: 1,
	COURSES: 1,
	AVG_GRADE: 2,
	AVG_TIME_IN_CONTENT: 3
	// AVG_DISCUSSION_ACTIVITY: 4
};

/**
 * At the moment the mobx data object is doing sorting / filtering logic
 *
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Number} _currentPage
 * @property {Number} _pageSize
 */
class UsersTable extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			_currentPage: { type: Number, attribute: false },
			_pageSize: { type: Number, attribute: false }
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
				}

				.d2l-insights-users-table-total-users {
					margin-bottom: 30px;
					width: 100%;
				}
			`
		];
	}

	constructor() {
		super();
		this.data = {
			userDataForDisplay: []
		};
		this._currentPage = 1;
		this._pageSize = 20;
	}

	get _itemsCount() {
		return this.data.userDataForDisplay.length;
	}

	get _maxPages() {
		const itemsCount = this._itemsCount;
		return itemsCount ? Math.ceil(itemsCount / this._pageSize) : 0;
	}

	get _displayData() {
		if (this._itemsCount) {
			const start = this._pageSize * (this._currentPage - 1);
			const end = this._pageSize * (this._currentPage); // it's ok if this is larger than the size of the array

			return this.data.userDataForDisplay.slice(start, end);
		}

		return [];
	}

	get columnHeaders() {
		return [
			this.localize('components.insights-users-table.lastFirstName'),
			// this.localize('components.insights-users-table.lastAccessedSystem'),
			this.localize('components.insights-users-table.courses'),
			this.localize('components.insights-users-table.avgGrade'),
			this.localize('components.insights-users-table.avgTimeInContent')
			// this.localize('components.insights-users-table.avgDiscussionActivity')
		];
	}

	render() {
		return html`
			<d2l-insights-table
				title="${this.localize('components.insights-users-table.title')}"
				.columnHeaders=${this.columnHeaders}
				.data="${this._displayData}"></d2l-insights-table>

			<d2l-labs-pagination
				show-item-count-select
				item-count-options="[10,20,50,100]"
				page-number="${this._currentPage}"
				max-page-number="${this._maxPages}"
				selected-count-option="${this._pageSize}"
				@pagination-page-change="${this._handlePageChange}"
				@pagination-item-counter-change="${this._handlePageSizeChange}"
			></d2l-labs-pagination>

			<div class="d2l-insights-users-table-total-users">
				${this.localize('components.insights-users-table.totalUsers', { num: this._itemsCount })}
			</div>
		`;
	}

	updated() {
		if (this._itemsCount === 0) {
			this._currentPage = 0;
		} else if (this._currentPage === 0) {
			this._currentPage = 1;
		}
	}

	_handlePageChange(event) {
		this._currentPage = event.detail.page;
	}

	_handlePageSizeChange(event) {
		this._currentPage = 1;
		this._pageSize = Number(event.detail.itemCount); // itemCount comes back as a string
	}
}
customElements.define('d2l-insights-users-table', UsersTable);
