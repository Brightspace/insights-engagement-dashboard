import '../../components/grades-trend-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('grades-trend-card', () => {
	const data = {};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-grades-trend-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-grades-trend-card .data="${data}"></d2l-insights-grades-trend-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render Grades Over Time chart', async() => {
			const el = await fixture(html`<d2l-insights-grades-trend-card .data="${data}"></d2l-insights-grades-trend-card>`);
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-grades-trend-title'));
			expect(title[0].innerText).to.equal('Grades Over Time');
		});
	});
});
