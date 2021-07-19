import '@brightspace-ui/core/components/dialog/dialog-confirm';
import '@brightspace-ui/core/components/overflow-group/overflow-group';
import '@brightspace-ui-labs/ou-filter/ou-filter';

import './components/alert-data-update.js';
import './components/histogram-card.js';
import './components/debug-card.js';
import './components/semester-filter.js';
import './components/users-table.js';
import './components/table.js';
import './components/current-final-grade-card.js';
import './components/applied-filters';
import './components/aria-loading-progress';
import './components/engagement-dashboard-errors.js';
import './components/default-view-popup.js';
import './components/user-drill-view.js';
import './components/immersive-nav.js';
import './components/dashboard-settings';
import './components/summary-cards-container.js';
import './components/discussion-activity-card.js';
import './components/course-last-access-card.js';
import './components/results-card.js';
import './components/overdue-assignments-card.js';
import './components/content-view-histogram.js';
import './components/user-selector.js';

import { css, html } from 'lit-element/lit-element.js';
import { getPerformanceLoadPageMeasures, TelemetryHelper } from './model/telemetry-helper';
import { isDefault, UrlState } from './model/urlState';
import { LastAccessFilter, filterId as lastAccessFilterId } from './components/last-access-card';
import { ContentViewHistogramFilter } from './components/content-view-histogram';
import { CourseLastAccessFilter } from './components/course-last-access-card';
import { createComposeEmailPopup } from './components/email-integration';
import { CurrentFinalGradesFilter } from './components/current-final-grade-card';
import { Data } from './model/data.js';
import { DiscussionActivityFilter } from './components/discussion-activity-card';
import { ExportData } from './model/exportData';
import { fetchData } from './model/dataApiClient.js';
import { fetchData as fetchDemoData } from './model/fake-dataApiClient.js';
import { FilteredData } from './model/filteredData';
import { filterEventQueue } from './components/alert-data-update';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from './locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { OverdueAssignmentsFilter } from './components/overdue-assignments-card';
import { TimeInContentVsGradeFilter } from './components/time-in-content-vs-grade-card';
import { USER } from './consts.js';
import { ViewState } from './model/view-state';

/**
 * @property {Boolean} isDemo - if true, use canned data; otherwise call the LMS
 * @property {String} telemetryEndpoint - endpoint for gathering telemetry performance data
 * @property {String} telemetryId - GUID that is used to group performance metrics for each separate page load
 */
class EngagementDashboard extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			orgUnitId: { type: Number, attribute: 'org-unit-id' },
			telemetryEndpoint: { type: String, attribute: 'telemetry-endpoint' },
			telemetryId: { type: String, attribute: 'telemetry-id' },
			metronEndpoint: { type: String, attribute: 'metron-endpoint' },
			s3Enabled: { type: Boolean, attribute: 'student-success-system-enabled' },

			// user preferences:
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
			includeRoles: { type: String, attribute: 'include-roles', reflect: true },
			showAverageGradeSummaryCard: { type: Boolean, attribute: 'average-grade-summary-card', reflect: true },
			showContentViewsTrendCard: { type: Boolean, attribute: 'content-views-trend-card', reflect: true },
			showCourseAccessTrendCard: { type: Boolean, attribute: 'course-access-trend-card', reflect: true },
			showGradesTrendCard: { type: Boolean, attribute: 'grades-trend-card', reflect: true },
			showPredictedGradeCol: { type: Boolean, attribute: 'predicted-grade-col', reflect: true }
		};
	}

	constructor() {
		super();

		this.__defaultViewPopupShown = false; // a test-and-set variable: will always be true after the first read

		this.orgUnitId = 0;
		this.isDemo = false;
		this.telemetryEndpoint = '';
		this.telemetryId = '';
		this.metronEndpoint = '';
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
		this.includeRoles = '';
		this.showAverageGradeSummaryCard = false;
		this.showContentViewsTrendCard = false;
		this.showCourseAccessTrendCard = false;
		this.showGradesTrendCard = false;
		this.showPredictedGradeCol = false;

		this._viewState = new ViewState({});
		// if current view is not provided in url
		if (!this._viewState.currentView) {
			this._viewState.setHomeView();
		}
	}

	static get styles() {
		return [
			heading3Styles,
			css`
				:host {
					--d2l-insights-engagement-small-card-height: 154px;
					--d2l-insights-engagement-small-card-width: 291px;
					--d2l-insights-engagement-big-card-width: calc(var(--d2l-insights-engagement-small-card-width) * 2 + var(--d2l-insights-engagement-card-margin-right)); /* 594px; */
					--d2l-insights-engagement-big-card-height: calc(var(--d2l-insights-engagement-small-card-height) * 2 + var(--d2l-insights-engagement-card-margin-top));	/* 318px; */
					--d2l-insights-engagement-card-margin-top: 10px;
					--d2l-insights-engagement-card-margin-right: 12px;

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

				.d2l-main-overflow-group {
					flex-grow: 1;
					margin: 0.7em;
					max-width: 300px;
				}

				@media only screen and (max-width: 780px) {
					.d2l-main-overflow-group {
						max-width: 10%;
					}
				}

				.d2l-table-overflow-group {
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
		// moved loadData call here because its inderect call in render function via _data getter causes nested render call with exception
		if (this.currentView !== 'userSelection') {
			this._serverData.loadData({ defaultView: isDefault() });
		}
	}

	get currentView() {
		return this._viewState.currentView;
	}

	render() {
		let innerView = html``;
		switch (this.currentView) {
			case 'home':
				innerView = this._renderHomeView();
				break;
			case 'user':
				innerView = this._renderUserDrillView();
				break;
			case 'userSelection':
				innerView = this._renderUserSelectionView();
				break;
			case 'settings':
				innerView = this._renderSettingsView();
				break;
		}

		return html`
			<d2l-insights-immersive-nav
				.viewState="${this._viewState}"
				org-unit-id="${this.orgUnitId}"
			></d2l-insights-immersive-nav>

			${ innerView }
		`;
	}

	_renderUserDrillView() {
		// Pass in the known userId so we can preload the user profile and other data.
		let user = {
			userId : this._viewState.userViewUserId
		};

		// unlike setting selectedUserId in the user-selector, this also works with the browser's back button
		if (this._viewState.isSingleLearner) {
			this._serverData.selectedUserId = this._viewState.userViewUserId;
		}

		if (!this._isLoading) {
			const userData = this._serverData.userDictionary.get(Number(user.userId));

			if (userData) {
				user = {
					...user,
					firstName: userData[USER.FIRST_NAME],
					lastName: userData[USER.LAST_NAME],
					username: userData[USER.USERNAME],
				};
			}
		}

		return html`
			<d2l-insights-user-drill-view
				?skeleton="${this._isLoading}"
				?demo="${this.isDemo}"
				.data="${this._data}"
				.user="${user}"
				org-unit-id="${this.orgUnitId}"
				.viewState="${this._viewState}"
				.metronEndpoint="${this.metronEndpoint}"
				@d2l-insights-user-drill-view-back="${this._backToHomeHandler}"
				?average-grade-summary-card="${this.showAverageGradeSummaryCard}"
				?grades-trend-card="${this.showGradesTrendCard}"
				?course-access-trend-card="${this.showCourseAccessTrendCard}"
				?content-views-trend-card="${this.showContentViewsTrendCard}"
				?system-access-card="${this.showSystemAccessCard}"
				?overdue-card="${this.showOverdueCard}"
				?discussions-col="${this.showDiscussionsCol}"
				?grade-col="${this.showGradeCol}"
				?last-access-col="${this.showLastAccessCol}"
				?tic-col="${this.showTicCol}"
				?predicted-grade-col="${this.showPredictedGradeCol}"
				?student-success-system-enabled="${this.s3Enabled}"
			>
				<div slot="filters">
					${this._renderFilters()}
				</div>

				<div slot="applied-filters">
					${this._renderAppliedFilters()}
				</div>

				<div slot="alerts">
					${this._renderAlerts()}
				</div>
			</d2l-insights-user-drill-view>
		`;
	}

	_renderUserSelectionView() {
		return html`
			<d2l-insights-user-selector
				.data="${this._serverData}"
				?demo="${this.isDemo}"
				.viewState="${this._viewState}"
			>
			</d2l-insights-user-selector>
		`;
	}

	_renderFilters() {
		return html`
		<d2l-labs-ou-filter
			.dataManager="${this._serverData.ouFilterDataManager}"
			@d2l-labs-ou-filter-change="${this._orgUnitFilterChange}"
		></d2l-labs-ou-filter>
		<d2l-insights-semester-filter
			page-size="10000"
			?demo="${this.isDemo}"
			.preSelected="${this._serverData.selectedSemesterIds}"
			@d2l-insights-semester-filter-change="${this._semesterFilterChange}"
		></d2l-insights-semester-filter>
		`;
	}

	_renderAppliedFilters() {
		return html `
			<d2l-insights-applied-filters .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-applied-filters>
		`;
	}

	_renderAlerts() {
		return html`
		<d2l-insights-alert-data-updated
			.dataEvents="${filterEventQueue}"
			?skeleton="${this._isLoading}"
		>
		</d2l-insights-alert-data-updated>
		`;
	}

	_renderSettingsView() {
		return html`
			<d2l-insights-engagement-dashboard-settings
				?demo="${this.isDemo}"
				@d2l-insights-settings-view-back="${this._backToHomeHandler}"
				?course-access-card="${this.showCourseAccessCard}"
				?content-view-card="${this.showContentViewCard}"
				?courses-col="${this.showCoursesCol}"
				?discussions-card="${this.showDiscussionsCard}"
				?discussions-col="${this.showDiscussionsCol}"
				?grade-col="${this.showGradeCol}"
				?grades-card="${this.showGradesCard}"
				?last-access-col="${this.showLastAccessCol}"
				?overdue-card="${this.showOverdueCard}"
				?results-card="${this.showResultsCard}"
				?system-access-card="${this.showSystemAccessCard}"
				?tic-col="${this.showTicCol}"
				?tic-grades-card="${this.showTicGradesCard}"
				last-access-threshold-days="${this.lastAccessThresholdDays}"
				.includeRoles="${this._serverData.selectedRoleIds}"
				?average-grade-summary-card="${this.showAverageGradeSummaryCard}"
				?grades-trend-card="${this.showGradesTrendCard}"
				?course-access-trend-card="${this.showCourseAccessTrendCard}"
				?content-views-trend-card="${this.showContentViewsTrendCard}"
				?predicted-grade-col="${this.showPredictedGradeCol}"
				?student-success-system-enabled="${this.s3Enabled}"
			></d2l-insights-engagement-dashboard-settings>
		`;
	}

	_renderHomeView() {

		return html`

			<d2l-insights-aria-loading-progress .data="${this._data}"></d2l-insights-aria-loading-progress>

			<div class="d2l-heading-button-group">
				<h1 class="d2l-heading-1">${this.localize('dashboard:title')}</h1>
				<d2l-overflow-group
					class="d2l-main-overflow-group"
					min-to-show="0"
					opener-type="icon"
					opener-style="subtle"
				>
					<d2l-button-subtle
						icon="d2l-tier1:export"
						text=${this.localize('dashboard:exportToCsv')}
						@click="${this._exportToCsv}">
					</d2l-button-subtle>
					<d2l-button-subtle
						icon="d2l-tier1:help"
						text=${this.localize('dashboard:learMore')}
						@click="${this._openHelpLink}">
					</d2l-button-subtle>
					<d2l-button-subtle
						icon="d2l-tier1:gear"
						text=${this.localize('settings:title')}
						@click="${this._openSettingsPage}">
					</d2l-button-subtle>
				</d2l-overflow-group>
			</div>

			<div class="view-filters-container">
				${this._renderFilters()}
			</div>
			<d2l-insights-engagement-dashboard-errors
				.data="${this._data}"
				?no-data="${this._isNoUserResults}"
				?no-roles="${this._parsedIncludeRoles.length === 0}"
				@d2l-insights-undo-last-filter="${this._handleUndo}"
				@d2l-insights-go-to-settings="${this._openSettingsPage}">
			</d2l-insights-engagement-dashboard-errors>
			${this._summaryViewHeader}
			<div class="d2l-insights-summary-container-applied-filters">
				${this._renderAppliedFilters()}
			</div>
			<div class="d2l-insights-summary-chart-layout">
				<d2l-summary-cards-container

					?hidden="${this._isNoUserResults}"
					?skeleton="${this._isLoading}"

					.cards="${this.summaryCards}"
				></d2l-summary-cards-container>
				${this._gradesCard}
				${this._ticGradesCard}
				${this._courseAccessCard}
				${this._contentViewCard}
			</div>
			${this._userTable}
			<d2l-insights-default-view-popup
				?opened=${Boolean(this._serverData.isDefaultView && !this._defaultViewPopupShown)}
				.data="${this._serverData}">
			</d2l-insights-default-view-popup>

			<d2l-dialog-confirm
				id="no-users-selected-dialog"
				text="${this.localize('dashboard:noUsersSelectedDialogText')}">
				<d2l-button slot="footer" primary data-dialog-action>
					${this.localize('defaultViewPopup:buttonOk')}
				</d2l-button>
			</d2l-dialog-confirm>
			${this._renderAlerts()}
		`;
	}

	_resultsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-results-card .data="${this._data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-results-card>`;
	}
	_overdueAssignmentsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-overdue-assignments-card .data="${this._data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-overdue-assignments-card>`;
	}

	_discussionsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-discussion-activity-card .data="${this._data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-discussion-activity-card>`;
	}

	_lastAccessCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-last-access-card .data="${this._data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-last-access-card>`;
	}

	get summaryCards() {
		return [
			{ enabled: this.showResultsCard, htmlFn: (w) => this._resultsCard(w) },
			{ enabled: this.showOverdueCard, htmlFn: (w) => this._overdueAssignmentsCard(w) },
			{ enabled: this.showDiscussionsCard, htmlFn: (w) => this._discussionsCard(w) },
			{ enabled: this.showSystemAccessCard, htmlFn: (w) => this._lastAccessCard(w) }
		];
	}

	get _courseAccessCard() {
		if (!this.showCourseAccessCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-course-last-access-card ?demo="${this.isDemo}" .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-course-last-access-card></div>`;
	}

	get _gradesCard() {
		if (!this.showGradesCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-current-final-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-current-final-grade-card></div>`;
	}

	get _ticGradesCard() {
		if (!this.showTicGradesCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-time-in-content-vs-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-time-in-content-vs-grade-card></div>`;
	}

	get _contentViewCard() {
		if (!this.showContentViewCard || this._isNoUserResults) return '';
		return html`<d2l-labs-content-view-histogram .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-labs-content-view-histogram>`;
	}

	get _userTable() {
		if (this._isNoUserResults) return '';
		return html`
			<h2 class="d2l-heading-3">${this.localize('dashboard:resultsHeading')}</h2>
			<d2l-overflow-group
				class="d2l-table-overflow-group"
				min-to-show="1"
				max-to-show="2"
				opener-type="icon"
				opener-style="subtle"
			>
				<d2l-button-subtle
					aria-label="${this.localize('dashboard:emailButtonAriaLabel')}"
					icon="d2l-tier1:email"
					text="${this.localize('dashboard:emailButton')}"
					@click="${this._handleEmailButtonPress}">
				</d2l-button-subtle>
			</d2l-overflow-group>

			<d2l-insights-users-table
				.data="${this._data}"
				?skeleton="${this._isLoading}"
				?courses-col="${this.showCoursesCol}"
				?discussions-col="${this.showDiscussionsCol}"
				?grade-col="${this.showGradeCol}"
				?last-access-col="${this.showLastAccessCol}"
				?tic-col="${this.showTicCol}"
				@d2l-insights-users-table-cell-clicked="${this._userTableCellClicked}"
			></d2l-insights-users-table>
		`;
	}

	get _summaryViewHeader() {
		if (this._isNoUserResults) return '';
		return html`<h2 class="d2l-heading-3">${this.localize('dashboard:summaryHeading')}</h2>`;
	}

	_exportToCsv() {
		const usersTable = this.shadowRoot.querySelector('d2l-insights-users-table');
		ExportData.userDataToCsv(usersTable.dataForExport, usersTable.headersForExport);
	}

	_handleUndo() {
		UrlState.backOrResetView();
	}

	get _defaultViewPopupShown() {
		const currentVal = this.__defaultViewPopupShown;
		this.__defaultViewPopupShown = true;
		return currentVal;
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
				.withFilter(new LastAccessFilter(this.lastAccessThresholdDays, this.isDemo))
				.withFilter(new CourseLastAccessFilter(this.isDemo))
				.withFilter(new CurrentFinalGradesFilter())
				.withFilter(new DiscussionActivityFilter());

			const rowFilteredDataIntermediate = rowFilteredData.withFilter(new ContentViewHistogramFilter(rowFilteredData));
			this.__data = rowFilteredDataIntermediate.withFilter(new TimeInContentVsGradeFilter(rowFilteredDataIntermediate));
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
				recordProvider: this.isDemo ? fetchDemoData : fetchData,
				includeRoles: this._parsedIncludeRoles,
				metronEndpoint: this.metronEndpoint
			});
		}
		return this.__serverData;
	}

	get _parsedIncludeRoles() {
		return this.includeRoles.split(',').filter(x => x).map(Number);
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

	_backToHomeHandler(e) {
		if (e.detail) {
			this.showResultsCard = e.detail.showResultsCard;
			this.showOverdueCard = e.detail.showOverdueCard;
			this.showDiscussionsCard = e.detail.showDiscussionsCard;
			this.showSystemAccessCard = e.detail.showSystemAccessCard;
			this.showGradesCard = e.detail.showGradesCard;
			this.showTicGradesCard = e.detail.showTicGradesCard;
			this.showCourseAccessCard = e.detail.showCourseAccessCard;
			this.showCoursesCol = e.detail.showCoursesCol;
			this.showGradeCol = e.detail.showGradeCol;
			this.showTicCol = e.detail.showTicCol;
			this.showDiscussionsCol = e.detail.showDiscussionsCol;
			this.showLastAccessCol = e.detail.showLastAccessCol;
			this.lastAccessThresholdDays = e.detail.lastAccessThresholdDays;
			this.includeRoles = (e.detail.includeRoles || []).join(',');
			this.showAverageGradeSummaryCard = e.detail.showAvgGradeSummaryCard;
			this.showContentViewsTrendCard = e.detail.showContentViewsTrendCard;
			this.showCourseAccessTrendCard = e.detail.showCourseAccessTrendCard;
			this.showGradesTrendCard = e.detail.showGradesTrendCard;
			this.showPredictedGradeCol = e.detail.showPredictedGradeCol;
			this.showContentViewCard = e.detail.showContentViewCard;

			this._serverData.selectedRoleIds = e.detail.includeRoles;
			// update LastSystemAccess filter's threshold, as it may have changed (e.g. if new settings were saved)
			this._data.getFilter(lastAccessFilterId).thresholdDays = this.lastAccessThresholdDays;
		}
		if (this._viewState) {
			this._viewState.setHomeView();
		}
	}

	_openHelpLink() {
		window.open('https://community.brightspace.com/s/article/Brightspace-Performance-Plus-Analytics-Administrator-Guide', '_blank');
	}

	_openSettingsPage() {
		if (this._viewState) {
			this._viewState.setSettingsView();
		}
	}

	_orgUnitFilterChange(event) {
		event.stopPropagation();
		filterEventQueue.add(this.localize('alert:updatedFilter', { chartName: this.localize('orgUnitFilter:name') }));
		this._serverData.selectedOrgUnitIds = event.target.selected;
	}

	_semesterFilterChange(event) {
		event.stopPropagation();
		filterEventQueue.add(this.localize('alert:updatedFilter', { chartName: this.localize('semesterFilter:name') }));
		this._serverData.selectedSemesterIds = event.target.selected;
	}

	_handleEmailButtonPress() {
		const usersTable = this.shadowRoot.querySelector('d2l-insights-users-table');
		const selectedUserIds = [...usersTable.selectedUserIds];

		if (!selectedUserIds.length) {
			const noUsersSelectedDialog = this.shadowRoot.querySelector('#no-users-selected-dialog');
			noUsersSelectedDialog.opened = true;
		} else {
			// we use the root OU id because that's where we expect users to have email permissions
			createComposeEmailPopup(selectedUserIds, this._serverData.orgUnitTree.rootId);
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

	_userTableCellClicked(event) {
		const nameCellIdx = 1;
		if (this._viewState && event.detail.columnIdx === nameCellIdx) {
			this._viewState.setUserView(event.detail.userId);
		}
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
