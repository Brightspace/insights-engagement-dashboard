import '../../components/user-selector';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-user-selector', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-user-selector');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// give it a second to make sure users load in
			await new Promise(resolve => setTimeout(resolve, 200));
			await el.updateComplete;
			await expect(el).to.be.accessible();
		});
	});
});
