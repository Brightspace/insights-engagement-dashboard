import { getPerformanceLoadPageMeasures, TelemetryHelper } from '../../model/telemetry-helper';
import { expect } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';

describe('TelemetryHelper', () => {

	let fetchSandbox;

	beforeEach(() => {
		fetchSandbox = fetchMock.sandbox();
		fetchSandbox.mock('*', 200);
		window.d2lfetch = { fetch : fetchSandbox };
	});

	describe('logPerformanceEvent', () => {
		const measure = {};

		it('does nothing if endpoint is not provided', () => {
			const telemetryHelper = new TelemetryHelper(null);

			telemetryHelper.logPerformanceEvent({ id: 'ID', measures: [measure], action: 'Action' });

			expect(fetchSandbox.lastCall()).to.be.undefined;
		});

		it('does nothing if no measures provided', () => {
			const telemetryHelper = new TelemetryHelper('http://example.com/');

			telemetryHelper.logPerformanceEvent({ id: 'ID', measures: [], action: 'Action' });

			expect(fetchSandbox.lastCall()).to.be.undefined;
		});

		it('sends timings with a performance event', async() => {
			const telemetryHelper = new TelemetryHelper('http://example.com/');

			telemetryHelper.logPerformanceEvent({ id: 'ID', measures: [{ name: 'name1' }, { name: 'name2' }], action: 'Action' });

			const lastCall = fetchSandbox.lastCall();

			expect(lastCall[0]).to.equal('http://example.com/');

			const event = await lastCall.request.json();

			delete event.ts;
			delete event.name;
			delete event.EventBody.Object.Url;
			delete event.Date;

			expect(event).to.be.deep.equal({
				SourceId: 'insights',
				EventType: 'PerformanceEvent',
				EventBody: {
					EventTypeGuid: '02a00ca0-e67d-4a6c-908b-ee80b8a61eec',
					Action: 'Action',
					Object: {
						Id: 'ID',
						Type: 'engagement'
					},
					Custom: [{
						name: 'Source',
						value: 'engagement'
					}],
					UserTiming: [
						{ name: 'name1' },
						{ name: 'name2' }
					]
				}
			});
		});
	});

	describe('getPerformanceLoadPageMeasures', () => {
		it('returns performance entries for "measure" type', () => {
			performance.measure('measure 1');
			performance.measure('measure 2');
			performance.measure('measure 3');

			const measures = getPerformanceLoadPageMeasures();

			expect(measures.map(m => m.name).sort()).to.deep.equal(['measure 1', 'measure 2', 'measure 3']);
		});
	});
});
