import '../../components/active-courses-table';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-active-courses-table', () => {

	const userCourses = [
		[1, 100, 500, 1, 55, 1000, 1606506835387, 0, 0, 0],
		[2, 100, 500, 0, 60, 1100, null, 2, 4, 0]
	];

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-active-courses-table');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-active-courses-table .data=${userCourses}></d2l-insights-active-courses-table>`);
			await expect(el).to.be.accessible();
		});
	});
});
