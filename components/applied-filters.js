import './summary-card.js';
import '@brightspace-ui-labs/facet-filter-sort/components/applied-filters/applied-filters';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown.js';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown-category.js';
import '@brightspace-ui-labs/facet-filter-sort/components/filter-dropdown/filter-dropdown-option.js';

import { css, html } from 'lit-element';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import { filterEventQueue } from './alert-data-update.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { nothing } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

const clearAllOptionId = 'clear-all';

class AppliedFilters extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [super.styles, bodySmallStyles, css`
			.d2l-insights-tag-container {
				display: flex;
				flex-wrap: wrap;
			}

			.d2l-insights-applied-filters-title {
				display: inline-block;
				font-size: 0.8rem;
				font-weight: 700;
				margin-right: 0.25rem;
			}

			.d2l-insights-tag-item {
				align-items: center;
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.25rem;
				display: flex;
				font-size: 0.8rem;
				justify-content: center;
				line-height: normal;
				margin-bottom: 10px;
				margin-right: 10px;
				outline: none;
				padding-left: 12px;
				user-select: none;
			}

			.d2l-insights-tag-item:hover {
				background-color: var(--d2l-color-gypsum);
				border-color: var(--d2l-color-mica);
			}
			.d2l-insights-tag-item:focus {
				background-color: var(--d2l-color-celestine);
				color: white;
			}

			.d2l-insights-tag-item:focus > d2l-icon {
				filter: brightness(5);
			}

			d2l-icon {
				cursor: pointer;
				filter: brightness(2);
				height: 15px;
				padding: 8px 12px;
				width: 15px;
			}

			d2l-icon:hover {
				filter: brightness(1);
			}
		`];
	}

	constructor() {
		super();
		this.data = {};
		this.currentFocus = 0;
		this.eventFollowedKeyEvent = false;
		this.addEventListener('keypress', this._handleKeyEvents);
		this.addEventListener('keydown', this._handleKeyEvents);
	}

	_handleKeyEvents(e) {
		const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');
		const totalTags = tags.length - 1;

		if (e.keyCode === 32 || e.keyCode === 13) {
			e.preventDefault();
			this.eventFollowedKeyEvent = true;
			tags[this.currentFocus].querySelector('d2l-icon').click();
		} else if (e.keyCode === 37) {
			e.preventDefault();
			tags[this.currentFocus].blur();
			this.currentFocus -= 1;
			if (this.currentFocus < 0) {
				this.currentFocus = totalTags;
			}
			tags[this.currentFocus].focus();
		} else if (e.keyCode === 39) {
			e.preventDefault();
			tags[this.currentFocus].blur();
			this.currentFocus += 1;
			if (this.currentFocus > totalTags) {
				this.currentFocus = 0;
			}
			tags[this.currentFocus].focus();
		}
	}

	_handleFocus(e) {
		// reset the current focus to the clicked or tabbed into element
		const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');
		const indexOfTag = [...tags].indexOf(e.target);
		this.currentFocus = indexOfTag;
	}

	render() {

		const localizer = (term, options) => this.localize(term, options);

		const filters = this.data.filters.map(f => {
			const title = f.descriptiveTitle ?
				f.descriptiveTitle(this.localize(f.title)) :
				this.localize(f.title);

			return {
				id: f.id,
				title,
				isApplied: f.isApplied,
				description: f.axeDescription ? f.axeDescription(localizer, 'appliedFilters:axeDescriptionCategories') : title
			};
		});

		if (filters.filter(f => f.isApplied).length < 1) {
			return  html``;
		}

		filters.push({
			id: clearAllOptionId,
			title: this.localize('appliedFilters:clearAll'),
			isApplied: true,
			description: this.localize('appliedFilters:clearAll')
		});

		// clear all button appears if 4 or more filters are applied
		// the eslint indent rules don't make sense for nested template literals
		/* eslint-disable indent*/
		const isFirst = {
			_isFirst: true,
			get() {
				const result = this._isFirst;
				this._isFirst = false;
				return result;
			}
		};

		return html`
			${!this.skeleton ?
				html`
				<div class="d2l-insights-tag-container">
					<span class="d2l-insights-applied-filters-title">${this.localize('appliedFilters:labelText')}</span>
					${repeat(filters, (item) => `${item.id}:${item.isApplied}`, (item) => (item.isApplied ? html`
						<div @focus="${this._handleFocus}" tabindex="${isFirst.get() ? 0 : -1}" class="d2l-insights-tag-item" data-filter-id="${item.id}" aria-label="${item.description}" role="button">
							${ item.title }
							<d2l-icon @click="${this._filterChangeHandler}" icon="tier1:close-default"></d2l-icon>
						</div>
					` : nothing))}
				</div>`
				: html``
			}`;
		/* eslint-enable indent*/
	}

	_getFilterFromEvent(event) {
		const filterId = event.target.parentElement.getAttribute('data-filter-id');

		if (filterId === clearAllOptionId) {
			return { id: clearAllOptionId };
		} else {
			return this.data.filters.find(filter => filter.id === filterId);
		}
	}

	_filterChangeHandler(event) {

		const filter = this._getFilterFromEvent(event);

		if (filter.id === clearAllOptionId) {
			this.data.clearFilters();
			return;
		}
		filterEventQueue.add(
			this.localize('alert:axeNotFiltering', { chartName: this.localize(filter.title) })
		);
		filter.isApplied = false;

		if (this.eventFollowedKeyEvent) {
			this.eventFollowedKeyEvent = false;
			setTimeout(() => {
				const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');

				if (tags.length === 0) return;
				tags[this.currentFocus].focus();
			}, 10);
		}
	}
}
customElements.define('d2l-insights-applied-filters', AppliedFilters);
