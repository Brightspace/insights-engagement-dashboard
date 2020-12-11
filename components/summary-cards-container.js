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
 */
class SummaryCardsContainer extends SkeletonMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false },

			showOverdueCard: { type: Boolean, attribute: 'overdue-card', reflect: true },
			showResultsCard: { type: Boolean, attribute: 'results-card', reflect: true },
			showSystemAccessCard: { type: Boolean, attribute: 'system-access-card', reflect: true },
			showDiscussionsCard: { type: Boolean, attribute: 'discussions-card', reflect: true }
		};
	}

	constructor() {
		super();

		this.showOverdueCard = false;
		this.showResultsCard = false;
		this.showSystemAccessCard = false;
		this.showDiscussionsCard = false;
	}

	static get styles() {
		return css`
			:host {
				display: block;

				--small-card-height: 154px;
				--small-card-width: 291px;
				--big-card-width: calc(var(--small-card-width) * 2 + var(--card-margin-right)); /* 594px; */
				--big-card-height: calc(var(--small-card-height) * 2 + var(--card-margin-top));	/* 318px; */
				--card-margin-top: 10px;
				--card-margin-right: 12px;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-insights-summary-container {
				display: flex;
				flex-shrink: 0;
				flex-wrap: wrap;
				margin-right: var(--card-margin-right);
				max-width: var(--big-card-width);
				min-width: var(--big-card-width);
			}

			.d2l-insights-summary-container > * {
				flex-shrink: 0;
				margin-top: var(--card-margin-top);
				height: var(--small-card-height);
				width: var(--small-card-width);
			}

			.d2l-insights-summary-container-0 {
				display: none;
			}

			.d2l-insights-summary-container-1 > :first-child {
				height: var(--big-card-height);
				margin-right: var(--card-margin-right);
				width: var(--big-card-width);
			}

			.d2l-insights-summary-container-2 > * {
				margin-right: var(--card-margin-right);
				width: var(--big-card-width);
			}

			.d2l-insights-summary-container-3 > :first-child {
				margin-right: var(--card-margin-right);
				width: var(--big-card-width);
			}

			.d2l-insights-summary-container-3 > :nth-child(2) {
				margin-right: var(--card-margin-right);
			}

			.d2l-insights-summary-container-4 > :nth-child(odd) {
				margin-right: var(--card-margin-right);

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

		// const responsive = false;

		const isWide = [
			summaryCardsCount === 1 || summaryCardsCount === 2 || summaryCardsCount === 3,
			summaryCardsCount === 2,
			false,
			false
		];

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
				${cards.filter(card => card.enabled || this.skeleton).map(card => card.htmlFn(isWide[cardIndex++]))}
			</div>
		`;
	}

	_resultsCard(wide) {
		return html`<d2l-insights-results-card .data="${this.data}" ?wide="${wide}" ?skeleton="${this.skeleton}"></d2l-insights-results-card>`;
	}

	_overdueAssignmentsCard(wide) {
		return html`<d2l-insights-overdue-assignments-card .data="${this.data}" ?wide="${wide}" ?skeleton="${this.skeleton}"></d2l-insights-overdue-assignments-card>`;
	}

	_discussionsCard(wide) {
		return html`<d2l-insights-discussion-activity-card .data="${this.data}" ?wide="${wide}" ?skeleton="${this.skeleton}"></d2l-insights-discussion-activity-card>`;
	}

	_lastAccessCard(wide) {
		return html`<d2l-insights-last-access-card .data="${this.data}" ?wide="${wide}" ?skeleton="${this.skeleton}"></d2l-insights-last-access-card>`;
	}
}
customElements.define('d2l-summary-cards-container', SummaryCardsContainer);
