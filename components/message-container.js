import { computed, decorate } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class MessageContainer extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			isNoDataReturned: { type: Boolean, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				padding-top: 20px;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-insights-message-container-body-noResultsAvailable {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
				color: var(--d2l-color-ferrite);
				display: flex;
				height: 130px;
				margin-bottom: 20px;
				width: 73vw;
			}

			.d2l-insights-message-container-body-tooManyResults {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
				color: var(--d2l-color-ferrite);
				display: flex;
				height: 130px;
				width: 73vw;
			}

			.d2l-insights-message-container-body-queryFails {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
				color: var(--d2l-color-ferrite);
				display: flex;
				height: 130px;
				width: 73vw;
			}

			.d2l-insights-message-container-value {
				padding-left: 40px;
				padding-top: 50px;
				word-wrap: break-word;
			}
		`;
	}

	// @computed
	get _isRecordsTruncated() {
		return this.data._data.serverData.isRecordsTruncated;
	}

	get _isQueryFails() {
		return this.data._data.isQueryError;
	}

	get _messageContainerTextTooManyResults() {
		return this.localize('components.insights-engagement-dashboard.tooManyResults');
	}

	get _messageContainerTextNoResultsAvailable() {
		return this.localize('components.insights-engagement-dashboard.noResultsAvailable');
	}

	get _messageContainerTextQueryFails() {
		return this.localize('components.insights-engagement-dashboard.queryFails');
	}

	get _messageContainerTextQueryFailsLink() {
		return this.localize('components.insights-engagement-dashboard.queryFailsLink');
	}

	render() {
		// conditinally render message text and body
		if (this._isQueryFails) {
			return html`
				<div class="d2l-insights-message-container-body-queryFails">
					<span class="d2l-insights-message-container-value">${this._messageContainerTextQueryFails}
						<a href="https://www.d2l.com/support/" target="_blank">${this._messageContainerTextQueryFailsLink}</a>
					</span>
				</div>
			`;
		} else if (this.isNoDataReturned) { //overwrite too many results case
			return html`
				<div class="d2l-insights-message-container-body-noResultsAvailable">
					<span class="d2l-insights-message-container-value">${this._messageContainerTextNoResultsAvailable}</span>
				</div>
			`;
		} else if (this._isRecordsTruncated) {
			return html`
				<div class="d2l-insights-message-container-body-tooManyResults">
					<span class="d2l-insights-message-container-value">${this._messageContainerTextTooManyResults}</span>
				</div>
			`;
		}
	}
}

decorate(MessageContainer, {
	_isRecordsTruncated: computed,
	_isQueryFails: computed
});

customElements.define('d2l-insights-message-container', MessageContainer);
