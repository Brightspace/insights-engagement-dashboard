import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { CurrentFinalGradesFilter } from '../../components/current-final-grade-card';
import { records } from '../model/mocks';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const localizer = (term) => {
	if (term === 'alert:axeDescriptionRange') return 'Viewing learners with Current Grade in these categories ';
	if (term === 'alert:this-To-That') return 'to';
};

describe('d2l-insights-current-final-grade-card', () => {
	before(() => disableUrlStateForTesting());
	after(() => enableUrlState());
	const filter = new CurrentFinalGradesFilter();
	const data = {
		getFilter: id => (id === filter.id ? filter : null),
		withoutFilter: id => (id === filter.id ? { records } : null)
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-current-final-grade-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(3500);

			const el = await fixture(html`<d2l-insights-current-final-grade-card .data="${data}"></d2l-insights-current-final-grade-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render as expected', async() => {
			const el = await fixture(html`<d2l-insights-current-final-grade-card .data="${data}"></d2l-insights-current-final-grade-card>`);

			const filter = el.filter;
			filter.selectedCategories.clear();

			await new Promise(resolve => setTimeout(resolve, 200)); // allow fetch to run
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-current-final-grade-title'));
			expect(title[0].innerText).to.equal('Current Grade');
			const expected = [ 0, 0, 1, 2, 1, 2, 1, 2, 2, 2];
			expect(el._preparedHistogramData).to.deep.equal(expected);
			expect(el._colours).to.deep.equal(['var(--d2l-color-amethyst)']);
		});

		it('should colour selected bars', async() => {
			filter.selectedCategories.clear();
			filter.selectCategory(30);
			filter.selectCategory(50);
			const el = await fixture(html`<d2l-insights-current-final-grade-card .data="${data}"></d2l-insights-current-final-grade-card>`);
			expect(el._colours).to.deep.equal([
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-amethyst)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-amethyst)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)'
			]);
		});

		it('should exclude chart form tabindex when data is loading', async() => {
			const el = await fixture(html`<d2l-insights-current-final-grade-card .data="${data}" skeleton></d2l-insights-current-final-grade-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));
			const chart = el.shadowRoot.querySelector('d2l-labs-chart');
			const chartDiv = chart.shadowRoot.querySelector('#chart-container');
			expect(chartDiv.getAttribute('tabindex')).to.equal('-1');

			el.skeleton = false;
			await elementUpdated(el);
			expect(chartDiv.getAttribute('tabindex')).to.equal('0');
		});
	});

	describe('filter', () => {
		it('should not be applied if no categories are selected', () => {
			expect(new CurrentFinalGradesFilter().isApplied).to.be.false;
		});

		it('should be applied if categories are selected', () => {
			const filter = new CurrentFinalGradesFilter();
			filter.selectCategory('a');
			expect(filter.isApplied).to.be.true;
		});

		it('should clear', () => {
			const filter = new CurrentFinalGradesFilter();
			filter.selectCategory('a');
			filter.isApplied = false;
			expect(filter.isApplied).to.be.false;
		});

		it('should reset if all categories are selected', () => {
			const filter = new CurrentFinalGradesFilter();
			filter.toggleCategory(0);
			filter.toggleCategory(10);
			filter.toggleCategory(20);
			filter.toggleCategory(30);
			filter.toggleCategory(40);
			filter.toggleCategory(50);
			filter.toggleCategory(60);
			filter.toggleCategory(70);
			filter.toggleCategory(80);
			filter.toggleCategory(90);
			expect([...filter.selectedCategories]).to.eql([]);
		});

		[
			{ categories: [10], expected: [1] },
			{ categories: [10, 90], expected: [1, 3, 7] },
			{ categories: [20], expected: [5, 6] },
			{ categories: [0], expected: [4] },
			{ categories: [80], expected: [] },
			{ categories: [0, 20, 80, 90], expected: [3, 4, 5, 6, 7] }
		].forEach(params =>
			it(`should filter by categories [${params.categories}]`, () => {
				const records = [
					[1, null, null, null, 19],
					[2, null, null, null, null],
					[3, null, null, null, 100],
					[4, null, null, null, 0],
					[5, null, null, null, 20],
					[6, null, null, null, 21.345],
					[7, null, null, null, 90]
				];
				const filter = new CurrentFinalGradesFilter();
				params.categories.forEach(x => filter.selectCategory(x));
				const actual = records.filter(r => filter.filter(r)).map(x => x[0]);
				expect(actual).to.deep.equal(params.expected);
			})
		);

		describe('urlState', () => {

			const key = new CurrentFinalGradesFilter().persistenceKey;
			before(() => enableUrlState());
			after(() => disableUrlStateForTesting());

			it('should load the default value and then save to the url', () => {
				// set the filter to select categories
				setStateForTesting(key, '1,2,3');

				// check that the filter loads the url state
				const filter = new CurrentFinalGradesFilter();
				expect([...filter.selectedCategories]).to.eql([1, 2, 3]);

				filter.toggleCategory(2);
				filter.toggleCategory(3);
				filter.toggleCategory(4);
				filter.toggleCategory(5);

				// check that the change state was saved
				const params = new URLSearchParams(window.location.search);
				const state = params.get(filter.persistenceKey);
				expect(state).to.equal('1,4,5');
			});
		});
	});

	describe('axe descrptions', () => {

		before(() => disableUrlStateForTesting());
		after(() => enableUrlState());

		it('should create an axe description', async() => {
			setStateForTesting('cgf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(0);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Current Grade in these categories  0 to 10');
		});

		it('should merge categories in axe description', async() => {
			setStateForTesting('cgf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(20);
			filter.toggleCategory(30);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Current Grade in these categories  20 to 40');
		});

		it('should seperate skipped categories in axe description', async() => {
			setStateForTesting('cgf', '');

			filter.selectedCategories.clear();
			filter.toggleCategory(20);
			filter.toggleCategory(40);

			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Current Grade in these categories  20 to 30, 40 to 50');
		});
	});
});
