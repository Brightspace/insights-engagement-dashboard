import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { SelectedCourses } from '../../components/courses-legend';

const userRecordsMap = new Map();
userRecordsMap.set(200, [[6606, 200, 300, 0, 33, 2500, 10293819283, 0, 0, 0]]);

const data = {
	records: [[6606, 200, 300, 0, 33, 2500, 10293819283, 0, 0, 0]],
	recordsByUser: userRecordsMap,
	_data: {
		serverData: {
			orgUnits: [
				[6606, 'Course 1', 3, [5], true],
			]
		}
	}
};

const filter = new SelectedCourses();

describe('d2l-insights-course-legend', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-courses-legend');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(3500);

			const el = await fixture(html`
			<d2l-insights-courses-legend
				.selectedCourses="${filter}"
				.user="${{ userId: 200 }}"
				.data="${data}">
			</d2l-insights-courses-legend>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('filter',  () => {
		it('should toggle filters on click', async() => {

			const el = await fixture(html`
				<d2l-insights-courses-legend
					.selectedCourses="${filter}"
					.user="${{ userId: 200 }}"
					.data="${data}">
				</d2l-insights-courses-legend>`);
			await new Promise(res => setTimeout(res, 500));

			expect([...el.selectedCourses.selected]).to.eql([]);
			const legendItems = el.shadowRoot.querySelectorAll('.d2l-insights-user-course-legend-item');
			console.log([...legendItems]);
			legendItems[0].click();

			expect([...el.selectedCourses.selected]).to.eql([6606]);
		});
	});
});
