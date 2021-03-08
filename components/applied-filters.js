import './summary-card.js';
import '@brightspace-ui-labs/facet-filter-sort/components/applied-filters/applied-filters';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown.js';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown-category.js';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown-option.js';

import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { repeat } from 'lit-html/directives/repeat';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { filterEventQueue } from './alert-data-update.js';

const clearAllOptionId = 'clear-all';

class AppliedFilters extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};

		this.addEventListener('keypress', this._handleKeyEvents);
	}

	_handleKeyEvents(e) {
		if (e.keyCode === 32 || e.keyCode === 13) {
			e.preventDefault();
			e.path[0].shadowRoot.querySelector('d2l-icon').click();
		}
	}

	render() {
		const filters = this.data.filters.map(f => ({
			id: f.id,
			title: this.localize(f.title),
			isApplied: f.isApplied,
		}));

		if (filters.filter(f => f.isApplied).length < 1) {
			return  html``;
		}

		filters.push({
			id: clearAllOptionId,
			title: this.localize('appliedFilters:clearAll'),
			isApplied: true
		});

		// clear all button appears if 4 or more filters are applied
		return html`
			<div style="display: none;">
				<d2l-labs-filter-dropdown id="d2l-insights-applied-filters-dropdown" total-selected-option-count="${filters.length}">
					<d2l-labs-filter-dropdown-category
						disable-search
						@d2l-labs-filter-dropdown-option-change="${this._filterChangeHandler}"
					>
						${repeat(filters, (f) => `${f.id}:${f.isApplied}`, (item) => html`<d2l-labs-filter-dropdown-option
								text="${item.title}"
								value="${item.id}"
								?selected="${item.isApplied}"
							></d2l-labs-filter-dropdown-option>`)}

					</d2l-labs-filter-dropdown-category>
				</d2l-labs-filter-dropdown>
			</div>

			${!this.skeleton
			? html`
				<d2l-labs-applied-filters
					for="d2l-insights-applied-filters-dropdown"
					label-text="${this.localize('appliedFilters:labelText')}">
				</d2l-labs-applied-filters>`
			: html``
		}
		`;
	}

	_filterChangeHandler(event) {

		// const filter = this.data.filters.find(f => ({
		// 	id: f.id,
		// 	title: this.localize(f.title),
		// 	isApplied: f.isApplied,
		// }));

		const filter = this.data.filters.find(filter => filter.id === event.detail.menuItemKey);

		if (event.detail.menuItemKey === clearAllOptionId) {
			this.data.clearFilters();
			return;
		}
		filterEventQueue.add(
			this.localize('alert:axeNotFiltering', { chartName: this.localize(filter.title) })
		);
		this.data.getFilter(event.detail.menuItemKey).isApplied = event.detail.selected;
	}
}
customElements.define('d2l-insights-applied-filters', AppliedFilters);
