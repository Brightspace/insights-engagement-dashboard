/* eslint-disable lit/no-private-properties */
import './components/pages/engagement.js';
import './components/pages/learner.js';
import './components/pages/learner-selector.js';
import { html } from 'lit-element';
import { registerRoutes } from '@brightspace-ui-labs/lit-router';

const options = {
	basePath: '/demo'
};

registerRoutes([
	{
		pattern: '/',
		view: (ctx) => html`<d2l-insights-engagement-dashboard-view
								?demo=${ctx.options.isDemo}
								?loading=${ctx.options.isLoading}
								.data=${ctx.options.data}
								.serverData=${ctx.options.serverData}
								?content-view-card=${ctx.options.showContentViewCard}
								?course-access-card=${ctx.options.showCourseAccessCard}
								?courses-col=${ctx.options.showCoursesCol}
								?discussions-card=${ctx.options.showDiscussionsCard}
								?discussions-col=${ctx.options.showDiscussionsCol}
								?grades-card=${ctx.options.showGradesCard}
								?grade-col=${ctx.options.showGradeCol}
								?last-access-col=${ctx.options.showLastAccessCol}
								?overdue-card=${ctx.options.showOverdueCard}
								?results-card=${ctx.options.showResultsCard}
								?system-access-card=${ctx.options.showSystemAccessCard}
								?tic-col=${ctx.options.showTicCol}
								?tic-grades-card=${ctx.options.showTicGradesCard}
								?last-access-threshold-days=${ctx.options.lastAccessThresholdDays}
								?include-roles=${ctx.options.includeRoles}
								?average-grade-summary-card=${ctx.options.showAverageGradeSummaryCard}
								?content-views-trend-card=${ctx.options.showContentViewsTrendCard}
								?course-access-trend-card=${ctx.options.showCourseAccessTrendCard}
								?grades-trend-card=${ctx.options.showGradesTrendCard}
								?predicted-grade-col=${ctx.options.showPredictedGradeCol}
							></d2l-insights-engagement-dashboard-view>`
	},
	{
		pattern: '/learner',
		view: () => html`<d2l-insights-learner-dashboard-view></d2l-insights-learner-dashboard-view>`
	},
	{
		pattern: '/learner-select',
		view: () => html`<d2l-insights-learner-selector-view></d2l-insights-learner-selector-view>`
	},
	{
		pattern: '/settings',
		view: () => html`<d2l-insights-dashboard-settings-view></d2l-insights-dashboard-settings-view>`
	},
], options);
