import '../../components/role-filter';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';

describe('d2l-insights-role-filter', () => {
	beforeEach(() => {
		// load in some mock data
		fetchMock.reset();
		const mockLmsResponseData = [
			{
				Identifier: '1',
				DisplayName: 'Role1',
				Code: null
			},
			{
				Identifier: '2',
				DisplayName: 'Role2',
				Code: null
			},
			{
				Identifier: '3',
				DisplayName: 'Role3',
				Code: null
			}
		];

		fetchMock.get(rolesEndpoint, mockLmsResponseData);
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-role-filter></d2l-insights-role-filter>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-role-filter');
		});
	});

	describe('render', () => {
		it('should render roles in order by displayName and id', async() => {
			fetchMock.reset();

			const mockLmsResponseData = [
				{
					Identifier: '4',
					DisplayName: 'ZZZRole',
					Code: null
				},
				{
					Identifier: '3',
					DisplayName: 'Role',
					Code: null
				},
				{
					Identifier: '2',
					DisplayName: 'Role',
					Code: null
				},
				{
					Identifier: '1',
					DisplayName: 'role', // localeCompare causes lowercase to come before uppercase
					Code: null
				}
			];

			fetchMock.get(rolesEndpoint, mockLmsResponseData);

			const expectedFilterData = [
				{ id: '1', name: 'role', displayName: 'role', selected: false },
				{ id: '2', name: 'Role', displayName: 'Role', selected: false },
				{ id: '3', name: 'Role', displayName: 'Role', selected: false },
				{ id: '4', name: 'ZZZRole', displayName: 'ZZZRole', selected: false }
			];
			const el = await fixture(html`<d2l-insights-role-filter></d2l-insights-role-filter>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run. Add 200 ms for Firefox on OSX
			await el.updateComplete;

			expect(el.shadowRoot.querySelector('d2l-insights-dropdown-filter').data).to.deep.equal(expectedFilterData);
		});
	});

	describe('eventing', () => {
		let el;

		beforeEach(async() => {
			el = await fixture(html`<d2l-insights-role-filter></d2l-insights-role-filter>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run. Add 200 ms for Firefox on OSX
			await el.updateComplete;
		});

		it('should fire a d2l-insights-role-filter-change event when an item is selected', async() => {
			const listener = oneEvent(el, 'd2l-insights-role-filter-change');

			const checkboxes = Array.from(
				el
					.shadowRoot.querySelector('d2l-insights-dropdown-filter')
					.shadowRoot.querySelectorAll('d2l-filter-dropdown-option')
			);

			checkboxes.find(checkbox => checkbox.value === '1').click();

			const event = await listener; // if no event is fired, this will time out after 2 seconds
			expect(event.type).to.equal('d2l-insights-role-filter-change');
			expect(event.target).to.equal(el);
		});
	});

	after(() => {
		fetchMock.reset();
	});
});
