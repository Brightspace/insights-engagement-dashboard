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

				.d2l-insights-user-selector-search {
					display: flex;
					flex-wrap: nowrap;
					max-width: 334px;
					padding-bottom: 26px;
					padding-top: 4px;
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
			<h2 class="d2l-heading-1">${this.localize('learnerEngagementDashboard:title')}</h2>

			<div class="d2l-insights-user-selector-search">
				<d2l-input-search
					label="${this.localize('treeSelector:searchLabel')}"
					placeholder="${this.localize('treeSelector:searchPlaceholder')}"
					@d2l-input-search-searched="${this._onSearch}"
				></d2l-input-search>
			</div>

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
					<div class="d2l-body-standard d2l-skeletize">
						${u.last}, ${u.first}
					</div>
					<div class="d2l-body-small d2l-skeletize">
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

	_onSearch(e) {
		this._search(e.detail.value, true);
	}

	_search(searchText, ascending) {
		const cleared = searchText === '';

		console.log(`searchText: ${searchText}; ascending: ${ascending}; cleared: ${cleared}`);

		this.skeleton = true;

		this.users = this._usersForSkeleton();

		setTimeout(() => {
			this.users = [
				{ id: 11053, first: 'Beverly', last: 'Aadland', login: 'baadland' },
				{ id: 11054, first: 'Maybe', last: 'Another', login: 'manother' }
			];

			this.skeleton = false;
		}, 2000);

	}

	_usersForSkeleton() {
		return Array.from(Array(10).keys())
			.map(i => ({
				id: i,
				first: 'first',
				last: 'last',
				login: 'login'
			}));
	}
}
customElements.define('d2l-insights-user-selector', UserSelector);
