import { _renderAlerts, _renderAppliedFilters, _renderFilters } from '../shared-filters';
import { css, html } from 'lit-element';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from '../../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class EngagementView extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			serverData: { type: Object, attribute: false },
			data: { type: Object, attribute: false },
			isLoading: { type: Boolean, attribute: 'loading' },
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

	_renderHomeView() {

		return html`

			<d2l-insights-aria-loading-progress .data="${this.data}"></d2l-insights-aria-loading-progress>

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
				${_renderFilters(this)}
			</div>
			<d2l-insights-engagement-dashboard-errors
				.data="${this.data}"
				.isNoDataReturned="${this._isNoUserResults}"
				@d2l-insights-undo-last-filter="${this._handleUndo}">
			</d2l-insights-engagement-dashboard-errors>
			${this._summaryViewHeader}
			<div class="d2l-insights-summary-container-applied-filters">
				${_renderAppliedFilters(this)}
			</div>
			<div class="d2l-insights-summary-chart-layout">
				<d2l-summary-cards-container

					?hidden="${this._isNoUserResults}"
					?skeleton="${this.isLoading}"

					.cards="${this.summaryCards}"
				></d2l-summary-cards-container>
				${this._gradesCard}
				${this._ticGradesCard}
				${this._courseAccessCard}
				${this._contentViewCard}
			</div>
			${this._userTable}
			<d2l-insights-default-view-popup
				?opened=${Boolean(this.serverData.isDefaultView && !this._defaultViewPopupShown)}
				.data="${this.serverData}">
			</d2l-insights-default-view-popup>

			<d2l-dialog-confirm
				id="no-users-selected-dialog"
				text="${this.localize('dashboard:noUsersSelectedDialogText')}">
				<d2l-button slot="footer" primary data-dialog-action>
					${this.localize('defaultViewPopup:buttonOk')}
				</d2l-button>
			</d2l-dialog-confirm>
			${_renderAlerts(this)}
		`;
	}

	get _summaryViewHeader() {
		if (this._isNoUserResults) return '';
		return html`<h2 class="d2l-heading-3">${this.localize('dashboard:summaryHeading')}</h2>`;
	}

	get summaryCards() {
		return [
			{ enabled: this.showResultsCard, htmlFn: (w) => this._resultsCard(w) },
			{ enabled: this.showOverdueCard, htmlFn: (w) => this._overdueAssignmentsCard(w) },
			{ enabled: this.showDiscussionsCard, htmlFn: (w) => this._discussionsCard(w) },
			{ enabled: this.showSystemAccessCard, htmlFn: (w) => this._lastAccessCard(w) }
		];
	}

	get _isNoUserResults() {
		if (!this.isDemo) {
			return this._data.records.length === 0 && !this._data.isLoading;
		}
		return false;
	}

	_resultsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-results-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-results-card>`;
	}
	_overdueAssignmentsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-overdue-assignments-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-overdue-assignments-card>`;
	}

	_discussionsCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-discussion-activity-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-discussion-activity-card>`;
	}

	_lastAccessCard({ wide, tall, skeleton }) {
		return html`<d2l-insights-last-access-card .data="${this.data}" ?wide="${wide}" ?tall="${tall}" ?skeleton="${skeleton}"></d2l-insights-last-access-card>`;
	}

	get _courseAccessCard() {
		if (!this.showCourseAccessCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-course-last-access-card ?demo="${this.isDemo}" .data="${this.data}" ?skeleton="${this.isLoading}"></d2l-insights-course-last-access-card></div>`;
	}

	get _gradesCard() {
		if (!this.showGradesCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-current-final-grade-card .data="${this.data}" ?skeleton="${this.isLoading}"></d2l-insights-current-final-grade-card></div>`;
	}

	get _ticGradesCard() {
		if (!this.showTicGradesCard || this._isNoUserResults) return '';
		return html`<div><d2l-insights-time-in-content-vs-grade-card .data="${this.data}" ?skeleton="${this.isLoading}"></d2l-insights-time-in-content-vs-grade-card></div>`;
	}

	get _contentViewCard() {
		if (!this.showContentViewCard || this._isNoUserResults) return '';
		return html`<d2l-labs-content-view-histogram .data="${this.data}" ?skeleton="${this.isLoading}"></d2l-labs-content-view-histogram>`;
	}

	get _userTable() {
		if (this._isNoUserResults) return '';
		return html`
			<h2 class="d2l-heading-3">${this.localize('dashboard:resultsHeading')}</h2>
			<d2l-overflow-group
				class="d2l-table-overflow-group"
				min-to-show="0"
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
				.data="${this.data}"
				?skeleton="${this.isLoading}"
				?courses-col="${this.showCoursesCol}"
				?discussions-col="${this.showDiscussionsCol}"
				?grade-col="${this.showGradeCol}"
				?last-access-col="${this.showLastAccessCol}"
				?tic-col="${this.showTicCol}"
				@d2l-insights-users-table-cell-clicked="${this._userTableCellClicked}"
			></d2l-insights-users-table>
		`;
	}

	render() {
		return this._renderHomeView();
	}
}

customElements.define('d2l-insights-engagement-dashboard-view', EngagementView);
