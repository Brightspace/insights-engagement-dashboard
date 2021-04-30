import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { expect, fixture, html } from '@open-wc/testing';
import { CourseLastAccessFilter } from '../../components/course-last-access-card';
import en from '../../locales/en';
import { records } from '../model/mocks';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const localizer = (term, options) => {
	let result = en[term];
	if (!result) return '';
	if (options) {
		let resultParts = result.split('{');
		resultParts = resultParts.map(part => part.split('}'));
		resultParts.forEach((part, i) => {
			if (part.length === 1) {
				resultParts[i] = part[0];
				return;
			} else {
				const key = part[0];
				term = options[key];
				part[0] = term;
				resultParts[i] = part.join('');
			}
		});
		console.log('after', resultParts);
		result = resultParts.join('');
	}
	return result;
};

describe('d2l-insights-course-last-access-card', () => {
	before(() => disableUrlStateForTesting());
	after(() => enableUrlState());
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

	describe('filter', () => {
		it('should reset if all categories are selected', () => {
			const filter = new CourseLastAccessFilter();
			filter.toggleCategory(0);
			filter.toggleCategory(1);
			filter.toggleCategory(2);
			filter.toggleCategory(3);
			filter.toggleCategory(4);
			filter.toggleCategory(5);
			filter.toggleCategory(6);
			expect([...filter.selectedCategories]).to.eql([]);
		});
	});

	describe('urlState', () => {

		const key = new CourseLastAccessFilter().persistenceKey;
		before(() => enableUrlState());
		after(() => disableUrlStateForTesting());

		it('should load the default value and then save to the url', () => {
			// set the filter to active
			setStateForTesting(key, '1');

			// check that the filter loads the url state
			const filter = new CourseLastAccessFilter();
			expect(filter.isApplied).to.be.true;

			filter.isApplied = false;

			// check that the change state was saved
			const params = new URLSearchParams(window.location.search);
			const state = params.get(filter.persistenceKey);
			expect(state).to.equal(null);
		});
	});

	describe('axe descrptions', () => {

		before(() => disableUrlStateForTesting());
		after(() => enableUrlState());

		it('should create an axe description', async() => {
			setStateForTesting('caf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(0);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Course Access in these categories  Never');
		});

		it('should merge categories in axe description', async() => {
			setStateForTesting('caf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(5);
			filter.toggleCategory(4);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Course Access in these categories  1 to 5');
		});

		it('should seperate skipped categories in axe description', async() => {
			setStateForTesting('caf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(5);
			filter.toggleCategory(3);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Course Access in these categories  1 to 3, 5 to 7');
		});
	});

});
