import '../../components/grades-trend-card';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { SelectedCourses } from '../../components/courses-legend';

const grey  = 'var(--d2l-color-mica)';

describe('grades-trend-card', () => {
	const data = {
		_data: {
			serverData: {
				orgUnits: []
			}
		}
	};
	const userData = {
		courseGrades: [
			{
				courseId: 1,
				gradesData: [{ date: 0, grade: 0.5 }]
			},
			{
				courseId: 2,
				gradesData: [{ date: 0, grade: 0.5 }]
			},
			{
				courseId: 3,
				gradesData: [{ date: 0, grade: 0.5 }]
			}
		]
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-grades-trend-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-grades-trend-card .userData="${userData}" .data="${data}"></d2l-insights-grades-trend-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render Grades Over Time chart', async() => {
			const el = await fixture(html`<d2l-insights-grades-trend-card .userData="${userData}" .data="${data}"></d2l-insights-grades-trend-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-grades-trend-title'));
			expect(title[0].innerText).to.equal('Grades Over Time');

			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;
			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', '#D3E24A', '#D66DAC' ]);
		});
	});

	it('should grey out all other courses when a first course is selected', async() => {
		const selectedCourses = new SelectedCourses();
		const el = await fixture(html`<d2l-insights-grades-trend-card .userData="${userData}" .data="${data}" .selectedCourses="${selectedCourses}"></d2l-insights-grades-trend-card>`);
		await new Promise(resolve => setTimeout(resolve, 50));
		const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;

		el._toggleFilterEventHandler(series[0]);
		await el.updateComplete;

		expect(el._series[0].color).to.eql('#4885DC');
		expect(el._series[1].color).to.eql(grey);
		expect(el._series[2].color).to.eql(grey);
	});
});
