// for showing whatever metric you want for debugging
import './summary-card.js';

import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class DebugCard extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			data: { type: Object, attribute: false },
			metricToDisplay: { type: String, attribute: 'metric-to-display' },
			title: { type: String, attribute: true },
			message: { type: String, attribute: true }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.metricToDisplay = '';
		this.title = '';
		this.message = '';
	}

	get _cardMessage() {
		return this.message;
	}

	get _cardTitle() {
		return this.localize('components:insights-engagement-dashboard:resultsHeading');
	}

	get _cardValue() {
		if (this.metricToDisplay === 'recordsLength') {
			return this.data.records.length;
		}
		if (this.metricToDisplay === 'filteredRecordsLength') {
			return this.data.getRecordsInView().length;
		}

		return this.data.orgUnits.length;
	}

	render() {
		return html`
			<d2l-labs-summary-card id="d2l-insights-engagement-results" .data="${this.data}" card-title="${this.title}" card-value="${this._cardValue}" card-message="${this.message}"></d2l-labs-summary-card>
		`;
	}

}
customElements.define('d2l-insights-debug-card', DebugCard);
