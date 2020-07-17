import './components/histogram-card.js';
import './components/summary-card.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { Data, Histogram } from './model/data.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class EngagementDashboard extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}

			/* NB: this layout css doesn't quite work; do not ship */
			.summary-container {
				margin-top: 10px;
				margin-bottom: 25px;
				display: flex;
				flex-wrap: wrap;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'en': { 'myLangTerm': 'I am a localized string!' }
		};

		for (let i = 0; i < langs.length; i++) {
			if (langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: langResources[langs[i]]
				};
			}
		}

		return null;
	}

	constructor() {
		super();

		// just some demo data with a delay to simulate an API call
		this._data = new Data({
			recordProvider: () => new Promise(resolve =>
				setTimeout(
					() => resolve([{n: 1, dn: 1, u: 1}, {n: 2, dn: 5, u: 2}, {n: 4, dn: 3, u: 3}, {n: 4, dn: 4, u: 3}]),
					1000
				)
			),
			filters: [
				{id: 'engagement-demo-summary', field: 'n', deltaField: 'dn', threshold: 3, countUniqueField: 'u',
					title: 'too few n', messageProvider: data => `users with n < ${data.threshold}`},
				{id: 'engagement-other-demo-summary', field: 'dn', deltaField: 'n', threshold: 1, countUniqueField: 'u',
					title: 'fewer matches', messageProvider: data => `notice the cross-filtering because threshold is ${data.threshold}`}
			]
		});

		this.histogram = new Histogram({id: 'engagement-demo-chart', field: 'n', title: 'distribution of n'}, this._data);
	}

	render() {
		console.log('engagement-dashboard render');
		return html`
				<h2>Hello ${this.prop1}!</h2>
				<div>Localization Example: ${this.localize('myLangTerm')}</div>
				<div class="summary-container">
					${Object.values(this._data.filters).map(f => html`<d2l-labs-summary-card id="${f.id}" .data="${f}"></d2l-labs-summary-card>`)}
					<d2l-labs-histogram-card id="${this.histogram.id}" .data="${this.histogram}"></d2l-labs-histogram-card>
				</div>
		`;
	}
}
// d2l-insights-engagement-dashboard
customElements.define('d2l-insights-engagement-dashboard', EngagementDashboard);
