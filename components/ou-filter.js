import { css, html } from 'lit-element/lit-element.js';
import { fetchRelevantChildren, orgUnitSearch } from '../model/lms';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

/**
 * @property {Object} data - an instance of Data from model/data.js
 * @fires d2l-insights-ou-filter-change
 */
class OuFilter extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	render() {
		this.data.orgUnitTree.setAncestorFilter(this.data.selectedSemesterIds);
		return html`<div class="ou-filter" ?loading="${this.data.isLoading}">
			<d2l-insights-tree-filter
				.tree="${this.data.orgUnitTree}"
				opener-text="${this.localize('components:org-unit-filter:name-all-selected')}"
				opener-text-selected="${this.localize('components:org-unit-filter:name-some-selected')}"
				@d2l-insights-tree-filter-select="${this._onChange}"
				@d2l-insights-tree-filter-request-children="${this._onRequestChildren}"
				@d2l-insights-tree-filter-search="${this._onSearch}"
			>
			</d2l-insights-tree-filter>
		</div>`;
	}

	get selected() {
		return this.shadowRoot.querySelector('d2l-insights-tree-filter').selected;
	}

	_onChange() {
		/**
		 * @event d2l-insights-ou-filter-change
		 */
		this.dispatchEvent(new CustomEvent(
			'd2l-insights-ou-filter-change',
			{ bubbles: true, composed: false }
		));
	}

	async _onRequestChildren(event) {
		const el = event.target;
		const id = event.detail.id;
		const bookmark = event.detail.bookmark;
		const results = await fetchRelevantChildren(id, this.data.selectedSemesterIds, bookmark);
		el.addChildren(id, results.Items, results.PagingInfo.HasMoreItems, results.PagingInfo.Bookmark);
	}

	async _onSearch(event) {
		const el = event.target;
		const searchString = event.detail.searchString;
		const bookmark = event.detail.bookmark;
		const results = await orgUnitSearch(searchString, this.data.selectedSemesterIds, bookmark);
		el.addSearchResults(results.Items, results.PagingInfo.HasMoreItems, results.PagingInfo.Bookmark);
	}
}
customElements.define('d2l-insights-ou-filter', OuFilter);
