import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import '@brightspace-ui/core/components/tabs/tabs';
import '@brightspace-ui/core/components/tabs/tab-panel';
import '@brightspace-ui/core/components/inputs/input-number';
import '@brightspace-ui/core/components/tooltip/tooltip.js';

import './card-selection-list';
import './role-list.js';
import './column-configuration';
import './user-level-card-selection-list';
import './custom-toast-message';

import { css, html, LitElement } from 'lit-element';
import { heading1Styles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { saveSettings } from '../model/dataApiClient';
import shadowHash from '../model/shadowHash';

/**
 * @fires d2l-insights-settings-view-back
 */

const INVALID_SYSTEM_ACCESS = Symbol('invalid-system-access');
const INVALID_ROLE_SELECTION = Symbol('invalid-role-selection');

const ERROR_LINKS = {};
ERROR_LINKS[INVALID_SYSTEM_ACCESS] = { term: 'settings:systemAccessError', id: 'last-access-threshold-edit' };
ERROR_LINKS[INVALID_ROLE_SELECTION] = { term: 'settings:roleListError', id: 'role-list-items' };

const IMMERSIVE_NAV_HEIGHT = 62;

class DashboardSettings extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			s3Enabled: { type: Boolean, attribute: 'student-success-system-enabled' },

			showContentViewCard: { type: Boolean, attribute: 'content-view-card', reflect: true },
			showCourseAccessCard: { type: Boolean, attribute: 'course-access-card', reflect: true },
			showCoursesCol: { type: Boolean, attribute: 'courses-col', reflect: true },
			showDiscussionsCard: { type: Boolean, attribute: 'discussions-card', reflect: true },
			showDiscussionsCol: { type: Boolean, attribute: 'discussions-col', reflect: true },
			showGradesCard: { type: Boolean, attribute: 'grades-card', reflect: true },
			showGradeCol: { type: Boolean, attribute: 'grade-col', reflect: true },
			showLastAccessCol: { type: Boolean, attribute: 'last-access-col', reflect: true },
			showOverdueCard: { type: Boolean, attribute: 'overdue-card', reflect: true },
			showResultsCard: { type: Boolean, attribute: 'results-card', reflect: true },
			showSystemAccessCard: { type: Boolean, attribute: 'system-access-card', reflect: true },
			showTicCol: { type: Boolean, attribute: 'tic-col', reflect: true },
			showTicGradesCard: { type: Boolean, attribute: 'tic-grades-card', reflect: true },
			lastAccessThresholdDays: { type: Number, attribute: 'last-access-threshold-days', reflect: true },
			includeRoles: { type: Array, attribute: false },
			showAverageGradeSummaryCard: { type: Boolean, attribute: 'average-grade-summary-card', reflect: true },
			showContentViewsTrendCard: { type: Boolean, attribute: 'content-views-trend-card', reflect: true },
			showCourseAccessTrendCard: { type: Boolean, attribute: 'course-access-trend-card', reflect: true },
			showGradesTrendCard: { type: Boolean, attribute: 'grades-trend-card', reflect: true },
			showPredictedGradeCol: { type: Boolean, attribute: 'predicted-grade-col', reflect: true },
			_toastMessagetext: { type: String, attribute: false },

			errors: { attribute: false },
			isAlertCollapsed: { attribute: false },
		};
	}

	static get styles() {
		return [heading1Styles, heading2Styles, css`
			:host {
				display: flex;
				flex-direction: column; /* required so the footer actually appears on-screen */
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-settings-page-main-container {
				height: 100%;
				padding-top: 30px;
			}

			.d2l-insights-settings-page-main-content {
				background-color: white;
				margin: 0 auto;
				max-width: 1230px;
				padding-bottom: 72px; /* height of footer */
				width: 100%;
			}

			footer {
				background-color: white;
				bottom: 0;
				box-shadow: 0 -2px 4px rgba(73, 76, 78, 0.2); /* ferrite */
				height: 42px; /* height of a d2l-button */
				left: 0;
				padding: 0.75rem 30px;
				position: fixed;
				right: 0;
				z-index: 2; /* ensures the footer box-shadow is over main areas with background colours set */
			}

			.d2l-insights-settings-page-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}

			h1.d2l-heading-1, h2.d2l-heading-2 {
				font-weight: normal;
			}

			/* buttons */
			.d2l-insights-settings-footer-button,
			.d2l-insights-settings-footer-button-desktop,
			.d2l-insights-settings-footer-button-responsive {
				margin-left: 0;
				margin-right: 0.75rem;
			}

			:host([dir="rtl"]) .d2l-insights-settings-footer-button,
			:host([dir="rtl"]) .d2l-insights-settings-footer-button-desktop,
			:host([dir="rtl"]) .d2l-insights-settings-footer-button-responsive {
				margin-left: 0.75rem;
				margin-right: 0;
			}

			.d2l-insights-settings-footer-button-desktop {
				display: inline-block;
			}

			.d2l-insights-settings-footer-button-responsive {
				display: none;
			}

			.d2l-insights-link {
				color: var(--d2l-color-celestine);
				cursor: pointer;
				text-decoration: none;
			}
			.d2l-insights-link:hover {
				color: var(--d2l-color-celestine);
				text-decoration: underline;
			}
			d2l-alert {
				margin-bottom: 10px;
			}
			.d2l-insights-sbs {
				cursor: pointer;
				display: flex;
				justify-content: space-between;
				user-select: none;
			}

			.d2l-insights-alert-collapse {
				margin-top: 5px;
			}

			@media screen and (max-width: 615px) {
				h1.d2l-heading-1, h2.d2l-heading-2 {
					font-weight: normal;
				}

				footer {
					padding: 0.75rem 18px;
				}

				.d2l-insights-settings-footer-button-desktop {
					display: none;
				}

				.d2l-insights-settings-footer-button-responsive {
					display: inline-block;
				}

				.d2l-insights-settings-footer-button,
				.d2l-insights-settings-footer-button-desktop,
				.d2l-insights-settings-footer-button-responsive {
					margin-right: 0;
				}

				:host([dir="rtl"]) .d2l-insights-settings-footer-button,
				:host([dir="rtl"]) .d2l-insights-settings-footer-button-desktop,
				:host([dir="rtl"]) .d2l-insights-settings-footer-button-responsive {
					margin-left: 0;
				}
			}
		`];
	}

	constructor() {
		super();

		this.isDemo = false;
		this.s3Enabled = false;

		this.showContentViewCard = false;
		this.showCourseAccessCard = false;
		this.showCoursesCol = false;
		this.showDiscussionsCard = false;
		this.showDiscussionsCol = false;
		this.showGradesCard = false;
		this.showGradeCol = false;
		this.showLastAccessCol = false;
		this.showOverdueCard = false;
		this.showResultsCard = false;
		this.showSystemAccessCard = false;
		this.showTicCol = false;
		this.showTicGradesCard = false;
		this.lastAccessThresholdDays = 14;
		this.includeRoles = [];
		this.showAverageGradeSummaryCard = false;
		this.showContentViewsTrendCard = false;
		this.showCourseAccessTrendCard = false;
		this.showGradesTrendCard = false;
		this.showPredictedGradeCol = false;
		this.errors = undefined;
		this.isAlertCollapsed = false;
	}

	_handleScroll(e) {
		const id = e.target.getAttribute('data:id');
		const elm = shadowHash.querySelector(`#${id}`);
		const distance = (window.pageYOffset + elm.getBoundingClientRect().top - IMMERSIVE_NAV_HEIGHT);
		window.scrollTo({ top: distance, behavior: 'smooth' });
	}

	get _hasRoleListError() {
		return this.errors && !!this.errors.find(e => e === INVALID_ROLE_SELECTION);
	}

	_renderErrorAlert() {
		if (!this.errors) return html``;
		const collapseIcon = this.isAlertCollapsed ? 'tier1:arrow-expand-small' : 'tier1:arrow-collapse-small';
		const handleToggleCollapse = () => {
			this.isAlertCollapsed = !this.isAlertCollapsed;
		};
		return html`
			<d2l-alert type="critical">
				<div class="d2l-insights-sbs" @click=${handleToggleCollapse} @keypress=${handleToggleCollapse}>
					<span>${this.localize('settings:errors')}</span>
					<d2l-icon icon="${collapseIcon}"></d2l-icon>
				</div>
				${ this.isAlertCollapsed ? '' : html`
				<ul>
					${this.errors.map(errorSymbol => html`
						<li>
							<span
								data:id=${ERROR_LINKS[errorSymbol].id}
								class="d2l-insights-link"
								@click=${this._handleScroll}
								@keypress=${this._handleScroll}>
								${this.localize(ERROR_LINKS[errorSymbol].term)}
							</span>
						</li>
					`)}
				</ul>`}
			</d2l-alert>
		`;
	}

	render() {
		return html`
			<div class="d2l-insights-settings-page-main-container">
				<div class="d2l-insights-settings-page-main-content">
						<h1 class="d2l-heading-1">${this.localize('settings:title')}</h1>
						<h2 class="d2l-heading-2">${this.localize('settings:description')}</h2>
					<d2l-tabs>
						<d2l-tab-panel text="${this.localize('settings:tabTitleSummaryMetrics')}">
							${ this._renderErrorAlert() }
							<d2l-insights-role-list
								?demo="${this.isDemo}"
								?error=${this._hasRoleListError}
								.includeRoles="${this.includeRoles}"
								@d2l-insights-role-list-change="${this._handleRoleChange}"
								?missing-role=${this.roleError}>
							</d2l-insights-role-list>

							<d2l-insights-engagement-card-selection-list
								?content-view-card="${this.showContentViewCard}"
								?course-access-card="${this.showCourseAccessCard}"
								?discussions-card="${this.showDiscussionsCard}"
								?grades-card="${this.showGradesCard}"
								?overdue-card="${this.showOverdueCard}"
								?results-card="${this.showResultsCard}"
								?system-access-card="${this.showSystemAccessCard}"
								?tic-grades-card="${this.showTicGradesCard}"
								last-access-threshold-days="${this.lastAccessThresholdDays}"
							></d2l-insights-engagement-card-selection-list>
						</d2l-tab-panel>

						<d2l-tab-panel text="${this.localize('settings:tabTitleResultsTableMetrics')}">
							<d2l-insights-engagement-column-configuration
								?courses-col="${this.showCoursesCol}"
								?discussions-col="${this.showDiscussionsCol}"
								?grade-col="${this.showGradeCol}"
								?last-access-col="${this.showLastAccessCol}"
								?tic-col="${this.showTicCol}"
								?predicted-grade-col="${this.showPredictedGradeCol}"
								?student-success-system-enabled="${this.s3Enabled}"
								?demo="${this.isDemo}"
							></d2l-insights-engagement-column-configuration>
						</d2l-tab-panel>

						<d2l-tab-panel text="${this.localize('settings:tabTitleUserLevelMetrics')}">
							<d2l-insights-engagement-user-card-selection-list
								?average-grade-summary-card="${this.showAverageGradeSummaryCard}"
								?grades-trend-card="${this.showGradesTrendCard}"
								?course-access-trend-card="${this.showCourseAccessTrendCard}"
								?content-views-trend-card="${this.showContentViewsTrendCard}"
							></d2l-insights-engagement-user-card-selection-list>
						</d2l-tab-panel>
					</d2l-tabs>
				</div>
			</div>
			<d2l-insights-custom-toast-message .toastMessageText="${this._toastMessagetext}"></d2l-insights-custom-toast-message>
			${this._renderFooter()}
		`;
	}

	_renderFooter() {
		return html`
			<footer>
				<div class="d2l-insights-settings-page-footer">
					<d2l-button
						id="save-close"
						primary
						class="d2l-insights-settings-footer-button-desktop"
						@click="${this._handleSaveAndClose}">
						${this.localize('settings:saveAndClose')}
					</d2l-button>
					<d2l-button
						primary
						class="d2l-insights-settings-footer-button-responsive"
						@click="${this._handleSaveAndClose}">
						${this.localize('settings:save')}
					</d2l-button>
					<d2l-button
						class="d2l-insights-settings-footer-button"
						@click="${this._handleCancel}">
						${this.localize('settings:cancel')}
					</d2l-button>
				</div>
			</footer>
		`;
	}

	get _selectedRoleIds() {
		return this.shadowRoot.querySelector('d2l-insights-role-list').includeRoles;
	}

	async _handleSaveAndClose() {
		const cardSelectionList = this.shadowRoot.querySelector('d2l-insights-engagement-card-selection-list');
		const userCardSelectionList = this.shadowRoot.querySelector('d2l-insights-engagement-user-card-selection-list');
		const columnConfig = this.shadowRoot.querySelector('d2l-insights-engagement-column-configuration');

		const settings = {
			...cardSelectionList.settings,
			...userCardSelectionList.settings,
			...columnConfig.settings,
			includeRoles: this._selectedRoleIds
		};
		this.errors = [];
		if (this._selectedRoleIds.length === 0) {
			this.errors.push(INVALID_ROLE_SELECTION);
		}
		if (cardSelectionList.isInvalidSystemAccessValue()) {
			this.errors.push(INVALID_SYSTEM_ACCESS);
		}
		if (this.errors.length > 0) {
			this.isAlertCollapsed = false;
			window.scroll({ top: 0, behavior: 'smooth' });
			this.shadowRoot.querySelector('d2l-tabs')
				.shadowRoot.querySelector('d2l-tab-internal[title="Summary Metrics"]')
				.click();
			return;
		}

		const response = await saveSettings(settings);

		if (!response.ok) {
			this._toastMessagetext = this.localize('settings:serverSideErrorToast');
			this._openToastMessage();
			return;
		}

		this._returnToEngagementDashboard(settings);
	}

	_handleCancel() {
		this._returnToEngagementDashboard();
	}

	_returnToEngagementDashboard(settings) {
		/**
		 * @event d2l-insights-settings-view-back
		 */
		this.dispatchEvent(new CustomEvent('d2l-insights-settings-view-back', {
			detail: settings
		}));
	}

	_openToastMessage() {
		this.shadowRoot.querySelector('d2l-insights-custom-toast-message').open();
	}
}
customElements.define('d2l-insights-engagement-dashboard-settings', DashboardSettings);
