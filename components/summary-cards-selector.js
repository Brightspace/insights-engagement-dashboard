import './summary-cards-container';
import {  html, LitElement } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export class SummaryCardsSelector extends SkeletonMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			hidden: { type: Boolean, attribute: 'hidden', reflect: true },
			showTopLeft: { type: Boolean, attribute: 'show-top-left', reflect: true },
			showTopRight: { type: Boolean, attribute: 'show-top-right', reflect: true },
			showBottomLeft: { type: Boolean, attribute: 'show-bottom-left', reflect: true },
			showBottomRight: { type: Boolean, attribute: 'show-bottom-right', reflect: true },

			user: { type: Object, attribute: false },
			view: { type: String, attribute: 'view', reflect: true },
			data: { type: Object, attribute: false }
		};
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

	_coursesInView({ wide, tall }) {
		return html`<d2l-labs-summary-card
			card-title="Courses in View"
			card-value="${this.data.recordsByUser.get(this.user.userId).length}"
			card-message="Courses returned within results."
			?wide="${wide}"
			?tall="${tall}"
			?skeleton="${this.skeleton}">
		</d2l-labs-summary-card>`;
	}

	_placeholder({ wide, tall }) {
		return html`<d2l-labs-summary-card
			card-title="Placeholder"
			card-value="0"
			card-message="This is a placeholder for testing"
			?wide="${wide}"
			?tall="${tall}"
			?skeleton="${this.skeleton}">
		</d2l-labs-summary-card>`;
	}

	get homeCards() {
		return [
			{ enabled: this.showTopLeft, htmlFn: (w) => this._resultsCard(w) },
			{ enabled: this.showTopRight, htmlFn: (w) => this._overdueAssignmentsCard(w) },
			{ enabled: this.showBottomLeft, htmlFn: (w) => this._discussionsCard(w) },
			{ enabled: this.showBottomRight, htmlFn: (w) => this._lastAccessCard(w) }
		];
	}

	get userCards() {
		return [
			{ enabled: this.showTopLeft, htmlFn: (w) => this._coursesInView(w) },
			{ enabled: this.showTopRight, htmlFn: (w) => this._placeholder(w) },
			{ enabled: this.showBottomLeft, htmlFn: (w) => this._placeholder(w) },
			{ enabled: this.showBottomRight, htmlFn: (w) => this._placeholder(w) }
		];
	}

	render() {
		let cards;
		switch (this.view) {
			case 'home':
				cards = this.homeCards;
				break;
			case 'user':
				cards = this.userCards;
				break;
			default:
				break;
		}
		return html`<d2l-summary-cards-container
			?hidden="${this.hidden}"
			?skeleton="${this.skeleton}"

			.cards="${cards}"
		></d2l-summary-cards-container>`;
	}
}
customElements.define('d2l-summary-cards-selector', SummaryCardsSelector);

