import '@brightspace-ui/core/components/list/list.js';
import '@brightspace-ui/core/components/list/list-item-button.js';
import 'd2l-users/components/d2l-profile-image';

import { bodySmallStyles, bodyStandardStyles, heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html } from 'lit-element';
import { getVisibleUsers } from '../model/dataApiClient';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

const usersForSkeleton = Array.from(Array(10).keys())
	.map(i => ({
		Id: -i,
		FirstName: 'first',
		LastName: 'last',
		Username: 'login'
	}));

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

		this.users = usersForSkeleton;
	}

	firstUpdated() {
		this._search();
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
				key="${u.Id}"
				@d2l-list-item-button-click="${this.onUserSelection}"
			>
				<d2l-profile-image
					slot="illustration"
					href="${ifDefined(u.Id > 0 ? `/d2l/api/hm/users/${u.Id}` : undefined)}"
					.token="${this._tokenPromise}"
					medium
				></d2l-profile-image>
				<div>
					<div class="d2l-body-standard d2l-skeletize">
						${u.LastName}, ${u.FirstName}
					</div>
					<div class="d2l-body-small d2l-skeletize">
						${u.Username} - ${u.Id}
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

	_search(searchText) {
		this.skeleton = true;
		this.users = usersForSkeleton;

		if (!this.isDemo) {
			getVisibleUsers(searchText)
				.then(users => {
					this.users = users;
					this.skeleton = false;
				});
		} else {
			setTimeout(() => {
				this.users = [
					{ Id: 11053, FirstName: 'Beverly', LastName: 'Aadland', Username: 'baadland' },
					{ Id: 11054, FirstName: 'Maybe', LastName: 'Another', Username: 'manother' }
				];

				this.skeleton = false;
			}, 2000);
		}

	}
}
customElements.define('d2l-insights-user-selector', UserSelector);
