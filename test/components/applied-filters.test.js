import '../../components/applied-filters';

import { expect, fixture, html } from '@open-wc/testing';
import { FilteredData } from '../../model/filteredData';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-applied-filters', () => {
	let data;

	beforeEach(() => {
		data = new FilteredData({});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-applied-filters');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(3500);
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should not render if there are no card filters', async function() {
			this.timeout(3000);
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			const appliedFilters = el.shadowRoot.querySelector('d2l-labs-applied-filters');
			expect(appliedFilters).to.be.null;
		});

		it('should not render if card filters are not applied', async function() {
			this.timeout(3000);
			data.filters = [
				{ id: 'filter-key-1', title: 'filter 1', isApplied: false }
			];
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			const appliedFilters = el.shadowRoot.querySelector('d2l-labs-applied-filters');
			expect(appliedFilters).to.be.null;
		});

		it('should render Clear All button and filter title for applied filters', async() => {
			data.filters = [
				{ id: 'filter-key-1', title: 'simpleFilter:searchLabel', isApplied: false },
				{ id: 'filter-key-2', title: 'dashboard:title', isApplied: true }
			];
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			const appliedFilters = el.shadowRoot.querySelector('.d2l-insights-tag-container');
			expect(appliedFilters).to.exist;

			const filters = appliedFilters.querySelectorAll('.d2l-insights-tag-item');
			expect(filters.length).to.equal(2);
			expect(filters[0].innerHTML).to.have.string('Engagement Dashboard');
			expect(filters[1].innerHTML).to.have.string('Clear all');
		});

		it('should clear all card filters if click on Clear All button', async() => {
			data.filters = [
				{ id: 'filter-key-1', title: 'filter 1', isApplied: true },
				{ id: 'filter-key-2', title: 'filter 2', isApplied: false }
			];
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			const appliedFilters = el.shadowRoot.querySelector('.d2l-insights-tag-container');
			expect(appliedFilters).to.exist;

			const filters = appliedFilters.querySelectorAll('.d2l-insights-tag-item');
			filters[1].querySelector('d2l-icon').click();
			expect(data.filters.filter(f => f.isApplied)).to.be.empty;
		});

		it('should clear a card filter if do a click on its clear button', async() => {
			data.filters = [
				{ id: 'filter-key-1', title: 'filter 1', isApplied: true },
				{ id: 'filter-key-2', title: 'filter 2', isApplied: true }
			];
			const el = await fixture(html`<d2l-insights-applied-filters .data="${data}"></d2l-insights-applied-filters>`);
			const appliedFilters = el.shadowRoot.querySelector('.d2l-insights-tag-container');
			expect(appliedFilters).to.exist;

			const filters = appliedFilters.querySelectorAll('.d2l-insights-tag-item');
			filters[0].querySelector('d2l-icon').click();
			const clearedFilters = data.filters.filter(f => !f.isApplied);

			expect(clearedFilters.length).to.equal(1);
			expect(clearedFilters[0].title).to.have.string('filter 1');
		});
	});
});
