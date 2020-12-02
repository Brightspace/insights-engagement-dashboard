import '../../components/dashboard-settings';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { mock, restore } from '../../model/lms';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-dashboard-settings', () => {

	before(() => {
		mock();
	});
	after(() => {
		restore();
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-dashboard-settings');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-settings></d2l-insights-engagement-dashboard-settings>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('eventing', () => {
		it('should fire d2l-insights-settings-view-back when closed with cancel button', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-settings></d2l-insights-engagement-dashboard-settings>`);
			const button = el.shadowRoot.querySelector('.d2l-insights-settings-page-footer > d2l-button:last-child');
			const listener = oneEvent(el, 'd2l-insights-settings-view-back');

			button.click();

			await listener;
		});

		it('should fire d2l-insights-settings-view-back when closed with save button', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-settings></d2l-insights-engagement-dashboard-settings>`);
			const listener = oneEvent(el, 'd2l-insights-settings-view-back');

			const button = el.shadowRoot.querySelector('.d2l-insights-settings-page-footer > d2l-button:first-child');
			button.click();

			await listener;
		});
	});
});
