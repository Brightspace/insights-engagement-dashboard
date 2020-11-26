import { computed, decorate, observable } from 'mobx';
import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UrlState } from '../model/urlState';

const filterId = 'd2l-insights-overdue-assignments-card';

export class OverdueAssignmentsFilter {
	constructor() {
		this.isApplied = false;
		this._urlState = new UrlState(this);
	}

	get id() { return filterId; }

	get title() { return 'components.insights-engagement-dashboard.overdueAssignmentsHeading'; }

	filter(record) {
		return record[RECORD.OVERDUE] > 0;
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
			data: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
	}

	get _cardMessage() {
		return this.localize('components.insights-engagement-dashboard.overdueAssignments');
	}

	get _cardTitle() {
		return this.localize('components.insights-engagement-dashboard.overdueAssignmentsHeading');
	}

	get _cardValue() {
		return this.data.withoutFilter(filterId).records
			.reduce((acc, record) => {
				if (!acc.has(record[RECORD.USER_ID]) && record[RECORD.OVERDUE] !== 0) {
					acc.add(record[RECORD.USER_ID]);
				}
				return acc;
			}, 	new Set()).size;
	}

	get filter() {
		return this.data.getFilter(filterId);
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
			></d2l-labs-summary-card>
		`;
	}

	_valueClickHandler() {
		this.filter.isApplied = !this.filter.isApplied;
	}
}
decorate(OverdueAssignmentsCard, {
	filter: computed,
	_cardValue: computed
});
customElements.define('d2l-insights-overdue-assignments-card', OverdueAssignmentsCard);
