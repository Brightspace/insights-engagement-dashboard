import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button.js';
import './user-drill-courses-table.js';
import 'd2l-users/components/d2l-profile-image';
import './summary-cards-container';
import { bodySmallStyles, heading2Styles, heading3Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit-element/lit-element.js';
import { createComposeEmailPopup } from './email-integration';
import { ExportData } from '../model/exportData';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';
import { until } from 'lit-html/directives/until';

/**
 * @property {Object} data - an instance of Data from model/data.js
 * @property {Object} user - {firstName, lastName, username, userId}
 * @property {Boolean} isStudentSuccessSys - checking 'Access Student Success System' for org
 * @property {Object} orgUnitId - the org unit the user belongs too
 */
class UserDrill extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			user: { type: Object, attribute: false },
			data: { type: Object, attribute: false },
			isDemo: { type: Boolean, attribute: 'demo' },
			isStudentSuccessSys: { type: Boolean, attribute: false },
			orgUnitId: { type: Object, attribute: 'org-unit-id' }
		};
	}

	constructor() {
		super();
		this.hasToken = false;
		this._token = undefined;
	}

	static get styles() {
		return [
			super.styles, bodySmallStyles, heading2Styles, heading3Styles,
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
				height: 84px;
				margin-right: 20px;
				width: 84px;
			}


			d2l-icon.d2l-insights-user-drill-view-profile-pic {
				margin-right: 12px;
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

			.d2l-insights-user-drill-view-profile-name.d2l-insights-user-drill-skeleton > div.d2l-heading-2,
			.d2l-insights-user-drill-view-profile-name.d2l-insights-user-drill-skeleton > div.d2l-body-small {
				background-color: var(--d2l-color-gypsum);
				border-radius: 5px;
				color: var(--d2l-color-gypsum);
				min-width: 200px;
				user-select: none;
			}

			.d2l-insights-user-drill-view-profile-name > div.d2l-body-small {
				margin: 0;
				margin-top: 12px;
			}

			.d2l-insights-user-drill-view-content {
				width: 100%;
			}

			.d2l-insights-user-drill-view-action-button-group {
				flex-grow: 1;
				margin: 0.7em;
				max-width: 160px;
			}

			.d2l-insights-view-filters-container {
				margin-top: 20px;
			}

			@media only screen and (max-width: 400px) {
				.d2l-insights-user-drill-view-profile-pic {
					margin-right: 10px;
				}
				.d2l-insights-user-drill-view-profile-name > div.d2l-heading-2 {
					width: 150px;
				}
			}
		`];
	}

	_exportToCsvHandler() {
		const usersTables = this.shadowRoot.querySelectorAll('d2l-insights-user-drill-courses-table');
		const activeTable = usersTables[0];
		const inactiveTable = usersTables[1];
		ExportData.userDataToCsv([...activeTable.dataForExport, ...inactiveTable.dataForExport], activeTable.headersForExport);
	}

	_composeEmailHandler() {
		createComposeEmailPopup([this.user.userId], this.orgUnitId);
	}

	get isLoading() {
		return this.skeleton || !this.hasToken;
	}

	get skeletonClass() {
		return this.isLoading ? 'd2l-skeletize' : '';
	}

	get token() {
		// set and return the fetch
		// built in oauth isn't available outside the LMS
		this.hasToken = false;
		return this._token = !this.isDemo ? D2L.LP.Web.Authentication.OAuth2.GetToken('users:profile:read').then((token) => {
			this.hasToken = true;
			return token;
		}) : Promise.resolve('token');

	}

	get userEntity() {
		return `/d2l/api/hm/users/${this.user.userId}`;
	}

	get loadingUserProfile() {
		return html`<d2l-icon class="d2l-insights-user-drill-view-profile-pic ${this.skeletonClass}" icon="tier3:profile-pic"></d2l-icon>`;
	}

	get userProfile() {
		if (this.isDemo) return this.loadingUserProfile;
		return until(
			this.token.then(
				token => {
					// token has resolved ?
					return html`
					<d2l-profile-image
						class="d2l-insights-user-drill-view-profile-pic ${this.skeletonClass}"
						href="${this.userEntity}"
						token="${token}" x-large>
					</d2l-profile-image>`;
				}),
			// token has not resolved
			this.loadingUserProfile
		);
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

	_overdueAssignments({ wide, tall }) {
		return html`<d2l-labs-summary-card
			value-clickable
			card-title="${this.localize('dashboard:overdueAssignmentsHeading')}"
			card-value="${this.data.recordsByUser.get(this.user.userId).filter(record => record[RECORD.OVERDUE] !== 0).length}"
			card-message="${this.localize('userOverdueAssignmentsCard:assignmentsCurrentlyOverdue')}"
			@d2l-labs-summary-card-value-click=${this._valueClickHandlerOverdueAssignmentsCard}
			?wide="${wide}"
			?tall="${tall}"
			?skeleton="${this.skeleton}">
		</d2l-labs-summary-card>`;
	}

	_valueClickHandlerOverdueAssignmentsCard() {
		//out of scope
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

	get summaryCards() {
		return [
			{ enabled: true, htmlFn: (w) => this._coursesInView(w) },
			{ enabled: true, htmlFn: (w) => this._placeholder(w) },
			{ enabled: true, htmlFn: (w) => this._overdueAssignments(w) },
			{ enabled: true, htmlFn: (w) => this._placeholder(w) }
		];
	}

	render() {

		return html`<div class="d2l-insights-user-drill-view-container">
			<div class="d2l-insights-user-drill-view-header-panel">
				<div class="d2l-insights-user-drill-view-profile">
					${this.userProfile}
					<div class="d2l-insights-user-drill-view-profile-name">
						<div class="d2l-heading-2">${this.user.firstName} ${this.user.lastName}</div>
						<div class="d2l-body-small">${this.user.username} - ${this.user.userId}</div>
					</div>
				</div>

				<d2l-action-button-group
						class="d2l-insights-user-drill-view-action-button-group"
						min-to-show="0"
						max-to-show="1"
						opener-type="more"
					>
					<d2l-button-subtle
						icon="d2l-tier1:export"
						text=${this.localize('dashboard:exportToCsv')}
						@click="${this._exportToCsvHandler}">
					</d2l-button-subtle>
				</d2l-action-button-group>

			</div>

			<d2l-button
				primary
				@click="${this._composeEmailHandler}"
			>${this.localize('dashboard:emailButton')}</d2l-button>

			<div class="d2l-insights-view-filters-container">
				<slot name="filters"></slot>
			</div>

			<div class="d2l-insights-view-filters-container">
				<slot name="applied-filters"></slot>
			</div>

			<d2l-summary-cards-container
				?hidden="${this.hidden}"
				?skeleton="${this.skeleton}"

				.cards="${this.summaryCards}"
			></d2l-summary-cards-container>

			<div class="d2l-insights-user-drill-view-content">
				<!-- put your tables here -->
				<h2 class="d2l-heading-3">${this.localize('activeCoursesTable:title')}</h2>
				<d2l-insights-user-drill-courses-table
					.data="${this.data}"
					.user="${this.user}"
					.isActiveTable=${Boolean(true)}
					.isStudentSuccessSys="${this.isStudentSuccessSys}"
					?skeleton="${this.skeleton}"
				></d2l-insights-user-drill-courses-table>

				<h2 class="d2l-heading-3">${this.localize('inactiveCoursesTable:title')}</h2>
				<d2l-insights-user-drill-courses-table
					.data="${this.data}"
					.user="${this.user}"
					.isActiveTable=${Boolean(false)}
					?skeleton="${this.skeleton}"
				></d2l-insights-user-drill-courses-table>
			</div>

			</div>

		</div>`;
	}
}

customElements.define('d2l-insights-user-drill-view', UserDrill);
