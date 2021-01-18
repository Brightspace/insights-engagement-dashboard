import '../../components/access-trend-card';
import { disableUrlStateForTesting, enableUrlState } from '../../model/urlState';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { SelectedCourses } from '../../components/courses-legend';

describe('d2l-insights-access-trend-card', () => {
	const data = {
		_data: {
			serverData: {
				orgUnits: []
			}
		}
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-access-trend-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}"></d2l-insights-access-trend-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		const grey = 'var(--d2l-color-mica)';

		before(() => disableUrlStateForTesting());
		after(() => enableUrlState());

		it('should render Course Access Over Time chart', async() => {
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}"></d2l-insights-access-trend-card>`);
			const title = el.shadowRoot.querySelectorAll('div.d2l-insights-access-trend-title');
			await new Promise(resolve => setTimeout(resolve, 50));

			expect(title[0].innerText).to.equal('Course Access Over Time');

			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;
			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', '#D3E24A', '#D66DAC' ]);
		});

		it('should grey out all other courses when a first course is selected', async() => {
			const selectedCourses = new SelectedCourses();
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}" .selectedCourses="${selectedCourses}"></d2l-insights-access-trend-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));

			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;

			el._toggleFilterEventHandler(series[0]);
			await el.updateComplete;

			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', grey, grey ]);
		});

		it('should toggle color for any other course if there is one selected course', async() => {
			const selectedCourses = new SelectedCourses();
			const el = await fixture(html`<d2l-insights-access-trend-card .data="${data}" .selectedCourses="${selectedCourses}"></d2l-insights-access-trend-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));
			const series = el.shadowRoot.querySelector('d2l-labs-chart').chart.series;

			el._toggleFilterEventHandler(series[0]);
			el._toggleFilterEventHandler(series[1]);
			await el.updateComplete;

			const colors = series.map(series => series.color);
			expect(colors).to.eql([ '#4885DC', '#D3E24A', grey ]);
		});
	});
});
