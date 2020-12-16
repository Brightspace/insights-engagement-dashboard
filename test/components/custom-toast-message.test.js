import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-custom-toast-message', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-custom-toast-message');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(4000);

			const el = await fixture(html`<d2l-insights-custom-toast-message></d2l-insights-custom-toast-message>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render the invalid system last accessed value toast message as expected', async() => {
			const el = await fixture(html`<d2l-insights-custom-toast-message></d2l-insights-custom-toast-message>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run
			expect(el.shadowRoot.querySelector('d2l-alert-toast').innerHTML).to.deep.equal('');
			el.systemLastAccessError();
			await new Promise(resolve => setTimeout(resolve, 200));
			expect(el.shadowRoot.querySelector('d2l-alert-toast').innerHTML).to.deep.equal('Your settings could not be saved, please try again. System Access thresholds need to be between 1 and 30.');
			expect(el.shadowRoot.querySelector('d2l-alert-toast').open).to.equal(true);
		});
	});

});
