import '../../components/role-list';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const rolesEndpoint = '/d2l/api/ap/unstable/insights/data/roles';

describe('d2l-insights-role-list', () => {
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
			const el = await fixture(html`<d2l-insights-role-list></d2l-insights-role-list>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-role-list');
		});
	});

	describe('render', () => {
		it('should render ordered roles with proper selction marks', async() => {
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
				{ id: '1', name: 'role', selected: false },
				{ id: '2', name: 'Role', selected: true },
				{ id: '3', name: 'Role', selected: true },
				{ id: '4', name: 'ZZZRole', selected: false }
			];
			const el = await fixture(html`<d2l-insights-role-list .includeRoles="${[2, 3]}"></d2l-insights-role-list>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run. Add 200 ms for Firefox on OSX
			await el.updateComplete;

			const actual = Array.from(el.shadowRoot.querySelectorAll('d2l-input-checkbox'))
				.map(elem => ({ id: elem.value, name: elem.innerText, selected: elem.checked }));

			expect(actual).to.deep.equal(expectedFilterData);
		});
	});

	describe('interactions/eventing', () => {
		let el;

		beforeEach(async() => {
			el = await fixture(html`<d2l-insights-role-list .includeRoles="${[3]}"></d2l-insights-role-list>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run. Add 200 ms for Firefox on OSX
			await el.updateComplete;
		});

		it('should fire a d2l-insights-role-list-change event', async() => {
			const listener = oneEvent(el, 'd2l-insights-role-list-change');

			const checkboxes = Array.from(el.shadowRoot.querySelectorAll('d2l-input-checkbox'));

			checkboxes.find(checkbox => checkbox.value === '1').simulateClick();

			const event = await listener; // if no event is fired, this will time out after 2 seconds
			expect(event.type).to.equal('d2l-insights-role-list-change');
			expect(event.target).to.equal(el);
		});

		it('should toggle item selection', async() => {
			const checkboxes = Array.from(el.shadowRoot.querySelectorAll('d2l-input-checkbox'));

			checkboxes.find(checkbox => checkbox.value === '2').simulateClick();
			checkboxes.find(checkbox => checkbox.value === '3').simulateClick();

			expect(el.includeRoles).to.deep.equal([2]);
		});
	});

	after(() => {
		fetchMock.reset();
	});
});
