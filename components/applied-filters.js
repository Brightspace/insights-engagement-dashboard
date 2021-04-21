import './summary-card.js';

import { css, html } from 'lit-element';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles';
import { filterEventQueue } from './alert-data-update.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { nothing } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

const clearAllOptionId = 'clear-all';
const showMoreOptionId = 'show-more';

class AppliedFilters extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			_showAll: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [super.styles, bodySmallStyles, css`
			.d2l-insights-tag-container {
				display: flex;
				flex-wrap: wrap;
				max-width: 1200px;
			}

			.d2l-insights-applied-filters-title {
				display: inline-block;
				font-size: 0.8rem;
				font-weight: 700;
				margin-right: 0.25rem;
				margin-top: 3px;
			}

			.d2l-insights-tag-item {
				align-items: center;
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 0.25rem;
				display: flex;
				font-size: 0.8rem;
				height: 33px;
				justify-content: center;
				line-height: normal;
				margin-bottom: 10px;
				margin-right: 10px;
				outline: none;
				padding-left: 12px;
				user-select: none;
			}

			.d2l-insights-tag-item.d2l-insights-tag-action {
				cursor: pointer;
				height: 33px;
				padding: 0 12px;
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
		this._showAll = false;
		this.addEventListener('keypress', this._handleKeyEvents);
		this.addEventListener('keydown', this._handleKeyEvents);
	}

	_getActiveFilters(filters) {
		return filters.filter(filter => filter.isApplied);
	}

	_isDesktop() {
		return matchMedia('(min-width: 700px)').matches;
	}

	_numToShow(filters) {
		if (this._isDesktop()) {
			this._showAll = true;
			return filters.length;
		}
		/* When we are on mobile we want to show a
		 * [Collapse] button that will hide away the
		 * tag overflow. We don't want to waste time drawing
		 * the tags so we guess how big they will be using the
		 * amount of text they have.
		 */
		const filterSizes = filters.map(filter => {
			filter.width = this.estimateTagWidth(filter);
			return filter;
		});
		const clearSize = 110; // size in pixels of the clear button (using the inspector)
		const titleSize = 200; // size in pixels of the title (using the inspector)
		const containerSize = document.body.clientWidth; // the container is the full width minus the margins which is already available

		let takenSpace = titleSize + clearSize;
		return filterSizes.filter(filter => (takenSpace + filter.width < containerSize ? takenSpace += filter.width : false)).length;
	}

	estimateTagWidth(filter) {
		// length or text (approximated) and padding
		return (filter.title.length * 18) + 40 + 12;
	}

	_handleKeyEvents(e) {
		const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');
		const totalTags = tags.length - 1;

		if (e.keyCode === 32 /* space */ || e.keyCode === 13 /* enter */) {
			e.preventDefault();
			this.eventFollowedKeyEvent = true;
			const close = tags[this.currentFocus].querySelector('d2l-icon');
			if (close) {
				close.click();
			} else {
				tags[this.currentFocus].click();
			}
		} else if (e.keyCode === 37 /* left arrow */) {
			e.preventDefault();
			tags[this.currentFocus].blur();
			this.currentFocus -= 1;
			if (this.currentFocus < 0) {
				this.currentFocus = totalTags;
			}
			tags[this.currentFocus].focus();
		} else if (e.keyCode === 39 /* right arrow */) {
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
		// reset the saved focus to the clicked or tabbed into element
		const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');
		const indexOfTag = [...tags].indexOf(e.target);
		this.currentFocus = indexOfTag;
	}

	_handleShowOrHide(e) {
		this._showAll = !this._showAll;
	}

	updated() {
		const tags = this.shadowRoot.querySelectorAll('.d2l-insights-tag-item');
		if (tags.length === 0) {
			// Collapse filters when all tags are removed on mobile;
			if (!this._isDesktop()) this._showAll = false;
			this.currentFocus = 0;
			return;
		}

		if (this.eventFollowedKeyEvent) {
			// if we removed a filter using the keyboard we need to
			// wait for this component to rerender and then
			// focus on the new tag in this position.
			this.eventFollowedKeyEvent = false;
			if (this.currentFocus < tags.length) {
				tags[this.currentFocus].focus();
			}
		}
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

		// used to figure out which active filter is first so we can set them as the tab entry point
		const count = {
			_count: 0,
			get() {
				const result = this._count;
				this._count += 1;
				return result;
			}
		};

		const clearAll = html`
		<div
			@click="${this._filterChangeHandler}"
			@keypress="${this._filterChangeHandler}"
			@focus="${this._handleFocus}"
			tabindex="-1"
			class="d2l-insights-tag-item d2l-insights-tag-action"
			data-filter-id="${clearAllOptionId}"
			aria-label="${this.localize('appliedFilters:clearAll')}"
			role="button">
			${ this.localize('appliedFilters:clearAll') }
		</div>
		`;

		const showOnly = this._numToShow(filters);
		const numHidden = this._getActiveFilters(filters).length - showOnly;

		const toggleMore = html`
			<div @focus="${this._handleFocus}" @click="${this._handleShowOrHide}" @keypress="${this._handleShowOrHide}" tabindex="-1" class="d2l-insights-tag-item d2l-insights-tag-action" data-filter-id="${showMoreOptionId}" aria-label="${this.localize('appliedFilters:clearAll')}" role="button">
				${ !this._showAll ? this.localize('appliedFilters:showMore', { numHidden }) : this.localize('appliedFilters:hideExtra')  }
			</div>
		`;

		const renderPill = (item) => {
			if (item.isApplied) {
				const currentCount = item.isApplied ? count.get() : 0;
				return (currentCount < showOnly || this._showAll) ? html`
					<div @focus="${this._handleFocus}" tabindex="${currentCount === 0 ? 0 : -1}" class="d2l-insights-tag-item d2l-insights-filter-tag" data-filter-id="${item.id}" aria-label="${item.description}" role="button">
						${ item.title }
						<d2l-icon @click="${this._filterChangeHandler}" icon="tier1:close-default"></d2l-icon>
					</div>
				` : nothing;
			}
			return nothing;
		};

		const title = html`
			<span class="d2l-insights-applied-filters-title">${this.localize('appliedFilters:labelText')}</span>
		`;

		// the eslint indent rules don't make sense for nested template literals
		/* eslint-disable indent*/
		return html`
			${!this.skeleton ? html`
				<div class="d2l-insights-tag-container">
					${ this._getActiveFilters(filters).length > 0 ? title : nothing }
					${repeat(filters, (item) => `${item.id}:${item.isApplied}`, renderPill)}
					${ this._getActiveFilters(filters).length > 0 && numHidden > 0 ? toggleMore : nothing }
					${ this._getActiveFilters(filters).length > 0 ? clearAll : nothing }
				</div>`
				: nothing
			}`;
		/* eslint-enable indent*/
	}

	_getFilterFromEvent(event) {
		const filterId = event.target.parentElement.getAttribute('data-filter-id') || event.target.getAttribute('data-filter-id');

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

	}
}
customElements.define('d2l-insights-applied-filters', AppliedFilters);
