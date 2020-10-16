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
import './components/default-view-popup.js';

import { css, html } from 'lit-element/lit-element.js';
import { CourseLastAccessCardFilter } from './components/course-last-access-card';
import { CurrentFinalGradeCardFilter } from './components/current-final-grade-card';
import { Data } from './model/data.js';
import { fetchData } from './model/lms.js';
import { fetchData as fetchDemoData } from './model/fake-lms.js';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from './locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { OverdueAssignmentsCardFilter } from './components/overdue-assignments-card';
import { TimeInContentVsGradeCardFilter } from './components/time-in-content-vs-grade-card';

/**
 * @property {Boolean} isDemo - if true, use canned data; otherwise call the LMS
 */
class EngagementDashboard extends Localizer(MobxLitElement) {

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' }
		};
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

				.d2l-insights-summary-container {
					display: flex;
					flex-wrap: wrap;
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

				@media screen and (max-width: 615px) {
					h1 {
						line-height: 2rem;
					}

					:host {
						display: block;
						padding: 0 18px;
					}
				}
			`
		];
	}

	render() {
		return html`
				<d2l-insights-aria-loading-progress .data="${this._data}"></d2l-insights-aria-loading-progress>

				<h1 class="d2l-heading-1">${this.localize('components:insights-engagement-dashboard:title')}</h1>

				<div class="view-filters-container">
					<d2l-insights-ou-filter
						.data="${this._data}"
						@d2l-insights-ou-filter-change="${this._orgUnitFilterChange}"
					></d2l-insights-ou-filter>
					<d2l-insights-semester-filter
						page-size="10000"
						?demo="${this.isDemo}"
						.preSelected="${this._data.selectedSemesterIds}"
						@d2l-insights-semester-filter-change="${this._semesterFilterChange}"
					></d2l-insights-semester-filter>
					<d2l-insights-role-filter
						@d2l-insights-role-filter-change="${this._roleFilterChange}"
						?demo="${this.isDemo}"
					></d2l-insights-role-filter>
				</div>

				<h2 class="d2l-heading-3">${this.localize('components:insights-engagement-dashboard:summaryHeading')}</h2>
				<div class="d2l-insights-summary-container-applied-filters">
					<d2l-insights-applied-filters .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-applied-filters>
				</div>
				<div class="d2l-insights-summary-container">
					<d2l-insights-results-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-results-card>
					<d2l-insights-overdue-assignments-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-overdue-assignments-card>
				</div>
				<div class="d2l-insights-chart-container">
					<div><d2l-insights-current-final-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-current-final-grade-card></div>
					<div><d2l-insights-time-in-content-vs-grade-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-time-in-content-vs-grade-card></div>
					<div><d2l-insights-course-last-access-card .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-course-last-access-card></div>
				</div>
				<h2 class="d2l-heading-3">${this.localize('components:insights-engagement-dashboard:resultsHeading')}</h2>
				<d2l-insights-users-table .data="${this._data}" ?skeleton="${this._isLoading}"></d2l-insights-users-table>

				<d2l-insights-default-view-popup
					?opened=${Boolean(this._data.defaultViewPopupDisplayData.length)}
					.data="${this._data.defaultViewPopupDisplayData}">
				</d2l-insights-default-view-popup>
		`;
	}

	get _isLoading() {
		return this._data.isLoading;
	}

	get _data() {
		if (!this.__data) {
			const cardFilters = [
				OverdueAssignmentsCardFilter,
				TimeInContentVsGradeCardFilter,
				CourseLastAccessCardFilter,
				CurrentFinalGradeCardFilter
			].map(filter => ({ ...filter, title: this.localize(filter.title) }));

			this.__data = new Data({
				recordProvider: this.isDemo ? fetchDemoData : fetchData,
				cardFilters: cardFilters
			});
		}

		return this.__data;
	}

	_roleFilterChange(event) {
		event.stopPropagation();
		this._data.selectedRoleIds = event.target.selected;
	}

	_orgUnitFilterChange(event) {
		event.stopPropagation();
		this._data.selectedOrgUnitIds = event.target.selected;
	}

	_semesterFilterChange(event) {
		event.stopPropagation();
		this._data.selectedSemesterIds = event.target.selected;
	}
}
customElements.define('d2l-insights-engagement-dashboard', EngagementDashboard);
