import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-message-container', () => {

	const dataWithTruncatedRecords = {
		_data: {
			serverData : {
				isRecordsTruncated: true
			}
		},
		users: [
			[100, 'John', 'Lennon', 'jlennon',  1600295350000],
			[200, 'Paul', 'McCartney', 'pmccartney', null]
		]
	};

	const dataWithoutTruncatedRecords = {
		_data: {
			serverData : {
				isRecordsTruncated: false
			},
		},
		users: [],
	};

	const dataWithQueryError = {
		_data: {
			isQueryError: true
		}
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-message-container');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-message-container .data="${dataWithTruncatedRecords}" .isNoDataReturned="${Boolean(0)}"></d2l-insights-message-container>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render as expected with truncated records', async() => {
			const el = await fixture(html`<d2l-insights-message-container .data="${dataWithTruncatedRecords}" .isNoDataReturned="${Boolean(0)}"></d2l-insights-message-container>`);
			expect(el.shadowRoot.querySelector('span.d2l-insights-message-container-value').innerText).to.equal('There are too many results in your filters. Please refine your selection.');
		});

		it('should not render without truncated records', async() => {
			const el = await fixture(html`<d2l-insights-message-container .data="${dataWithoutTruncatedRecords}" .isNoDataReturned=${Boolean(1)}></d2l-insights-message-container>`);
			expect(el.shadowRoot.querySelector('.d2l-insights-message-container-value').innerText).to.equal('There are no results available that match your filters.');
		});

		it('should render as expected with contact support message', async() => {
			const el = await fixture(html`<d2l-insights-message-container .data="${dataWithQueryError}" .isNoDataReturned=${Boolean(0)}></d2l-insights-message-container>`);
			expect(el.shadowRoot.querySelector('.d2l-insights-message-container-value').innerText).to.equal('Unable to load your results. If this problem persists, please contact D2L Support.');
		});
	});
});
