import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { expect, fixture, html } from '@open-wc/testing';
import { OverdueAssignmentsFilter } from '../../components/overdue-assignments-card';
import { records } from '../model/mocks';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-overdue-assignments-card', () => {

	before(() => disableUrlStateForTesting());
	after(() => enableUrlState());

	const filter = new OverdueAssignmentsFilter();
	const data = {
		getFilter: id => (id === filter.id ? filter : null),
		withoutFilter: id => (id === filter.id ? { records } : null)
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-overdue-assignments-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-overdue-assignments-card .data="${data}"></d2l-insights-overdue-assignments-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render the proper number of users with overdue assignments', async() => {
			const el = await fixture(html`<d2l-insights-overdue-assignments-card .data="${data}"></d2l-insights-overdue-assignments-card>`);
			expect(el.shadowRoot.querySelector('d2l-labs-summary-card').value).to.deep.equal('2');
			expect(el.shadowRoot.querySelector('d2l-labs-summary-card').title).to.deep.equal('Overdue Assignments');
			expect(el.shadowRoot.querySelector('d2l-labs-summary-card').message).to.deep.equal('Users currently have one or more overdue assignments.');
			expect(el.shadowRoot.querySelector('d2l-labs-summary-card').isValueClickable).to.deep.equal(true);
		});
	});

	describe('urlState', () => {

		const key = new OverdueAssignmentsFilter().persistenceKey;
		before(() => enableUrlState());
		after(() => disableUrlStateForTesting());

		it('should load the default value and then save to the url', () => {
			// set the filter to active
			setStateForTesting(key, '1');

			// check that the filter loads the url state
			const filter = new OverdueAssignmentsFilter();
			expect(filter.isApplied).to.be.true;

			filter.isApplied = false;

			// check that the change state was saved
			const params = new URLSearchParams(window.location.search);
			const state = params.get(filter.persistenceKey);
			expect(state).to.equal(null);
		});
	});
});
