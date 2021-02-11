import './message-container';

import { computed, decorate } from 'mobx';
import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class UserDrillErrors extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			userData: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.userData = {};
	}

	// @computed
	get _isQueryFails() {
		return this.userData.isQueryError;
	}

	render() {
		let messageType, text, linkText, href;

		// conditionally render message text and body
		if (this._isQueryFails) {
			messageType = 'link';
			text = this.localize('dashboard:queryFailed');
			linkText = this.localize('dashboard:queryFailedLink');
			href = 'https://www.d2l.com/support/';

		} else {
			return '';
		}

		return html`
			<d2l-insights-message-container
				type="${messageType}"
				text="${text}"
				link-text="${ifDefined(linkText)}"
				href="${ifDefined(href)}">
			</d2l-insights-message-container>
		`;
	}
}

decorate(UserDrillErrors, {
	_isQueryFails: computed
});

customElements.define('d2l-insights-engagement-user-drill-errors', UserDrillErrors);
