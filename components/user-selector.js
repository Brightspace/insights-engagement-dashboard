import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list.js';
import 'd2l-users/components/d2l-profile-image';

import { bodySmallStyles, bodyStandardStyles, heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { getVisibleUsers } from '../model/dataApiClient';
import { ifDefined } from 'lit-html/directives/if-defined';
import { ListItemButtonMixin } from '@brightspace-ui/core/components/list/list-item-button-mixin';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { nothing } from 'lit-html';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

const usersForSkeleton = Array.from(Array(10).keys())
	.map(i => ({
		Id: -i,
		FirstName: 'first',
		LastName: 'last',
		Username: 'login'
	}));

const SORT_COLUMN = {
	FIRST_NAME: 'FIRST NAME',
	LAST_NAME: 'LAST NAME'
};

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
					border-radius: 8px;
					border-right: 1px solid var(--d2l-color-mica);
				}

				.d2l-insights-user-selector-header {
					background-color: var(--d2l-color-regolith);
					border-radius: 8px;
					border-top: 1px solid var(--d2l-color-mica);
					color: var(--d2l-color-ferrite);
					height: 27px; /* min-height to be 48px including border */
					line-height: 1.4rem;
					padding: 10px 20px;
				}

				.d2l-insights-user-selector-header:focus {
					outline: solid 0;
					text-decoration: underline;
				}

				.d2l-insights-user-selector-header > span:focus {
					outline: solid 0;
					text-decoration: underline;
				}

				.d2l-insights-user-selector-header > span:hover {
					text-decoration: underline;
				}

				.d2l-insights-user-selector-header-sort-indicator {
					cursor: default;
					pointer-events: none;
				}

				span[role="button"] {
					cursor: pointer;
					user-select: none;
				}

				.d2l-insights-load-more {
					margin-top: 26px;
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
		this._sortColumn = SORT_COLUMN.LAST_NAME;
		this._sortedAscending = false;
		this._lastBookmark = undefined;
		this._lastSearch = undefined;
		this._canLoadMore = false;

		this.users = usersForSkeleton;
	}

	firstUpdated() {
		this._search(this._searchText);
	}

	render() {
		return html`
			<h2 class="d2l-heading-1">${this.localize('dashboard:userView:title')}</h2>

			<div class="d2l-insights-user-selector-search">
				<d2l-input-search
					label="${this.localize('treeSelector:searchLabel')}"
					placeholder="${this.localize('treeSelector:searchPlaceholder')}"
					@d2l-input-search-searched="${this._onSearch}"
				></d2l-input-search>
			</div>

			<div
				role="contentinfo"
				aria-label="${this.localize('usersTableExport:userListDescription')}"
				class="d2l-insights-user-selector-list">

				<div
					tabindex="0"
					class="d2l-insights-user-selector-header">
					${this._headerText()}
				</div>

				<d2l-list>
					${this.users.map(u => this.userListItem(u))}
				</d2l-list>
			</div>
			${this._renderLoadMore()}
		`;
	}

	userListItem(u) {
		return html`
			<d2l-insights-list-item-button
				key="${u.id}"
				@d2l-list-item-button-click="${this._onUserSelection}"
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
			</d2l-insights-list-item-button>
		`;
	}

	_headerText() {
		if (this._sortColumn === SORT_COLUMN.LAST_NAME) {
			return html`
				<span
					role="button"
					data-sort-column="${SORT_COLUMN.LAST_NAME}"
					tabindex="${this.skeleton ? -1 : 0}"
					@click="${this._handleHeaderClicked}"
					@keydown="${this._handleHeaderKey}"
				>${this.localize('usersTableExport:lastName')},</span>
				${this._sortedArrowIcon()}
				<span
					role="button"
					data-sort-column="${SORT_COLUMN.FIRST_NAME}"
					tabindex="${this.skeleton ? -1 : 0}"
					@click="${this._handleHeaderClicked}"
					@keydown="${this._handleHeaderKey}"
				>${this.localize('usersTableExport:FirstName')}</span>
			`;
		}

		return html`
			<span
				role="button"
				data-sort-column="${SORT_COLUMN.FIRST_NAME}"
				tabindex="${this.skeleton ? -1 : 0}"
				@click="${this._handleHeaderClicked}"
				@keydown="${this._handleHeaderKey}"
			>${this.localize('usersTableExport:FirstName')},</span>
			${this._sortedArrowIcon()}
			<span
				role="button"
				data-sort-column="${SORT_COLUMN.LAST_NAME}"
				tabindex="${this.skeleton ? -1 : 0}"
				@click="${this._handleHeaderClicked}"
				@keydown="${this._handleHeaderKey}"
			>${this.localize('usersTableExport:lastName')}</span>
		`;
	}

	_renderLoadMore() {
		return this._canLoadMore ?
			html`<d2l-button @click="${this._onLoadMore}" class="d2l-insights-load-more">${this.localize('treeSelector:loadMoreLabel')}</d2l-button>` :
			nothing;
	}

	_sortedArrowIcon() {
		const arrowDirection = this._sortedAscending ? 'arrow-toggle-up' : 'arrow-toggle-down';
		const ariaLabelText = arrowDirection === 'arrow-toggle-up' ? this.localize('table:sortedAscending') : this.localize('table:sortedDescending');

		return html`<d2l-icon role="img" aria-label="${ariaLabelText}" icon="tier1:${arrowDirection}" class="d2l-insights-user-selector-header-sort-indicator"></d2l-icon>`;
	}

	_onUserSelection(e) {
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

	_handleHeaderClicked(e) {
		const sortColumn = this._sortColumn;

		this._sortColumn = e.target.getAttribute('data-sort-column') || SORT_COLUMN.FIRST_NAME;
		if (sortColumn !== this._sortColumn) {
			this._sortedAscending = false;
		} else {
			this._sortedAscending = !this._sortedAscending;
		}

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
		this._search(e.detail.value);
	}

	_onLoadMore() {
		this._fromLoadMore = true;
		this._search(this._lastSearch, this._lastBookmark);
	}

	_search(searchText, bookmark) {
		const oldUsers = this.users;
		this.skeleton = true;
		this.users = usersForSkeleton;
		const searchOptions = {
			search: searchText,
			desc: !this._sortedAscending,
			sort: this._sortColumn === SORT_COLUMN.FIRST_NAME ? 'first' : 'last',
			bookmark,
		};

		if (!this.isDemo) {
			getVisibleUsers(searchOptions)
				.then(users => {
					if (bookmark) {
						this.users = oldUsers.concat(users.Items);
					} else {
						this.users = users.Items;
					}
					this.skeleton = false;
					this._lastBookmark = users.PagingInfo.Bookmark;
					this._lastSearch = searchText;
					this._canLoadMore = users.PagingInfo.HasMoreItems;
				});
		} else {
			setTimeout(() => {
				if (bookmark) {
					this.users = oldUsers.concat(
						[
							{ Id: 11053, FirstName: 'Beverly', LastName: 'Aadland', Username: 'baadland' },
							{ Id: 11054, FirstName: 'Maybe', LastName: 'Another', Username: 'manother' }
						]
					);
				} else {
					this.users = [
						{ Id: 11053, FirstName: 'Beverly', LastName: 'Aadland', Username: 'baadland' },
						{ Id: 11054, FirstName: 'Maybe', LastName: 'Another', Username: 'manother' }
					];
				}
				this.skeleton = false;
				this._lastBookmark = 'Maybe,Another,11054';
				this._lastSearch = searchText;
				this._canLoadMore = true;
			}, 10);
		}
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
