import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import 'd2l-users/components/d2l-profile-image';

import { bodySmallStyles, bodyStandardStyles, heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { ListItemButtonMixin } from '@brightspace-ui/core/components/list/list-item-button-mixin';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class UserSelector extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			data: { type: Object, attribute: false },
			viewState: { type: Object, attribute: false },
			_sortedAscending: { type: Boolean, attribute: false }
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
					padding-bottom: 10px;
				}
				:host([hidden]) {
					display: none;
				}

				d2l-profile-image {
					padding-left: 20px;
				}

				d2l-list-item-button {
					border-radius: 8px;
				}

				.d2l-insights-user-selector-search {
					display: flex;
					flex-wrap: nowrap;
					max-width: 334px;
					padding-bottom: 26px;
					padding-top: 4px;
				}

				.d2l-insights-user-selector-list {
					border-left: 1px solid var(--d2l-color-mica);
					border-right: 1px solid var(--d2l-color-mica);
					border-radius: 8px;
				}

				.d2l-insights-user-selector-header {
					border-top: 1px solid var(--d2l-color-mica);
					background-color: var(--d2l-color-regolith);
					color: var(--d2l-color-ferrite);
					cursor: pointer;
					height: 27px; /* min-height to be 48px including border */
					line-height: 1.4rem;
					padding: 10px 20px;
					border-radius: 8px;
				}

				.d2l-insights-user-selector-header:focus {
					outline: solid 0;
					text-decoration: underline;
				}

				.d2l-insights-user-selector-header-sort-indicator {
					pointer-events: none;
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
		this._sortedAscending = false;

		this.users = this._usersForSkeleton();
	}

	firstUpdated() {
		this._search(this._searchText, this._sortedAscending);
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

			<div class="d2l-insights-user-selector-list">
				<div
					class="d2l-insights-user-selector-header"
					role="button"
					tabindex="${this.skeleton ? -1 : 0}"
					@click="${this._handleHeaderClicked}"
					@keydown="${this._handleHeaderKey}">

					<span>${this.localize('usersTableExport:lastName')},</span>
					${this.sortedArrowIcon()}
					<span>${this.localize('usersTableExport:FirstName')}</span>
				</div>

				<d2l-list>
					${this.users.map(u => this.userListItem(u))}
				</d2l-list>
			</div>
		`;
	}

	userListItem(u) {
		return html`
			<d2l-insights-list-item-button
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
			</d2l-insights-list-item-button>
		`;
	}

	sortedArrowIcon() {
		const arrowDirection = this._sortedAscending ? 'arrow-toggle-up' : 'arrow-toggle-down';
		const ariaLabelText = arrowDirection === 'arrow-toggle-up' ? this.localize('table:sortedAscending') : this.localize('table:sortedDescending');

		return html`<d2l-icon role="img" aria-label="${ariaLabelText}" icon="tier1:${arrowDirection}" class="d2l-insights-user-selector-header-sort-indicator"></d2l-icon>`;
	}

	onUserSelection(e) {
		const selectedUserId = Number(e.target.key);
		this.data.selectedUserId = selectedUserId;
		this.viewState.setUserView(selectedUserId, /*isSingleLearner*/ true);
	}

	get _searchText() {
		const searchInput = this.shadowRoot.querySelector('d2l-input-search');
		return searchInput.value;
	}

	_tokenPromise() {
		return this.isDemo ? Promise.resolve('token') : D2L.LP.Web.Authentication.OAuth2.GetToken('users:profile:read');
	}

	_handleHeaderClicked() {
		this._sortedAscending = !this._sortedAscending;

		this._search(this._searchText, this._sortedAscending);
	}

	_handleHeaderKey(e) {

		if (e.keyCode === 32 /* spacebar */ || e.key === 'Enter') {
			e.preventDefault();
			this._handleHeaderClicked(e);
			return;
		}

		return false;
	}

	_onSearch(e) {
		this._search(e.detail.value, this._sortedAscending);
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
			].sort((a, b) => { return a.last < b.last && ascending || a.last > b.last && !ascending ? 1 : -1; });

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

/**
 * This components just sets bottom radius
 */
class ListItemButton extends ListItemButtonMixin(LitElement) {

	static get styles() {

		const styles = [ css`
			:host {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host(:last-child) d2l-list-item-generic-layout {
				border-bottom-left-radius: 8px;
				border-bottom-right-radius: 8px;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	render() {
		return this._renderListItem();
	}

}

customElements.define('d2l-insights-list-item-button', ListItemButton);
customElements.define('d2l-insights-user-selector', UserSelector);
