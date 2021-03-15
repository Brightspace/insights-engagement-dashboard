import { expect, fixture, html } from '@open-wc/testing';
import { FilterEventQueue, filterEventQueue } from '../../components/alert-data-update';
import { trySelectAll } from '../tools';

describe('d2l-insights-alert-data-updated', () => {

	let storeMatch = undefined;
	before(() => {
		storeMatch = window.matchMedia;
		window.matchMedia = () => ({ matches: false });
	});

	after(() => {
		window.matchMedia = storeMatch;
	});

	describe('alert managment', () => {
		it('should show one alert', async() => {
			const el = await fixture(html`<d2l-insights-alert-data-updated .dataEvents="${filterEventQueue}"></d2l-insights-alert-data-updated>`);
			filterEventQueue.add('Test Alert');
			const alerts = await trySelectAll(el.shadowRoot, '.d2l-insights-event-container > d2l-alert');
			expect(alerts.length).to.equal(1);
		});

		it('should show a max of 2 of the most recent alerts', async() => {
			const el = await fixture(html`<d2l-insights-alert-data-updated .dataEvents="${filterEventQueue}"></d2l-insights-alert-data-updated>`);
			filterEventQueue.add('Test Alert 1');
			await (new Promise(res => setTimeout(res, 300)));
			filterEventQueue.add('Test Alert 2');
			await (new Promise(res => setTimeout(res, 300)));
			filterEventQueue.add('Test Alert 3');
			await (new Promise(res => setTimeout(res, 300)));

			const alerts = await trySelectAll(el.shadowRoot, '.d2l-insights-event-container > d2l-alert');
			expect(alerts.length).to.equal(2);
			const alertMessages = Array.from(alerts).map(alert => alert.innerText.trim());
			expect(alertMessages).to.eql(['Test Alert 2', 'Test Alert 3']);
		});

		it('should show only the most recent alert when reduced motion is enabled', async() => {
			const limitedFEQ = new FilterEventQueue(1);

			const el = await fixture(html`<d2l-insights-alert-data-updated .dataEvents="${limitedFEQ}"></d2l-insights-alert-data-updated>`);
			limitedFEQ.add('Test Alert 1');
			await (new Promise(res => setTimeout(res, 300)));
			limitedFEQ.add('Test Alert 2');
			await (new Promise(res => setTimeout(res, 300)));
			limitedFEQ.add('Test Alert 3');
			await (new Promise(res => setTimeout(res, 300)));

			const alerts = await trySelectAll(el.shadowRoot, '.d2l-insights-event-container > d2l-alert');
			expect(alerts.length).to.equal(1);
			const alertMessages = Array.from(alerts).map(alert => alert.innerText.trim());
			expect(alertMessages).to.eql(['Test Alert 3']);
		});
	});
});
