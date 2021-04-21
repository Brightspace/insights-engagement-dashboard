
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { Localizer } from '../locales/localizer';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

/**
 * @property {Array} cards
 * @property {String} _screenSize - private property that allows forcing rendering after hit of media-query breakpoint
 */
class SummaryCardsContainer extends SkeletonMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			cards: { type: Array, attribute: false },

			_screenSize: { type: String, attribute: 'size', reflect: true }
		};
	}

	constructor() {
		super();
		this.cards = [];
		this._screenSize = this._getScreenSize();
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-insights-summary-container {
				display: flex;
				flex-shrink: 0;
				flex-wrap: wrap;
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
				max-width: var(--d2l-insights-engagement-big-card-width);
				min-width: var(--d2l-insights-engagement-big-card-width);
			}

			.d2l-insights-summary-container > * {
				flex-shrink: 0;
				margin-top: var(--d2l-insights-engagement-card-margin-top);
			}

			.d2l-insights-summary-container-0 {
				display: none;
			}

			.d2l-insights-summary-container-1 > :first-child {
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-2 > * {
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-3 > :first-child {
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-3 > :nth-child(2) {
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-4 > :nth-child(odd) {
				margin-inline-end: var(--d2l-insights-engagement-card-margin-right);

			}

			@media screen and (max-width: 615px) {
				.d2l-insights-summary-container-2 > * {
					margin-inline-end: 0;
				}

				.d2l-insights-summary-container-2 > :first-child {
					margin-inline-end: var(--d2l-insights-engagement-card-margin-right);
				}
			}
		`;
	}

	render() {
		const cards = this.cards;

		const summaryCardsCount = cards.filter(card => card.enabled || this.skeleton).length;

		const sizes = this._sizes(summaryCardsCount);

		const summaryCardsStyles = {
			'd2l-insights-summary-container': true,
			'd2l-insights-summary-container-0': summaryCardsCount === 0,
			'd2l-insights-summary-container-1': summaryCardsCount === 1,
			'd2l-insights-summary-container-2': summaryCardsCount === 2,
			'd2l-insights-summary-container-3': summaryCardsCount === 3,
			'd2l-insights-summary-container-4': summaryCardsCount === 4
		};

		let cardIndex = 0;
		return html`
			<div id="summary-cards" class="${classMap(summaryCardsStyles)}">
				${cards.filter(card => card.enabled || this.skeleton).map(card => card.htmlFn({ ...sizes[cardIndex++], skeleton: this.skeleton }))}
			</div>
		`;
	}

	get _isSmallScreen() {
		return matchMedia('(max-width: 615px)').matches;
	}

	_getScreenSize() {
		return this._isSmallScreen ? 'small' : 'normal';
	}

	_sizes(summaryCardsCount) {
		if (this._isSmallScreen) {
			return [
				{
					wide: summaryCardsCount === 1 || summaryCardsCount === 3,
					tall: false
				},
				{ wide: false, tall: false },
				{ wide: false, tall: false },
				{ wide: false, tall: false },
			];
		}

		return [
			{
				wide: summaryCardsCount === 1 || summaryCardsCount === 2 || summaryCardsCount === 3,
				tall: summaryCardsCount === 1
			},
			{ wide: summaryCardsCount === 2, tall: false },
			{ wide: false, tall: false },
			{ wide: false, tall: false },
		];
	}

	_handleResize() {
		// causes rendering only if the media-query breakpoint in _isSmallScreen is triggered
		this._screenSize = this._getScreenSize();
	}

	connectedCallback() {
		super.connectedCallback();

		this._resize = this._handleResize.bind(this);
		window.addEventListener('resize', this._resize);
	}

	disconnectedCallback() {
		window.removeEventListener('resize', this._resize);

		super.disconnectedCallback();
	}
}
customElements.define('d2l-summary-cards-container', SummaryCardsContainer);
