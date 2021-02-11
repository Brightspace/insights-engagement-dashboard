import '../../components/content-views-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { SelectedCourses } from '../../components/courses-legend';

const grey  = 'var(--d2l-color-mica)';
const records = [[1, 200], [2, 200], [3, 200]];
const userRecordsMap = new Map();
userRecordsMap.set(200, records);

describe('content-views-card', () => {
	const data = {
		recordsByUser: userRecordsMap,
		_data: {
			serverData: {
				orgUnits: [],
				records: records
			}
		},
		orgUnitTree: {
			allSelectedCourses: []
		}
	};
	const userData = {
		contentViews: [{
			//test data
			orgUnitId: 1,
			data: [
				[Date.UTC(2020, 1, 1), 50],
				[Date.UTC(2020, 1, 7), 60],
				[Date.UTC(2020, 1, 14), 45],
				[Date.UTC(2020, 1, 21), 65],
				[Date.UTC(2020, 1, 28), 70],
				[Date.UTC(2020, 2, 4), 65]
			]
		}, {
			orgUnitId: 2,
			data: [
				[Date.UTC(2020, 1, 1), 30],
				[Date.UTC(2020, 1, 7), 50],
				[Date.UTC(2020, 1, 14), 35],
				[Date.UTC(2020, 1, 21), 50],
				[Date.UTC(2020, 1, 28), 65],
				[Date.UTC(2020, 2, 4), 40]
			]
		}, {
			orgUnitId: 3,
			data: [
				[Date.UTC(2020, 1, 1), 10],
				[Date.UTC(2020, 1, 7), 30],
				[Date.UTC(2020, 1, 14), 25],
				[Date.UTC(2020, 1, 21), 40],
				[Date.UTC(2020, 1, 28), 55],
				[Date.UTC(2020, 2, 4), 25]
			]
		}]
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-content-views-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-content-views-card
				.userData="${userData}"
				.data="${data}"
				.user="${{ userId: 200 }}"></d2l-insights-content-views-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render Content view over time chart', async() => {
			const el = await fixture(html`<d2l-insights-content-views-card
				.userData="${userData}"
				.data="${data}"
				.user="${{ userId: 200 }}"></d2l-insights-content-views-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-content-views-title'));
			expect(title[0].innerText).to.equal('Content Views Over Time');

			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;
			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', '#D3E24A', '#D66DAC' ]);
		});
	});

	it('should grey out all other courses when a first course is selected', async() => {
		const selectedCourses = new SelectedCourses();
		const el = await fixture(html`<d2l-insights-content-views-card
			.userData="${userData}"
			.data="${data}"
			.user="${{ userId: 200 }}"
			.selectedCourses="${selectedCourses}"></d2l-insights-content-views-card>`);
		await new Promise(resolve => setTimeout(resolve, 50));
		const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;

		el._toggleFilterEventHandler(series[0]);
		await el.updateComplete;

		expect(el._series[0].color).to.eql('#4885DC');
		expect(el._series[1].color).to.eql(grey);
		expect(el._series[2].color).to.eql(grey);
	});
});
