import '../../components/inactive-courses-table';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-inactive-courses-table', () => {

	const userCourses = [
		[1, 100, 500, 1, 55, 1000, 1606506835387, 0, 0, 0],
		[2, 100, 500, 0, 60, 1100, null, 2, 4, 0]
	];

	const orgUnits = [
		[1, 'Course 1', 3, [3, 4], true],
		[2, 'Course 2', 3, [3, 10], false],
		[6, 'Course 3 has a surprisingly long name, but nonetheless this kind of thing is bound to happen sometimes and we do need to design for it. Is that not so?', 3, [7, 4], false],
		[8, 'ZCourse 4', 3, [5], false]
	];

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-inactive-courses-table');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-inactive-courses-table .userCourses="${userCourses}" .orgUnits="${orgUnits}"></d2l-insights-inactive-courses-table>`);
			await expect(el).to.be.accessible();
		});
	});

	// describe('render', () => {
	// 	it('should render as expected with inactive courses', async() => {
	// 		const el = await fixture(html`<d2l-insights-message-container .data="${dataWithTruncatedRecords}" .isNoDataReturned="${Boolean(0)}"></d2l-insights-message-container>`);
	// 		expect(el.shadowRoot.querySelector('span.d2l-insights-message-container-value').innerText).to.equal('There are too many results in your filters. Please refine your selection.');
	// 	});

	// 	it('should not render active courses', async() => {
	// 		const el = await fixture(html`<d2l-insights-message-container .data="${dataWithoutTruncatedRecords}" .isNoDataReturned=${Boolean(1)}></d2l-insights-message-container>`);
	// 		expect(el.shadowRoot.querySelector('.d2l-insights-message-container-value').innerText).to.equal('There are no results available that match your filters.');
	// 	});
	// });
});
