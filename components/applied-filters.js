import './summary-card.js';
import 'd2l-facet-filter-sort/components/d2l-applied-filters/d2l-applied-filters';
import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown.js';
import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown-category.js';
import 'd2l-facet-filter-sort/components/d2l-filter-dropdown/d2l-filter-dropdown-option.js';

import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { repeat } from 'lit-html/directives/repeat';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

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
	}

	render() {
		const filters = Object.keys(this.data.cardFilters).map(id => ({
			id: id,
			title: this.data.cardFilters[id].title,
			isApplied: this.data.cardFilters[id].isApplied
		}));

		if (filters.filter(f => f.isApplied).length < 1) {
			return  html``;
		}

		filters.push({
			id: clearAllOptionId,
			title: this.localize('components:insights-applied-filters:clear-all'),
			isApplied: true
		});

		// clear all button appears if 4 or more filters are applied
		return html`
			<div style="display: none;">
				<d2l-filter-dropdown id="d2l-insights-applied-filters-dropdown" total-selected-option-count="${filters.length}">
					<d2l-filter-dropdown-category
						disable-search
						@d2l-filter-dropdown-option-change="${this._filterChangeHandler}"
					>
						${repeat(filters, (f) => `${f.id}:${f.isApplied}`, (item) => html`<d2l-filter-dropdown-option
								text="${item.title}"
								value="${item.id}"
								?selected="${item.isApplied}"
							></d2l-filter-dropdown-option>`)}

					</d2l-filter-dropdown-category>
				</d2l-filter-dropdown>
			</div>

			${!this.skeleton
				? html`<d2l-applied-filters for="d2l-insights-applied-filters-dropdown"></d2l-applied-filters>`
				: html``
			}
		`;
	}

	_filterChangeHandler(event) {
		if (event.detail.menuItemKey === clearAllOptionId) {
			Object.keys(this.data.cardFilters)
				.forEach(f => this.data.setApplied(f, false));
			return;
		}

		this.data.setApplied(event.detail.menuItemKey, event.detail.selected);
	}
}
customElements.define('d2l-insights-applied-filters', AppliedFilters);
