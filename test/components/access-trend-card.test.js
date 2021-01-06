import '../../components/access-trend-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-access-trend-card', () => {
	const data = {
		_data: {
			serverData: {
				orgUnits: []
			}
		}
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-access-trend-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}"></d2l-insights-access-trend-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render Access Over Time chart', async() => {
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}"></d2l-insights-access-trend-card>`);
			const title = el.shadowRoot.querySelectorAll('div.d2l-insights-access-trend-title');
			expect(title[0].innerText).to.equal('Access Over Time');
		});
	});
});
