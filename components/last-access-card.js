import { computed, decorate, observable } from 'mobx';
import { RECORD, USER } from '../consts';
import { html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UrlState } from '../model/urlState';

export const filterId = 'd2l-insights-last-access-card';
const oneDayMillis = 86400000;
const demoDate = 16088300239822; //for Visual-Diff test

export class LastAccessFilter {
	constructor(thresholdDays, isDemo) {
		this.isApplied = false;
		this.thresholdDays = thresholdDays;
		this._urlState = new UrlState(this);
		this.isDemo = isDemo;
	}

	get id() { return filterId; }

	get title() {
		return 'dashboard:lastSystemAccessHeading';
	}

	filter(record, userDictionary) {
		const user = userDictionary.get(record[RECORD.USER_ID]);
		return this.isWithoutRecentAccess(user);
	}

	// for UrlState
	get persistenceKey() { return 'saf'; }

	get persistenceValue() {
		return this.isApplied ? '1' : '';
	}

	set persistenceValue(value) {
		this.isApplied = value === '1';
	}

	isWithoutRecentAccess(user) {
		const currentDate = this.isDemo ? demoDate : Date.now();
		return !user[USER.LAST_SYS_ACCESS] ||
			((currentDate - user[USER.LAST_SYS_ACCESS]) > this.thresholdDays * oneDayMillis);
	}
}

decorate(LastAccessFilter, {
	isApplied: observable
});

class LastAccessCard extends SkeletonMixin(Localizer(MobxLitElement)) {

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
		return this.filter.thresholdDays !== 1 ?
			this.localize(
				'dashboard:lastSystemAccessMessage',
				{ thresholdDays: this.filter.thresholdDays }
			) :
			this.localize('dashboard:lastSystemAccessMessageOneDay');
	}

	get _cardTitle() {
		return this.localize('dashboard:lastSystemAccessHeading');
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	get _cardValue() {
		return this.data.withoutFilter(filterId).users
			.filter(user => this.filter.isWithoutRecentAccess(user)).length;
	}

	render() {
		return html`
			<d2l-labs-summary-card
				id="d2l-insights-engagement-last-access"
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
	}
}
customElements.define('d2l-insights-last-access-card', LastAccessCard);

decorate(LastAccessCard, {
	_cardValue: computed,
	filter: computed
});
