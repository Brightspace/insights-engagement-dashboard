import { computed, decorate, observable } from 'mobx';
import { filterEventQueue } from './alert-data-update';
import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UrlState } from '../model/urlState';

export const OVERDUE_ASSIGNMENTS_FILTER_ID = 'd2l-insights-overdue-assignments-card';

export class OverdueAssignmentsFilter {
	constructor() {
		this.isApplied = false;
		this._urlState = new UrlState(this);
	}

	get id() { return OVERDUE_ASSIGNMENTS_FILTER_ID; }

	get title() { return 'dashboard:overdueAssignmentsHeading'; }

	filter(record) {
		return record[RECORD.OVERDUE] > 0;
	}

	axeDescription(localizer, term) {
		const chartName = { chartName: localizer(this.title) };
		return localizer(term, chartName);
	}

	// for UrlState
	get persistenceKey() { return 'oaf'; }

	get persistenceValue() {
		return this.isApplied ? '1' : '';
	}

	set persistenceValue(value) {
		this.isApplied = value === '1';
	}
}
decorate(OverdueAssignmentsFilter, {
	isApplied: observable
});

class OverdueAssignmentsCard extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			wide: { type: Boolean, attribute: true },
			tall: { type: Boolean, attribute: true }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.wide = false;
		this.tall = false;
	}

	get _cardMessage() {
		return this.localize('dashboard:overdueAssignments');
	}

	get _cardTitle() {
		return this.localize('dashboard:overdueAssignmentsHeading');
	}

	get _cardValue() {
		return this.data.withoutFilter(OVERDUE_ASSIGNMENTS_FILTER_ID).records
			.reduce((acc, record) => {
				if (!acc.has(record[RECORD.USER_ID]) && record[RECORD.OVERDUE] !== 0) {
					acc.add(record[RECORD.USER_ID]);
				}
				return acc;
			}, 	new Set()).size;
	}

	get filter() {
		return this.data.getFilter(OVERDUE_ASSIGNMENTS_FILTER_ID);
	}

	render() {
		return html`
			<d2l-labs-summary-card
				id="d2l-insights-engagement-overdue-assignments"
				value-clickable
				card-title="${this._cardTitle}"
				card-value="${this._cardValue}"
				card-message="${this._cardMessage}"
				@d2l-labs-summary-card-value-click=${this._valueClickHandler}
				?skeleton="${this.skeleton}"
				?wide="${this.wide}"
				?tall="${this.tall}"
			></d2l-labs-summary-card>
		`;
	}

	_valueClickHandler() {
		this.filter.isApplied = !this.filter.isApplied;
		const chartName = { chartName: this.localize('dashboard:overdueAssignmentsHeading') };
		filterEventQueue.add(
			this.localize('alert:updatedFilter', chartName)
		);
	}
}
decorate(OverdueAssignmentsCard, {
	filter: computed,
	_cardValue: computed
});
customElements.define('d2l-insights-overdue-assignments-card', OverdueAssignmentsCard);
