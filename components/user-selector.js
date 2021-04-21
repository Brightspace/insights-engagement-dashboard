import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item-button.js';
import 'd2l-users/components/d2l-profile-image';

import { bodySmallStyles, bodyStandardStyles, heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class UserSelector extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			data: { type: Object, attribute: false },
			viewState: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [
			super.styles,
			heading1Styles,
			bodySmallStyles,
			bodyStandardStyles,
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();

		this.isDemo = false;
		this.data = null;
		this.viewState = null;

		this._tokenPromise = this._tokenPromise.bind(this);

		this.users = [{ id: 11053, first: 'Beverly', last: 'Aadland', login: 'baadland' },
			{ id: 11054, first: 'Maybe', last: 'Another', login: 'manother' }];
	}

	render() {
		return html`
			<h2 class="d2l-heading-1">Learner Engagement Dashboard</h2>
			<d2l-list>
				${this.users.map(u => this.userListItem(u))}
			</d2l-list>
		`;
	}

	userListItem(u) {
		return html`
			<d2l-list-item-button
				key="${u.id}"
				@d2l-list-item-button-click="${this.onUserSelection}"
			>
				<d2l-profile-image
					slot="illustration"
					href="${`/d2l/api/hm/users/${u.id}`}"
					.token="${this._tokenPromise}"
					medium
				></d2l-profile-image>
				<div>
					<div class="d2l-body-standard">
						${u.last}, ${u.first}
					</div>
					<div class="d2l-body-small">
						${u.login} - ${u.id}
					</div>
				</div>
			</d2l-list-item-button>
		`;
	}

	onUserSelection(e) {
		const selectedUserId = Number(e.target.key);
		this.data.selectedUserId = selectedUserId;
		this.viewState.setUserView(selectedUserId, /*isSingleLearner*/ true);
	}

	_tokenPromise() {
		return this.isDemo ? Promise.resolve('token') : D2L.LP.Web.Authentication.OAuth2.GetToken('users:profile:read');
	}
}
customElements.define('d2l-insights-user-selector', UserSelector);
