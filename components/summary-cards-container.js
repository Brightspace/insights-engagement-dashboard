import './discussion-activity-card.js';
import './course-last-access-card.js';
import './results-card.js';
import './overdue-assignments-card.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { Localizer } from '../locales/localizer';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

/**
 * @property {Object} data
 * @property {Boolean} showOverdueCard
 * @property {Boolean} showResultsCard
 * @property {Boolean} showSystemAccessCard
 * @property {Boolean} showDiscussionsCard
 * @property {String} _screenSize - private property that allows forcing rendering after hit of media-query breakpoint
 */
class SummaryCardsContainer extends SkeletonMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false },

			showOverdueCard: { type: Boolean, attribute: 'overdue-card', reflect: true },
			showResultsCard: { type: Boolean, attribute: 'results-card', reflect: true },
			showSystemAccessCard: { type: Boolean, attribute: 'system-access-card', reflect: true },
			showDiscussionsCard: { type: Boolean, attribute: 'discussions-card', reflect: true },

			_screenSize: { type: String, attribute: 'size', reflect: true }
		};
	}

	constructor() {
		super();

		this.showOverdueCard = false;
		this.showResultsCard = false;
		this.showSystemAccessCard = false;
		this.showDiscussionsCard = false;

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
				margin-right: var(--d2l-insights-engagement-card-margin-right);
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
				margin-right: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-2 > * {
				margin-right: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-3 > :first-child {
				margin-right: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-3 > :nth-child(2) {
				margin-right: var(--d2l-insights-engagement-card-margin-right);
			}

			.d2l-insights-summary-container-4 > :nth-child(odd) {
				margin-right: var(--d2l-insights-engagement-card-margin-right);

			}

			@media screen and (max-width: 615px) {
				.d2l-insights-summary-container-2 > * {
					margin-right: 0;
				}

				.d2l-insights-summary-container-2 > :first-child {
					margin-right: var(--d2l-insights-engagement-card-margin-right);
				}
			}
		`;
	}

	render() {
		const cards = [
			{ enabled: this.showResultsCard, htmlFn: (w) => this._resultsCard(w) },
			{ enabled: this.showOverdueCard, htmlFn: (w) => this._overdueAssignmentsCard(w) },
			{ enabled: this.showDiscussionsCard, htmlFn: (w) => this._discussionsCard(w) },
			{ enabled: this.showSystemAccessCard, htmlFn: (w) => this._lastAccessCard(w) }
		];
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
			<div class="${classMap(summaryCardsStyles)}">
				${cards.filter(card => card.enabled || this.skeleton).map(card => card.htmlFn(sizes[cardIndex++]))}
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

	_resultsCard({ wide, tall }) {
		return html`<d2l-insights-results-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${this.skeleton}"></d2l-insights-results-card>`;
	}

	_overdueAssignmentsCard({ wide, tall }) {
		return html`<d2l-insights-overdue-assignments-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${this.skeleton}"></d2l-insights-overdue-assignments-card>`;
	}

	_discussionsCard({ wide, tall }) {
		return html`<d2l-insights-discussion-activity-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${this.skeleton}"></d2l-insights-discussion-activity-card>`;
	}

	_lastAccessCard({ wide, tall }) {
		return html`<d2l-insights-last-access-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${this.skeleton}"></d2l-insights-last-access-card>`;
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
