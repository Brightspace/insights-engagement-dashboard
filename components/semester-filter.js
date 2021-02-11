import './dropdown-filter';

import { html, LitElement } from 'lit-element';
import { fetchSemesters as fetchDemoSemesters } from '../model/fake-lms';
import { fetchSemesters } from '../model/dataApiClient';
import { Localizer } from '../locales/localizer';

/**
 * @property {number[]} selected - array of selected ids (read-only)
 * @property {number[]} preSelected - array of ids selected by code (write-only)
 * @property {number} page-size
 * @property {boolean} demo
 * @fires d2l-insights-semester-filter-change
 * @fires d2l-insights-semester-filter-close
 */
class SemesterFilter extends Localizer(LitElement) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			pageSize: { type: Number, attribute: 'page-size' },
			preSelected: { type: Array, attribute: false },
			_filterData: { type: Array, attribute: false },
			_bookmark: { type: String, attribute: false },
			_search: { types: String, attribute: false }
		};
	}

	constructor() {
		super();
		/** @type {{id: string, displayName: string}[]} */
		this._filterData = [];
		this._bookmark = null;
		this.pageSize = 3;
		this.preSelected = [];
	}

	get selected() {
		return this.shadowRoot
			.querySelector('d2l-insights-dropdown-filter')
			.selected
			.map(semesterId => Number(semesterId));
	}

	async firstUpdated() {
		this.dataProvider = this.isDemo ? fetchDemoSemesters : fetchSemesters;
		await this._loadData();
	}

	render() {
		return html`
			<d2l-insights-dropdown-filter
				name="${this.localize('semesterFilter:name')}"
				.data="${this._filterDataWithSelections}"

				@d2l-insights-dropdown-filter-selected="${this._updateFilterSelections}"
				@d2l-insights-dropdown-filter-selection-cleared="${this._updateFilterSelections}"
				@d2l-insights-dropdown-filter-close="${this._filterClose}"
			>
			</d2l-insights-dropdown-filter>
		`;
	}

	get _filterDataWithSelections() {
		const selectedSet = new Set(this.preSelected);
		return this._filterData.map(item =>	({ ...item, selected: selectedSet.has(Number(item.id)) }));
	}

	async _loadData() {
		const data = await this.dataProvider(this.pageSize);

		this._filterData = data.Items.map(item => ({
			id: item.orgUnitId.toString(),
			name: item.orgUnitName,
			displayName: this.localize('semesterFilter:semesterName', item)
		}));
	}

	_updateFilterSelections() {
		/**
		 * @event d2l-insights-semester-filter-change
		 */
		this.dispatchEvent(new Event('d2l-insights-semester-filter-change'));
	}

	_filterClose() {
		/**
		 * @event d2l-insights-semester-filter-close
		 */
		this.dispatchEvent(new Event('d2l-insights-semester-filter-close'));
	}
}
customElements.define('d2l-insights-semester-filter', SemesterFilter);
