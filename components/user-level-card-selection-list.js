import '@brightspace-ui/core/components/offscreen/offscreen.js';

import '../components/summary-card';
import '../components/svg/grades-trend.svg';
import '../components/svg/course-access-trend.svg';
import '../components/svg/content-views-trend.svg';

import { bodySmallStyles, bodyStandardStyles, heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element/lit-element';
import { formatPercent } from '@brightspace-ui/intl';
import { Localizer } from '../locales/localizer';
import { numberFormatOptions } from './user-drill-view';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

class UserLevelCardSelectionList extends RtlMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			showAverageGradeSummaryCard: { type: Boolean, attribute: 'average-grade-summary-card', reflect: true },
			showContentViewsTrendCard: { type: Boolean, attribute: 'content-views-trend-card', reflect: true },
			showCourseAccessTrendCard: { type: Boolean, attribute: 'course-access-trend-card', reflect: true },
			showGradesTrendCard: { type: Boolean, attribute: 'grades-trend-card', reflect: true }
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyStandardStyles, heading3Styles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-demo-card {
				margin-bottom: 10px;
				margin-left: 30px;
				margin-right: 0;
				margin-top: 10px;
			}

			:host([dir="rtl"]) .d2l-demo-card {
				margin-bottom: 10px;
				margin-left: 0;
				margin-right: 30px;
				margin-top: 10px;
			}

			.d2l-insights-list-flex-container {
				display: flex;
				flex-direction: row;
			}

			.d2l-card-selection-title {
				margin-top: 0;
			}

			.d2l-card-selection-text {
				margin: 10px 30px;
			}

			@media screen and (max-width: 767px) {
				.d2l-insights-list-flex-container {
					display: flex;
					flex-direction: column;
				}

				.d2l-card-selection-title {
					display: none;
				}

				.d2l-card-selection-text p {
					margin-top: 0;
				}
			}
		`];
	}

	constructor() {
		super();

		this.showAverageGradeSummaryCard = false;
		this.showContentViewsTrendCard = false;
		this.showCourseAccessTrendCard = false;
		this.showGradesTrendCard = false;
	}

	render() {
		// NB: card selection list-item keys MUST have the same name as its corresponding component property
		// e.g. the key for this.showGradesCard must be "showGradesCard" (see _handleCardSelectionListChange)

		return html`
			<d2l-list id="card-selection-list" @d2l-list-selection-change="${this._handleCardSelectionListChange}">

				<d2l-list-item key="showAverageGradeSummaryCard" label="${this.localize('settings:avgGradeSummary')}" selectable ?selected="${this.showAverageGradeSummaryCard}">
					<div class="d2l-insights-list-flex-container">
						<d2l-labs-summary-card
							class="d2l-demo-card"
							card-title="${this.localize('averageGradeSummaryCard:averageGrade')}"
							card-value="${formatPercent(68.02 / 100, numberFormatOptions)}"
							card-message="${this.localize('averageGradeSummaryCard:averageGradeText')}"
							aria-hidden="true"
						>
						</d2l-labs-summary-card>
						<div class="d2l-card-selection-text">
							<h3 class="d2l-heading-3 d2l-card-selection-title" aria-hidden="true">
								${this.localize('settings:avgGradeSummary')}
							</h3>
							<d2l-offscreen>${this.localize('settings:avgGradeSummary')}</d2l-offscreen>
							<p class="d2l-body-standard">${this.localize('settings:avgGradeSummaryDescription')}</p>
						</div>
					</div>
				</d2l-list-item>

				<d2l-list-item key="showGradesTrendCard" label="${this.localize('gradesTrendCard:gradesOverTime')}" selectable ?selected="${this.showGradesTrendCard}">
					<div class="d2l-insights-list-flex-container">
						<d2l-insights-grades-trend-thumbnail class="d2l-demo-card" aria-hidden="true"></d2l-insights-grades-trend-thumbnail>
						<div class="d2l-card-selection-text">
							<h3 class="d2l-heading-3 d2l-card-selection-title" aria-hidden="true">
								${this.localize('gradesTrendCard:gradesOverTime')}
							</h3>
							<d2l-offscreen>${this.localize('gradesTrendCard:gradesOverTime')}</d2l-offscreen>
							<p class="d2l-body-standard">${this.localize('settings:gradesOverTimeDescription')}</p>
						</div>
					</div>
				</d2l-list-item>

				<d2l-list-item key="showCourseAccessTrendCard" label="${this.localize('accessTrendCard:title')}" selectable ?selected="${this.showCourseAccessTrendCard}">
					<div class="d2l-insights-list-flex-container">
						<d2l-insights-course-access-trend-thumbnail class="d2l-demo-card" aria-hidden="true"></d2l-insights-course-access-trend-thumbnail>
						<div class="d2l-card-selection-text">
							<h3 class="d2l-heading-3 d2l-card-selection-title" aria-hidden="true">
								${this.localize('accessTrendCard:title')}
							</h3>
							<d2l-offscreen>${this.localize('accessTrendCard:title')}</d2l-offscreen>
							<p class="d2l-body-standard">${this.localize('settings:accessOverTimeDescription')}</p>
						</div>
					</div>
				</d2l-list-item>

				<d2l-list-item key="showContentViewsTrendCard" label="${this.localize('contentViewsCard:contentViewOverTime')}" selectable ?selected="${this.showContentViewsTrendCard}">
					<div class="d2l-insights-list-flex-container">
						<d2l-insights-content-views-trend-thumbnail class="d2l-demo-card" aria-hidden="true"></d2l-insights-content-views-trend-thumbnail>
						<div class="d2l-card-selection-text">
							<h3 class="d2l-heading-3 d2l-card-selection-title" aria-hidden="true">
								${this.localize('contentViewsCard:contentViewOverTime')}
							</h3>
							<d2l-offscreen>${this.localize('contentViewsCard:contentViewOverTime')}</d2l-offscreen>
							<p class="d2l-body-standard">${this.localize('settings:contentViewsOverTimeDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
			</d2l-list>
		`;
	}

	_handleCardSelectionListChange(event) {
		this[event.detail.key] = event.detail.selected;
	}

	get settings() {
		return {
			showAvgGradeSummaryCard: this.showAverageGradeSummaryCard, // note name change to match LMS api
			showContentViewsTrendCard: this.showContentViewsTrendCard,
			showCourseAccessTrendCard: this.showCourseAccessTrendCard,
			showGradesTrendCard: this.showGradesTrendCard
		};
	}
}
customElements.define('d2l-insights-engagement-user-card-selection-list', UserLevelCardSelectionList);
