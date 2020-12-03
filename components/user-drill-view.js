import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button.js';
import 'd2l-users/components/d2l-profile-image';
import { bodySmallStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

/**
 * @property {Object} user - {firstName, lastName, username, userId}
 */
class UserDrill extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			user: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [
			bodySmallStyles, heading2Styles,
			css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-user-drill-view-container {
				padding-top: 30px;
				width: 100%;
			}

			.d2l-insights-user-drill-view-container > d2l-button {
				margin-top: 24px;
			}

			.d2l-insights-user-drill-view-header-panel {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: 100%;
			}

			.d2l-insights-user-drill-view-profile {
				display: flex;
				flex-wrap: wrap;
			}

			.d2l-insights-user-drill-view-profile-pic {
				height: 100px;
				margin-right: 12px;
				width: 100px;
			}

			.d2l-insights-user-drill-view-profile-name {
				display: flex;
				flex-direction: column;
				min-width: 160px;
			}

			.d2l-insights-user-drill-view-profile-name > div.d2l-heading-2 {
				margin: 0;
				margin-top: 18px;
			}

			.d2l-insights-user-drill-view-profile-name > div.d2l-body-small {
				margin: 0;
				margin-top: 12px;
			}

			.d2l-insights-user-drill-view-content {
				width: 100;
			}

			.d2l-insights-user-drill-view-action-button-group {
				flex-grow: 1;
				margin: 0.7em;
				max-width: 300px;
			}

			.d2l-insights-view-filters-container {
				margin-top: 20px;
			}
		`];
	}

	_exportToCsvHandler() {
		// outside the scope of the story
	}

	_printHandler() {
		// outside the scope of the story
	}

	_composeEmailHandler() {
		// outside the scope of the story
	}

	render() {
		return html`<div class="d2l-insights-user-drill-view-container">
			<div class="d2l-insights-user-drill-view-header-panel">

				<div class="d2l-insights-user-drill-view-profile">
					<d2l-profile-image class="d2l-insights-user-drill-view-profile-pic" href="./response/profile_first_last.json" token="token" x-large></d2l-profile-image>
					<div class="d2l-insights-user-drill-view-profile-name">
						<div class="d2l-heading-2">${this.user.firstName}, ${this.user.lastName}</div>
						<div class="d2l-body-small">${this.user.username} - ${this.user.userId}</div>
					</div>
				</div>

				<d2l-action-button-group
						class="d2l-insights-user-drill-view-action-button-group"
						min-to-show="0"
						max-to-show="2"
						opener-type="more"
					>
					<d2l-button-subtle
						icon="d2l-tier1:export"
						text=${this.localize('components.insights-engagement-dashboard.exportToCsv')}
						@click="${this._exportToCsvHandler}">
					</d2l-button-subtle>
					<d2l-button-subtle
						icon="d2l-tier1:print"
						text=${this.localize('components.insights-engagement-dashboard.print')}
						@click="${this._printHandler}">
					</d2l-button-subtle>
				</d2l-action-button-group>

			</div>

			<d2l-button
				primary
				@click="${this._composeEmailHandler}"
			>${this.localize('components.insights-engagement-dashboard.emailButton')}</d2l-button>

			<div class="d2l-insights-view-filters-container">
				<slot name="filters"></slot>
			</div>

			<div class="d2l-insights-user-drill-view-content">
				<!-- put your tables here -->
			</div>


		</div>`;
	}
}
customElements.define('d2l-insights-user-drill-view', UserDrill);
