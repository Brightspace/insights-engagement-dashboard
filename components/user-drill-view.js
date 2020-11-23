import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button.js';
import { bodySmallStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

/**
 * @property {Object} user - {firstName, lastName, username, userId}
 * @property {Object} data - an instance of Data from model/data.js
 * @fires d2l-insights-user-drill-view-back
 */
class UserDrill extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			user: { type: Object, attribute: false },
			data: { type: Object, attribute: false }
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
			}

			.d2l-insights-user-drill-view-profile-pic {
				--d2l-icon-height: 100px;
				--d2l-icon-width: 100px;
				margin-right: 12px;
			}

			.d2l-insights-user-drill-view-profile-name {
				display: flex;
				flex-direction: column;
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

			.d2l-main-action-button-group {
				flex-grow: 1;
				margin: 0.7em;
				max-width: 300px;
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
		/**
		 * @event d2l-insights-user-drill-view-back
		 */
		this.dispatchEvent(new CustomEvent('d2l-insights-user-drill-view-back'));
	}

	render() {
		return html`<div class="d2l-insights-user-drill-view-container">

			<div class="d2l-insights-user-drill-view-header-panel">

				<div class="d2l-insights-user-drill-view-profile">
					<d2l-icon class="d2l-insights-user-drill-view-profile-pic" icon="tier3:profile-pic"></d2l-icon>
					<div class="d2l-insights-user-drill-view-profile-name">
						<div class="d2l-heading-2">${this.user.firstName}, ${this.user.lastName}</div>
						<div class="d2l-body-small">${this.user.username} - ${this.user.userId}</div>
					</div>
				</div>

				<d2l-action-button-group
						class="d2l-main-action-button-group"
						min-to-show="0"
						max-to-show="2"
						opener-type="more"
					>
					<d2l-button-subtle
						icon="d2l-tier1:export"
						text=${this.localize('components.insights-user-drill-view.exportToCsv')}
						@click="${this._exportToCsvHandler}">
					</d2l-button-subtle>
					<d2l-button-subtle
						icon="d2l-tier1:print"
						text=${this.localize('components.insights-user-drill-view.print')}
						@click="${this._printHandler}">
					</d2l-button-subtle>
				</d2l-action-button-group>

			</div>

			<d2l-button
				primary
				@click="${this._composeEmailHandler}"
			>${this.localize('components.insights-user-drill-view.emailButton')}</d2l-button>

			<div class="d2l-insights-user-drill-view-content">
				
				<d2l-insights-active-courses-table
					.data="${this.data}"
					?skeleton="${this.skeleton}">
				</d2l-insights-active-courses-table>
				
			</div>

		</div>`;
	}
}
customElements.define('d2l-insights-user-drill-view', UserDrill);
