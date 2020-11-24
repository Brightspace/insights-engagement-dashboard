import '@brightspace-ui/core/components/dialog/dialog-confirm';
import 'd2l-button-group/d2l-action-button-group';

import './components/histogram-card.js';
import './components/ou-filter.js';
import './components/results-card.js';
import './components/debug-card.js';
import './components/role-filter.js';
import './components/semester-filter.js';
import './components/users-table.js';
import './components/table.js';
import './components/current-final-grade-card.js';
import './components/applied-filters';
import './components/aria-loading-progress';
import './components/course-last-access-card.js';
import './components/discussion-activity-card.js';
import './components/message-container.js';
import './components/default-view-popup.js';
import './components/user-drill-view.js';
import './components/immersive-nav.js';

import { css, html } from 'lit-element/lit-element.js';
import { getPerformanceLoadPageMeasures, TelemetryHelper } from './model/telemetry-helper';
import { CourseLastAccessFilter } from './components/course-last-access-card';
import { createComposeEmailPopup } from './components/email-integration';
import { CurrentFinalGradesFilter } from './components/current-final-grade-card';
import { Data } from './model/data.js';
import { DiscussionActivityFilter } from './components/discussion-activity-card';
import { ExportData } from './model/exportData';
import { fetchData } from './model/lms.js';
import { fetchData as fetchDemoData } from './model/fake-lms.js';
import { FilteredData } from './model/filteredData';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { LastAccessFilter } from './components/last-access-card';
import { Localizer } from './locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { OverdueAssignmentsFilter } from './components/overdue-assignments-card';
import { TimeInContentVsGradeFilter } from './components/time-in-content-vs-grade-card';
import { toJS } from 'mobx';

const insightsPortalEndpoint = '/d2l/ap/insightsPortal/main.d2l';

/**
 * @property {Boolean} isDemo - if true, use canned data; otherwise call the LMS
 * @property {String} currentView - is the name of supported view. Valid values: home, user, settings
 * @property {String} telemetryEndpoint - endpoint for gathering telemetry performance data
 * @property {String} telemetryId - GUID that is used to group performance metrics for each separate page load
 */
class EngagementDashboard extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			orgUnitId: { type: Number, attribute: 'org-unit-id' },
			currentView: { type: String, attribute: 'view', reflect: true },
			telemetryEndpoint: { type: String, attribute: 'telemetry-endpoint' },
			telemetryId: { type: String, attribute: 'telemetry-id' },

			// user preferences:
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
			includeRoles: { type: Array, attribute: 'include-roles', converter: v => v.split(',') }
		};
	}

	constructor() {
		super();

		this.__defaultViewPopupShown = false; // a test-and-set variable: will always be true after the first read

		this.orgUnitId = 0;
		this.isDemo = false;
		this.currentView = 'home';
		this.telemetryEndpoint = '';
		this.telemetryId = '';

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

		this.linkToInsightsPortal = ''; // initialized in firstUpdated to get the actual orgUnitId value
	}

	static get styles() {
		return [
			heading3Styles,
			css`
				:host {
					display: block;
					padding: 0 30px;
				}
				:host([hidden]) {
					display: none;
				}

				.d2l-insights-chart-container {
					display: flex;
					flex-wrap: wrap;
					margin-top: -10px;
				}

				.d2l-insights-summary-chart-layout {
					display: flex;
					flex-wrap: wrap;
					max-width: 1300px;
				}

				d2l-insights-results-card,
				d2l-insights-discussion-activity-card {
					margin-right: 12px;
				}

				.d2l-insights-summary-container {
					display: flex;
					flex-wrap: wrap;
					margin-right: 10px;
					max-width: 594px;
				}

				.d2l-insights-summary-container-applied-filters {
					height: auto;
					width: 100%;
				}

				h1.d2l-heading-1 {
					font-weight: normal;	/* default for h1 is bold */
					margin: 0.67em 0;		/* required to be explicitly defined for Edge Legacy */
					padding: 0;				/* required to be explicitly defined for Edge Legacy */
				}

				h2.d2l-heading-3 {
					margin-bottom: 1rem; /* default for d2l h3 style is 1.5 rem */
				}

				.d2l-heading-button-group {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}

				.d2l-main-action-button-group {
					flex-grow: 1;
					margin: 0.7em;
					max-width: 300px;
				}

				@media only screen and (max-width: 780px) {
					.d2l-main-action-button-group {
						max-width: 10%;
					}
				}

				.d2l-table-action-button-group {
					margin-bottom: 1rem;
				}

				.d2l-insights-noDisplay {
					display: none;
					padding: 50px;
				}

				@media screen and (max-width: 615px) {
					h1 {
						line-height: 2rem;
						margin-bottom: 10px;
					}

					:host {
						display: block;
						padding: 0 18px;
					}

					.d2l-insights-summary-container {
						margin-right: 0;
					}
				}
			`
		];
	}

	firstUpdated() {
		const linkToInsightsPortal = new URL(insightsPortalEndpoint, window.location.origin);
		linkToInsightsPortal.searchParams.append('ou', this.orgUnitId);
		this.linkToInsightsPortal = linkToInsightsPortal.toString();
	}

	render() {
		switch (this.currentView) {
			case 'home':
				return this._renderHomeView();
			case 'user':
				return this._renderUserDrillView();
		}
	}

	_renderUserDrillView() {
		const user = {
			firstName: 'Dane',
			lastName: 'Clarie',
			username: 'claire.dane',
			userId: 887
		};

		return html`
			<d2l-insights-immersive-nav
				back-button-type="button"
				main-text="${this.localize('components.insights-engagement-dashboard.title')}"
				back-text="${this.localize('components.insights-engagement-dashboard.backToEngagementDashboard')}"
				back-text-short="${this.localize('components.insights-engagement-dashboard.backLinkTextShort')}"
				@d2l-insights-immersive-nav-back="${this._backToHomeHandler}"
			></d2l-insights-immersive-nav>

			<d2l-insights-user-drill-view
				.user="${user}"
				@d2l-insights-user-drill-view-back="${this._backToHomeHandler}"
			></d2l-insights-user-drill-view>
		`;
	}

	_renderHomeView() {
		return html`
			<d2l-insights-immersive-nav
				back-button-type="link"
				href="${this.linkToInsightsPortal}"
				main-text="${this.localize('components.insights-engagement-dashboard.title')}"
				back-text="${this.localize('components.insights-engagement-dashboard.backToInsightsPortal')}"
				back-text-short="${this.localize('components.insights-engagement-dashboard.backLinkTextShort')}"
			></d2l-insights-immersive-nav>

			<d2l-insights-aria-loading-progress .data="${this._data}"></d2l-insights-aria-loading-progress>

			<div class="d2l-heading-button-group">
				<h1 class="d2l-heading-1">${this.localize('components.insights-engagement-dashboard.title')}</h1>
				<d2l-action-button-group
					class="d2l-main-action-button-group"
					min-to-show="0"
					max-to-show="2"
					opener-type="more"
				>
					<d2l-button-subtle
						icon="d2l-tier1:export"
						text=${this.localize('components.insights-engagement-dashboard.exportToCsv')}
						@click="${this._exportToCsv}">
					</d2l-button-subtle>
					<d2l-button-subtle
						icon="d2l-tier1:help"
						text=${this.localize('components.insights-engagement-dashboard.learMore')}
						@click="${this._openHelpLink}">
					</d2l-button-subtle>
				</d2l-action-button-group>
			</div>

			<div class="view-filters-container">
				<d2l-insights-ou-filter
					.data="${this._serverData}"
					@d2l-insights-ou-filter-change="${this._orgUnitFilterChange}"
				></d2l-insights-ou-filter>
				<d2l-insights-semester-filter
					page-size="10000"
					?demo="${this.isDemo}"
					.preSelected="${this._serverData.selectedSemesterIds}"
					@d2l-insights-semester-filter-change="${this._semesterFilterChange}"
				></d2l-insights-semester-filter>
				<d2l-insights-role-filter
					@d2l-insights-role-filter-change="${this._roleFilterChange}"
					?demo="${this.isDemo}"
				></d2l-insights-role-filter>
			</div>
			<d2l-insights-message-container .data="${this._data}" .isNoDataReturned="${this._isNoUserResults}"></d2l-insights-message-container>
			<h2 class="d2l-heading-3">${this.localize('components.insights-engagement-dashboard.summaryHeading')}</h2>
			<div class="d2l-insights-summary-container-applied-filters">
				<d2l-insights-applied-filters .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-applied-filters>
			</div>
			<div class="d2l-insights-summary-chart-layout">
				<div class="d2l-insights-summary-container">
					${this._resultsCard}
					${this._overdueAssignmentsCard}
					${this._discussionsCard}
					${this._lastAccessCard}
				</div>
				${this._gradesCard}
				${this._ticGradesCard}
				${this._courseAccessCard}
			</div>
			<h2 class="d2l-heading-3">${this.localize('components.insights-engagement-dashboard.resultsHeading')}</h2>
			<d2l-action-button-group class="d2l-table-action-button-group" min-to-show="0" max-to-show="2" opener-type="more">
				<d2l-button-subtle
					icon="d2l-tier1:email"
					text="${this.localize('components.insights-engagement-dashboard.emailButton')}"
					@click="${this._handleEmailButtonPress}">
				</d2l-button-subtle>
			</d2l-action-button-group>

			<d2l-insights-users-table
				.data="${this._data}"
				?skeleton="${this._isLoading}"
				?show-courses-col="${this.showCoursesCol}"
				?show-discussions-col="${this.showDiscussionsCol}"
				?show-grade-col="${this.showGradeCol}"
				?show-last-access-col="${this.showLastAccessCol}"
				?show-tic-col="${this.showTicCol}"
			></d2l-insights-users-table>

			<d2l-insights-default-view-popup
				?opened=${Boolean(this._serverData.isDefaultView && !this._defaultViewPopupShown)}
				.data="${this._serverData}">
			</d2l-insights-default-view-popup>

			<d2l-dialog-confirm
				id="no-users-selected-dialog"
				text="${this.localize('components.insights-engagement-dashboard.noUsersSelectedDialogText')}">
				<d2l-button slot="footer" primary data-dialog-action>
					${this.localize('components.insights-default-view-popup.buttonOk')}
				</d2l-button>
			</d2l-dialog-confirm>
		`;
	}

	get _defaultViewPopupShown() {
		const currentVal = this.__defaultViewPopupShown;
		this.__defaultViewPopupShown = true;
		return currentVal;
	}

	get _courseAccessCard() {
		if (!this.showCourseAccessCard) return '';
		return html`<div><d2l-insights-course-last-access-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-course-last-access-card></div>`;
	}

	get _discussionsCard() {
		if (!this.showDiscussionsCard) return '';
		return html`<d2l-insights-discussion-activity-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-discussion-activity-card>`;
	}

	get _gradesCard() {
		if (!this.showGradesCard) return '';
		return html`<div><d2l-insights-current-final-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-current-final-grade-card></div>`;
	}

	get _lastAccessCard() {
		if (!this.showSystemAccessCard) return '';
		return html`<d2l-insights-last-access-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-last-access-card>`;
	}

	get _overdueAssignmentsCard() {
		if (!this.showOverdueCard) return '';
		return html`<d2l-insights-overdue-assignments-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-overdue-assignments-card>`;
	}

	get _resultsCard() {
		if (!this.showResultsCard) return '';
		return html`<d2l-insights-results-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-results-card>`;
	}

	get _ticGradesCard() {
		if (!this.showTicGradesCard) return '';
		return html`<div><d2l-insights-time-in-content-vs-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-time-in-content-vs-grade-card></div>`;
	}

	_backToHomeHandler(event) {
		event.stopPropagation();
		this.currentView = 'home';
	}

	_exportToCsv() {
		const usersTable = this.shadowRoot.querySelector('d2l-insights-users-table');
		ExportData.userDataToCsv(usersTable.dataForExport, usersTable.headersForExport);
	}

	get _isLoading() {
		return this._data.isLoading;
	}

	get _data() {
		if (!this.__data) {
			// There are row filters - which look at each record individually when deciding to include or
			// exclude it - and there are aggregate filters, which also look at all records selected by
			// other filters (e.g. to include a record if it has an above-average value in some field).
			// Aggregate filters are potentially ambiguous if there are more than one and each depends
			// on the results of the other: we avoid this by building them on specific sets of filters.
			const rowFilteredData = new FilteredData(this._serverData)
				.withFilter(new OverdueAssignmentsFilter())
				.withFilter(new LastAccessFilter())
				.withFilter(new CourseLastAccessFilter())
				.withFilter(new CurrentFinalGradesFilter())
				.withFilter(new DiscussionActivityFilter());

			this.__data = rowFilteredData.withFilter(new TimeInContentVsGradeFilter(rowFilteredData));
		}

		return this.__data;
	}

	get _isNoUserResults() {
		if (!this.isDemo) {
			return this._data.records.length === 0 && !this._data.isLoading;
		}
		return false;
	}

	get _serverData() {
		if (!this.__serverData) {
			this.__serverData = new Data({
				recordProvider: this.isDemo ? fetchDemoData : fetchData
			});
		}

		return this.__serverData;
	}

	get _telemetryHelper() {
		if (!this.telemetryEndpoint) {
			return null;
		}

		if (!this.__telemetryHelper) {
			this.__telemetryHelper = new TelemetryHelper(this.telemetryEndpoint);
		}

		return this.__telemetryHelper;
	}

	_openHelpLink() {
		window.open('https://community.brightspace.com/s/article/Brightspace-Performance-Plus-Analytics-Administrator-Guide', '_blank');
	}

	_roleFilterChange(event) {
		event.stopPropagation();
		this._serverData.selectedRoleIds = event.target.selected;
	}

	_orgUnitFilterChange(event) {
		event.stopPropagation();
		this._serverData.selectedOrgUnitIds = event.target.selected;
	}

	_semesterFilterChange(event) {
		event.stopPropagation();
		this._serverData.selectedSemesterIds = event.target.selected;
	}

	_handleEmailButtonPress() {
		const usersTable = this.shadowRoot.querySelector('d2l-insights-users-table');
		const selectedUserIds = usersTable.selectedUserIds;

		if (!selectedUserIds.length) {
			const noUsersSelectedDialog = this.shadowRoot.querySelector('#no-users-selected-dialog');
			noUsersSelectedDialog.opened = true;
		} else {
			// we use the root OU id because that's where we expect users to have email permissions
			createComposeEmailPopup(toJS(selectedUserIds), this._serverData.orgUnitTree.rootId);
		}
	}

	_handlePageLoad() {
		if (!this._telemetryHelper) {
			return;
		}

		this._telemetryHelper.logPerformanceEvent({
			id: this.telemetryId,
			measures: getPerformanceLoadPageMeasures(),
			action: 'PageLoad'
		});
	}

	_handlePerformanceMeasure(event) {
		if (!this._telemetryHelper) {
			return;
		}

		if (!['d2l.page.tti', 'first-paint', 'first-contentful-paint'].includes(event.detail.value.name)) {
			return;
		}

		this._telemetryHelper.logPerformanceEvent({
			id: this.telemetryId,
			measures: [event.detail.value],
			action: 'PageLoad'
		});
	}

	connectedCallback() {
		super.connectedCallback();

		this._boundHandlePageLoad = this._handlePageLoad.bind(this);
		window.addEventListener('load', this._boundHandlePageLoad);

		this._boundHandlePerformanceMeasure = this._handlePerformanceMeasure.bind(this);
		document.addEventListener('d2l-performance-measure', this._boundHandlePerformanceMeasure);
	}

	disconnectedCallback() {
		window.removeEventListener('load', this._boundHandlePageLoad);
		document.removeEventListener('d2l-performance-measure', this._boundHandlePerformanceMeasure);

		super.disconnectedCallback();
	}
}
customElements.define('d2l-insights-engagement-dashboard', EngagementDashboard);
