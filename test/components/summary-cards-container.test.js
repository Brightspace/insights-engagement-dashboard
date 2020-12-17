import '../../components/summary-cards-container';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-summary-cards', () => {
	const data = {
		users: [],
		withoutFilter: () => ({ records: [], users: [] }),
		getFilter: () => ({ selectedCategories: new Set() })
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-summary-cards-container');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-summary-cards-container .data="${data}" overdue-card results-card system-access-card discussions-card></d2l-summary-cards-container>`);
			await expect(el).to.be.accessible();
		});
	});

});
