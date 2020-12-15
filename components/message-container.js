import './error-message';

import { computed, decorate } from 'mobx';
import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined';
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

	// @computed
	get _isRecordsTruncated() {
		return this.data._data.serverData.isRecordsTruncated;
	}

	// @computed
	get _isQueryFails() {
		return this.data._data.isQueryError;
	}

	render() {
		let messageType, text, linkText, href, buttonText;

		// conditionally render message text and body
		if (this._isQueryFails) {
			messageType = 'link';
			text = this.localize('dashboard:queryFailed');
			linkText = this.localize('dashboard:queryFailedLink');
			href = 'https://www.d2l.com/support/';

		} else if (this.isNoDataReturned) { //overwrite too many results case
			messageType = 'button';
			text = this.localize('dashboard:noResultsAvailable');
			buttonText = this.localize('dashboard:undoLastAction');

		} else if (this._isRecordsTruncated) {
			messageType = 'default';
			text = this.localize('dashboard:tooManyResults');

		} else {
			return '';
		}

		return html`
			<d2l-insights-error-message
				type="${messageType}"
				text="${text}"
				link-text="${ifDefined(linkText)}"
				href="${ifDefined(href)}"
				button-text="${ifDefined(buttonText)}"
				@d2l-insights-error-message-button-click="${this._handleClick}">
			</d2l-insights-error-message>
		`;
	}

	_handleClick() {
		this.dispatchEvent(new Event('d2l-insights-undo-last-filter'));
	}
}

decorate(MessageContainer, {
	_isRecordsTruncated: computed,
	_isQueryFails: computed
});

customElements.define('d2l-insights-message-container', MessageContainer);
