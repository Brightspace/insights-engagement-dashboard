import './message-container';

import { computed, decorate } from 'mobx';
import { html } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class EngagementDashboardErrors extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			isNoDataReturned: { type: Boolean, attribute: 'no-results' },
			isNoRoles: { type: Boolean, attribute: 'no-roles' }
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
		if (this.isNoRoles) {
			messageType = 'button';
			text = this.localize('dashboard:noRolesSelected');
			buttonText = this.localize('dashboard:goToSettings');

		} else if (this._isQueryFails) {
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
			<d2l-insights-message-container
				type="${messageType}"
				text="${text}"
				link-text="${ifDefined(linkText)}"
				href="${ifDefined(href)}"
				button-text="${ifDefined(buttonText)}"
				@d2l-insights-message-container-button-click="${this._handleClick}">
			</d2l-insights-message-container>
		`;
	}

	_handleClick() {
		if (this.isNoRoles) {
			this.dispatchEvent(new Event('d2l-insights-go-to-settings'));
		} else {
			this.dispatchEvent(new Event('d2l-insights-undo-last-filter'));
		}
	}
}

decorate(EngagementDashboardErrors, {
	_isRecordsTruncated: computed,
	_isQueryFails: computed
});

customElements.define('d2l-insights-engagement-dashboard-errors', EngagementDashboardErrors);
