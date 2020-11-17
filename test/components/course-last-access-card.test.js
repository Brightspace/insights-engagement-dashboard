import { expect, fixture, html } from '@open-wc/testing';
import { CourseLastAccessFilter } from '../../components/course-last-access-card';
import { records } from '../model/mocks';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-course-last-access-card', () => {
	const filter = new CourseLastAccessFilter();
	const data = {
		getFilter: id => (id === filter.id ? filter : null),
		withoutFilter: id => (id === filter.id ? { records } : null)
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-course-last-access-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(4000);

			const el = await fixture(html`<d2l-insights-course-last-access-card .data="${data}"></d2l-insights-course-last-access-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render as expected', async() => {
			const el = await fixture(html`<d2l-insights-course-last-access-card .data="${data}"></d2l-insights-course-last-access-card>`);
			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-course-last-access-title'));
			expect(title[0].innerText).to.equal('Course Access');
			expect(el._preparedBarChartData.toString()).to.equal([39, 6, 0, 0, 1, 1, 1].toString());
			expect(el._colours).to.deep.equal(['var(--d2l-color-celestine)']);
		});

		it('should render selected colours', async() => {
			filter.selectCategory(1);
			filter.selectCategory(5);
			const el = await fixture(html`<d2l-insights-course-last-access-card .data="${data}"></d2l-insights-course-last-access-card>`);
			expect(el._colours).to.deep.equal([
				'var(--d2l-color-mica)',
				'var(--d2l-color-celestine)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-celestine)',
				'var(--d2l-color-mica)',
			]);
		});
	});

});
