import '../../components/content-views-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('content-views-card', () => {
	const data = {};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-content-views-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-content-views-card .data="${data}"></d2l-insights-content-views-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render Content view over time chart', async() => {
			const el = await fixture(html`<d2l-insights-content-views-card .data="${data}"></d2l-insights-content-views-card>`);
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-content-views-title'));
			expect(title[0].innerText).to.equal('Content view over time');
		});
	});
});
