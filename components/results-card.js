import './summary-card.js';

import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class ResultsCard extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
	}

	get _cardMessage() {
		return this.localize('components:insights-engagement-dashboard:resultsReturned');
	}

	get _cardTitle() {
		return this.localize('components:insights-engagement-dashboard:resultsHeading');
	}

	get _cardValue() {
		return this.data.userDataForDisplay.length;
	}

	render() {
		return html`
			<d2l-labs-summary-card
				id="d2l-insights-engagement-results"
				.data="${this.data}"
				card-title="${this._cardTitle}"
				card-value="${this._cardValue}"
				card-message="${this._cardMessage}"
				?skeleton="${this.skeleton}"
			></d2l-labs-summary-card>
		`;
	}
}
customElements.define('d2l-insights-results-card', ResultsCard);
