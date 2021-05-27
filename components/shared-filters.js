import { filterEventQueue } from './alert-data-update';
import { html } from 'lit-element';

export function _renderFilters(parent) {
	return html`
	<d2l-insights-ou-filter
		.data="${parent.serverData}"
		@d2l-insights-ou-filter-change="${parent._orgUnitFilterChange}"
	></d2l-insights-ou-filter>
	<d2l-insights-semester-filter
		page-size="10000"
		?demo="${parent.isDemo}"
		.preSelected="${parent.serverData.selectedSemesterIds}"
		@d2l-insights-semester-filter-change="${parent._semesterFilterChange}"
	></d2l-insights-semester-filter>
	`;
}

export function _renderAppliedFilters(parent) {
	return html `
		<d2l-insights-applied-filters .data="${parent.data}" ?skeleton="${parent._isLoading}"></d2l-insights-applied-filters>
	`;
}

export function _renderAlerts(parent) {
	return html`
	<d2l-insights-alert-data-updated
		.dataEvents="${filterEventQueue}"
		?skeleton="${parent._isLoading}"
	>
	</d2l-insights-alert-data-updated>
	`;
}
