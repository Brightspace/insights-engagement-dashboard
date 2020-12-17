import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import '@brightspace-ui/core/components/tabs/tabs';
import '@brightspace-ui/core/components/tabs/tab-panel';
import '@brightspace-ui/core/components/inputs/input-number';

import './card-selection-list';
import './role-list.js';
import './column-configuration';
import './custom-toast-message';

import { css, html, LitElement } from 'lit-element';
import { heading1Styles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { saveSettings } from '../model/lms';

/**
 * @fires d2l-insights-settings-view-back
 */
class DashboardSettings extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
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
			includeRoles: { type: Array, attribute: false }
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
	}

	render() {
		return html`
			<div class="d2l-insights-settings-page-main-container">
				<div class="d2l-insights-settings-page-main-content">
						<h1 class="d2l-heading-1">${this.localize('settings:title')}</h1>
						<h2 class="d2l-heading-2">${this.localize('settings:description')}</h2>
					<d2l-tabs>
						<d2l-tab-panel text="${this.localize('settings:tabTitleSummaryMetrics')}">

							<d2l-insights-role-list
								?demo="${this.isDemo}"
								.includeRoles="${this.includeRoles}">
							</d2l-insights-role-list>

							<d2l-insights-engagement-card-selection-list
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
								?demo="${this.isDemo}"
							></d2l-insights-engagement-column-configuration>
						</d2l-tab-panel>
					</d2l-tabs>
				</div>
			</div>
			<d2l-insights-custom-toast-message></d2l-insights-custom-toast-message>
			${this._renderFooter()}
		`;
	}

	_renderFooter() {
		return html`
			<footer>
				<div class="d2l-insights-settings-page-footer">
					<d2l-button
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

		const columnConfig = this.shadowRoot.querySelector('d2l-insights-engagement-column-configuration');
		const settings = {
			...cardSelectionList.settings,
			showCoursesCol: columnConfig.showCoursesCol,
			showGradeCol: columnConfig.showGradeCol,
			showTicCol: columnConfig.showTicCol,
			showDiscussionsCol: columnConfig.showDiscussionsCol,
			showLastAccessCol: columnConfig.showLastAccessCol,
			includeRoles: this._selectedRoleIds
		};

		if (cardSelectionList.isInvalidSystemAccessValue()) {
			this.shadowRoot.querySelector('d2l-insights-custom-toast-message').systemLastAccessError();
			return;
		}

		const response = await saveSettings(settings);

		if (!response.ok) {
			this.shadowRoot.querySelector('d2l-insights-custom-toast-message').failedServerResponseError();
			console.error('Dashboard Settings View. Cannot save settings!');
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
}
customElements.define('d2l-insights-engagement-dashboard-settings', DashboardSettings);
