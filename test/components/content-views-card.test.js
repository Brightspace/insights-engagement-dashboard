import '../../components/content-views-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { SelectedCourses } from '../../components/courses-legend';

const grey  = 'var(--d2l-color-mica)';

describe('content-views-card', () => {
	const data = {
		_data: {
			serverData: {
				orgUnits: []
			}
		}
	};

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
			expect(title[0].innerText).to.equal('Content View Over Time');

			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;
			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', '#D3E24A', '#D66DAC' ]);
		});
	});

	it('should grey out all other courses when a first course is selected', async() => {
		const selectedCourses = new SelectedCourses();
		const el = await fixture(html`<d2l-insights-content-views-card .data="${data}" .selectedCourses="${selectedCourses}"></d2l-insights-content-views-card>`);
		const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;

		el._toggleFilterEventHandler(series[0]);
		await el.updateComplete;

		expect(el._series[0].color).to.eql('#4885DC');
		expect(el._series[1].color).to.eql(grey);
		expect(el._series[2].color).to.eql(grey);
	});
});
