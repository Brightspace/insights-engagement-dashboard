import './dropdown-filter';

import { html, LitElement } from 'lit-element';
import { fetchRoles as fetchDemoRoles } from '../model/fake-lms';
import { fetchRoles } from '../model/lms';
import { Localizer } from '../locales/localizer';

/**
 * @fires d2l-insights-role-filter-change
 * @fires d2l-insights-role-filter-close
 */
class RoleFilter extends Localizer(LitElement) {
	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			selected: { type: Array, attribute: false },
			_filterData: { type: Array, attribute: false }
		};
	}

	constructor() {
		super();

		this.isDemo = false;
		this.selected = [];
		/** @type {{id: string, displayName: string}[]} */
		this._filterData = [];
	}

	async firstUpdated() {
		const dataProvider = this.isDemo ? fetchDemoRoles : fetchRoles;
		const data = await dataProvider();
		this._setRoleData(data);
	}

	get _selected() {
		return this.shadowRoot
			.querySelector('d2l-insights-dropdown-filter')
			.selected
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
		this._filterData = roleData.map(obj => {
			return { id: obj.Identifier, name: obj.DisplayName, displayName: obj.DisplayName };
		});
	}

	render() {
		const selected = new Set(this.selected.map(String));
		const filterData = this._filterData.map(x => Object.assign(x, {
			selected: selected.has(x.id)
		}));
		return html`
			<d2l-insights-dropdown-filter
				name="${this.localize('components.insights-role-filter.name')}"
				.data="${filterData}"

				@d2l-insights-dropdown-filter-selected="${this._updateFilterSelections}"
				@d2l-insights-dropdown-filter-selection-cleared="${this._updateFilterSelections}"
				@d2l-insights-dropdown-filter-close="${this._filterClose}"
			>
			</d2l-insights-dropdown-filter>
		`;
	}

	_updateFilterSelections() {
		this.selected = this._selected;
		/**
		 * @event d2l-insights-role-filter-change
		 */
		this.dispatchEvent(new Event('d2l-insights-role-filter-change'));
	}

	_filterClose() {
		/**
		 * @event d2l-insights-role-filter-close
		 */
		this.dispatchEvent(new Event('d2l-insights-role-filter-close'));
	}

}
customElements.define('d2l-insights-role-filter', RoleFilter);
