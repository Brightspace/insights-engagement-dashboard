import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown.js';
import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown-category.js';
import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown-option.js';

import { css, html, LitElement } from 'lit-element';
import { Localizer } from '../locales/localizer';

/**
 * @property {string} name
 * @property {{id: string, displayName: string, selected: boolean}[]} data
 * @property {string[]} selected - returns list of ids for selected items
 * @property {string} filter - current search filter value; only matching items will be visible
 * @property {boolean} disable-search
 * @fires d2l-insights-dropdown-filter-selected - event.detail contains {string} filterName, {string} id, and {boolean} selected
 * @fires d2l-insights-dropdown-filter-selection-cleared
 * @fires d2l-insights-dropdown-filter-close
 */
class DropdownFilter extends Localizer(LitElement) {

	static get properties() {
		return {
			name: { type: String, attribute: true },
			data: { type: Array, attribute: false },
			filter: { type: String, attribute: true, reflect: true },
			disableSearch: { type: Boolean, attribute: 'disable-search' }
		};
	}

	static get styles() {
		return [css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			d2l-button-subtle {
				display: grid;
				margin: 0.25rem;
			}

			d2l-filter-dropdown-category[disable-search] {
				padding-top: 0;
			}
		`];
	}

	get selected() {
		return this.data
			.filter(item => item.selected)
			.map(item => item.id);
	}

	get _selectedData() {
		return this.data.filter(item => item.selected);
	}

	constructor() {
		super();

		/** {{id: string, displayName: string, selected: boolean}[]} */
		this.data = [];
		this.name = '';
		this.filter = '';
	}

	render() {
		const selected = this._selectedData;
		const selectedCount = selected.length;

		let openerSelectedText;
		if (selectedCount === 1) {
			// use name instead of displayName here to avoid showing semester ids in the main selector text
			openerSelectedText = this.localize('dropdownFilter:openerTextSingle', {
				filterName: this.name,
				selectedItemName: this._selectedData[0].name
			});
		} else {
			openerSelectedText = this.localize('dropdownFilter:openerTextMultiple', {
				filterName: this.name,
				selectedCount: selectedCount
			});
		}

		return html`
			<d2l-filter-dropdown
				total-selected-option-count="${selectedCount}"
				opener-text="${this.localize('dropdownFilter:openerTextAll', { filterName: this.name })}"
				opener-text-single="${openerSelectedText}"
				opener-text-multiple="${openerSelectedText}"
				header-text=""
				@d2l-filter-dropdown-cleared="${this._clearSelectionClick}"
				@d2l-dropdown-close="${this._filterClose}"
			>
				<d2l-filter-dropdown-category
					?disable-search="${this.disableSearch}"
					category-text="${this.name}"
					@d2l-filter-dropdown-option-change="${this._handleElementSelected}"
					@d2l-filter-dropdown-category-searched="${this._handleSearchedClick}"
				>
					${this.data.map(item => html`<d2l-filter-dropdown-option
 						text="${item.displayName}"
 						value="${item.id}"
 						?selected="${item.selected}"
 						?hidden="${!!this.filter && !item.displayName.toLowerCase().includes(this.filter.toLowerCase())}"
 					></d2l-filter-dropdown-option>`)}

				</d2l-filter-dropdown-category>
			</d2l-filter-dropdown>
		`;
	}

	_handleElementSelected(event) {
		this._setSelectedState(event.detail.menuItemKey, event.detail.selected);

		/**
		 * @event d2l-insights-dropdown-filter-selected
		 */
		this.dispatchEvent(new CustomEvent('d2l-insights-dropdown-filter-selected', {
			detail: {
				itemId: event.detail.menuItemKey,
				selected: event.detail.selected
			}
		}));
	}

	_setSelectedState(id, selected) {
		this.data = this.data.map(x => (x.id === id ? { ...x, selected: selected } : x));
	}

	_handleSearchedClick(event) {
		this.filter = event.detail.value;
	}

	_clearSelectionClick() {
		this.data = this.data.map(x => ({ ...x, selected: false }));

		/**
		 * @event d2l-insights-dropdown-filter-selection-cleared
		 */
		this.dispatchEvent(new CustomEvent('d2l-insights-dropdown-filter-selection-cleared'));
	}

	_filterClose() {
		/**
		 * @event d2l-insights-dropdown-filter-close
		 */
		this.dispatchEvent(new CustomEvent('d2l-insights-dropdown-filter-close'));
	}
}

customElements.define('d2l-insights-dropdown-filter', DropdownFilter);
