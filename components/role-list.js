import './dropdown-filter';
import '@brightspace-ui/core/components/inputs/input-checkbox';

import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { fetchRoles as fetchDemoRoles } from '../model/fake-dataApiClient';
import { fetchRoles } from '../model/dataApiClient';
import { heading3Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { nothing } from 'lit-html';
import shadowHash from '../model/shadowHash';

/**
 * @property {Number[]} includeRoles - user selected roles from preferences
 * @fires d2l-insights-role-list-change
 */
class RoleList extends Localizer(LitElement) {
	static get styles() {
		return [heading3Styles, css`
			:host {
				display: flex;
				flex-direction: column;
			}

			:host([hidden]) {
				display: none;
			}

			h3.d2l-heading-3 {
				margin: 0;
				width: 130px;
			}

			span {
				margin-bottom: 24px;
				margin-top: 6px;
			}

			d2l-input-checkbox {
				flex: 1 1 40%;
				margin-left: 24px;
				min-width: 260px;
			}

			.d2l-insights-role-list-small-list > d2l-input-checkbox {
				flex: 1 1 50%;
			}

			.d2l-insights-role-list-list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				max-width: 100vw;
				min-height: 50px;
			}

			.d2l-insights-spacer {
				margin-bottom: 10px;
			}

			.d2l-insights-invalid {
				background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBoMjJ2MjJIMHoiLz4KICAgIDxwYXRoIGQ9Ik0xOC44NjQgMTYuNDdMMTIuNjIzIDMuOTg5YTEuNzgzIDEuNzgzIDAgMDAtMy4xOTIgMEwzLjE4OSAxNi40N2ExLjc2MSAxLjc2MSAwIDAwLjA4IDEuNzNjLjMyNS41MjUuODk4Ljc5OCAxLjUxNi43OTloMTIuNDgzYy42MTggMCAxLjE5Mi0uMjczIDEuNTE2LS44LjIzNy0uMzM1LjI2NS0xLjM3LjA4LTEuNzN6IiBmaWxsPSIjQ0QyMDI2IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDxwYXRoIGQ9Ik0xMS4wMjcgMTcuMjY0YTEuMzM3IDEuMzM3IDAgMTEwLTIuNjc1IDEuMzM3IDEuMzM3IDAgMDEwIDIuNjc1ek0xMS45IDEyLjk4YS44OTIuODkyIDAgMDEtMS43NDcgMEw5LjI3IDguNTJhLjg5Mi44OTIgMCAwMS44NzQtMS4wNjRoMS43NjhhLjg5Mi44OTIgMCAwMS44NzQgMS4wNjVsLS44ODYgNC40NTh6IiBmaWxsPSIjRkZGIi8+CiAgPC9nPgo8L3N2Zz4K);
				display: block;
				float: right;
				height: 23px;
				margin-top: 3px;
				width: 23px;
			}

			@media only screen and (max-width: 615px) {
				h3.d2l-heading-3 {
					width: 104px;
				}

				.d2l-insights-invalid {
					background-size: contain;
					float: right;
					height: 20px;
					margin-top: 0;
					width: 20px;
				}
			}

		`];
	}

	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			includeRoles: { type: Array, attribute: false },
			_filterData: { type: Array, attribute: false },
			isError: { type: Boolean, attribute: 'error' }
		};
	}

	constructor() {
		super();

		this.isDemo = false;
		this.includeRoles = [];
		/** @type {{id: string, displayName: string}[]} */
		this._filterData = [];
		this.updates = 0;
	}

	async firstUpdated() {
		const dataProvider = this.isDemo ? fetchDemoRoles : fetchRoles;
		const data = await dataProvider();
		this._setRoleData(data);
		shadowHash.register(this.shadowRoot.querySelector('#role-list-items'));
		if (this.includeRoles.length === 0) {
			this.isError = true;
		}
	}

	async updated() {
		const checkboxes = Array.from(this.shadowRoot.querySelectorAll('d2l-input-checkbox'));
		if (checkboxes.length === 0) return;
		// checkbox components may not have rendered yet.
		await Promise.all(checkboxes.map(check => check.updateComplete));
		if (this.isError) {
			checkboxes.forEach(check => check.shadowRoot.querySelector('input[type="checkbox"]').style = 'border-color: var(--d2l-color-cinnabar)');
		} else {
			checkboxes.forEach(check => check.shadowRoot.querySelector('input[type="checkbox"]').style = '');
		}
	}

	get _selected() {
		return Array.from(this.shadowRoot.querySelectorAll('d2l-input-checkbox'))
			.filter(checkbox => checkbox.checked)
			.map(checkbox => checkbox.value)
			.map(roleId => Number(roleId));
	}

	_setRoleData(roleData) {
		roleData.sort((role1, role2) => {
			// NB: it seems that localeCompare is pretty slow, but that's ok in this case, since there
			// shouldn't usually be many roles, and loading/sorting roles is only expected to happen infrequently.
			return role1.DisplayName.localeCompare(role2.DisplayName)
				|| role1.Identifier.localeCompare(role2.Identifier);
		});

		this._setFilterData(roleData);
	}

	_setFilterData(roleData) {
		const selected = new Set(this.includeRoles.map(String));
		this._filterData = roleData.map(obj => {
			return { id: obj.Identifier, displayName: obj.DisplayName, selected: selected.has(obj.Identifier) };
		});
	}

	_handleCheckAll() {
		this.shadowRoot.querySelectorAll('d2l-input-checkbox')
			.forEach(checkbox => checkbox.checked = true);

		this._handleSelectionChange();
	}

	_handleCheckNone() {
		this.shadowRoot.querySelectorAll('d2l-input-checkbox')
			.forEach(checkbox => checkbox.checked = false);
		this._handleSelectionChange();
	}

	get _errorIcon() {
		return this.isError ? html`<div class="d2l-insights-invalid"></div>&nbsp;` : nothing;
	}

	_renderHeader() {
		const tooltip = this.isError ?
			html`<d2l-tooltip
					state="error"
					for="role-list-items"
					align="start">
					${this.localize('settings:roleListError')}
				</d2l-tooltip>` :
			nothing;

		return html`
			<h3 id="role-list-items" class="d2l-heading-3">${this.localize('settings:roleListTitle')}${this._errorIcon}</h3>
			${ tooltip }
		`;
	}

	render() {
		const filterData = this._filterData;
		const styles = {
			'd2l-insights-role-list-list': true,
			// shows only one column if there are less than 13 roles in the list
			'd2l-insights-role-list-small-list': filterData.length < 13
		};

		return html`
			${this._renderHeader()}
			<span>${this.localize('settings:roleListDescription')}</span>
			<div class="${classMap(styles)}">
				${filterData.map(item => html`<d2l-input-checkbox value="${item.id}" @change="${this._handleSelectionChange}" ?checked="${item.selected}" >${item.displayName}</d2l-input-checkbox>`)}
			</div>
			<div class="d2l-insights-spacer">
				<d2l-button @click=${this._handleCheckAll}>${this.localize('settings:selectAll')}</d2l-button>
				<d2l-button @click=${this._handleCheckNone}>${this.localize('settings:deselectAll')}</d2l-button>
			</div>
		`;
	}

	_handleSelectionChange() {
		// prevent mobx-lit commit from over-writing the array by reusing the proxy
		this.includeRoles.length = 0;
		this._selected.forEach(selected => this.includeRoles.push(selected));
		if (this.includeRoles.length === 0) {
			this.isError = true;
		} else {
			this.isError = false;
		}
		/**
		 * @event d2l-insights-role-list-change
		 */
		this.dispatchEvent(new Event('d2l-insights-role-list-change'));
	}
}
customElements.define('d2l-insights-role-list', RoleList);
