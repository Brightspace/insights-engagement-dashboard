import '../../components/engagement-dashboard-errors';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-dashboard-errors', () => {

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

	const dataWithRoleError = {
		_data: {
			serverData: {
				selectedRolesIds: null
			}
		}
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-dashboard-errors');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`
				<d2l-insights-engagement-dashboard-errors .data="${dataWithTruncatedRecords}" .isNoDataReturned="${Boolean(0)}"></d2l-insights-engagement-dashboard-errors>
			`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render as expected with truncated records', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithTruncatedRecords}" ?no-results="${Boolean(0)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer.type).to.equal('default');
			expect(innerMessageContainer.text).to.equal('There are too many results in your filters. Please refine your selection.');
		});

		it('should not render without truncated records', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithoutTruncatedRecords}" ?no-results="${Boolean(1)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer.type).to.equal('button');
			expect(innerMessageContainer.text).to.equal('There are no results available that match your filters.');
			expect(innerMessageContainer.buttonText).to.equal('Undo Last Action');
		});

		it('should render as expected with contact support message', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithQueryError}" ?no-results="${Boolean(0)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer.type).to.equal('link');
			expect(innerMessageContainer.text).to.equal('Unable to load your results. If this problem persists, please ');
			expect(innerMessageContainer.linkText).to.equal('contact D2L Support.');
		});

		it('should render nothing if there are no issues', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithoutTruncatedRecords}" ?no-results="${Boolean(0)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer).to.be.null;
		});

		it('should render as expected with go to setting message', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithRoleError}" ?no-roles="${Boolean(1)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer.type).to.equal('button');
			expect(innerMessageContainer.text).to.equal("We couldn't find any data because there are no selected user roles.");
			expect(innerMessageContainer.buttonText).to.equal('Go To Settings');
		});

		it('should send the settings event when the button is pressed', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard-errors .data="${dataWithRoleError}" ?no-roles="${Boolean(1)}"></d2l-insights-engagement-dashboard-errors>`);
			const innerMessageContainer = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(innerMessageContainer.type).to.equal('button');
			expect(innerMessageContainer.text).to.equal("We couldn't find any data because there are no selected user roles.");
			expect(innerMessageContainer.buttonText).to.equal('Go To Settings');

			const listener = oneEvent(el, 'd2l-insights-go-to-settings');
			el.shadowRoot.querySelector('d2l-insights-message-container').shadowRoot.querySelector('d2l-button').click();
			await listener;
		});
	});
});
