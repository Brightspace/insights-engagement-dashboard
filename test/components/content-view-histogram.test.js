import { expect, fixture, html } from '@open-wc/testing';
import { ContentViewHistogramFilter } from '../../components/content-view-histogram';
import en from '../../locales/en.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
const filter = new ContentViewHistogramFilter();

const mapFromViews = (views) => {
	const map = new Map();
	views.forEach((v, i) => map.set(i, [i, 0, 0, 0, 0, v]));
	return map;
};

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

const records = [
	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const makeDataFromUserViews = (views) => {
	const data = {
		userDictionary: mapFromViews(views),
		userEnrollmentDictionary: mapFromViews(views),
		records: [...records],
		getFilter: id => (id === filter.id ? filter : null),
		withoutFilter: id => (id === filter.id ? { users: views.map((view, i) => [i, 0, 0, 0, 0, view]) } : null)
	};
	filter._data = data;
	return data;
};

describe('content-view-histogram', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-content-view-histogram');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;
			filter._data = localData;
			await expect(el).to.be.accessible();
		});
	});

	describe('filter', () => {
		it('should reset filter when all toggled', async() => {
			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;
			filter._data = localData;
			filter.bins;
			filter.selectedCategories.clear();

			filter.toggleCategory(0);
			filter.toggleCategory(1);
			filter.toggleCategory(2);
			filter.toggleCategory(3);
			filter.toggleCategory(4);
			filter.toggleCategory(5);

			expect([...filter.selectedCategories]).to.eql([]);
		});

		it('should filter results based on bin', async() => {
			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;
			filter._data = localData;
			filter.bins;
			filter.selectedCategories.clear();

			filter.toggleCategory(1);
			// select bin 1 (data in range 30-40)
			const results = localData.records.filter(r => filter.filter(r, localData.userDictionary));
			// userID 4 has value 35, expect to be the only result
			expect(results).to.eql([[0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
		});

		it('should change bar color during filtering', async() => {
			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;
			filter._data = localData;
			filter.bins;
			filter.selectedCategories.clear();

			filter.selectedCategories.add(0);
			filter.selectedCategories.add(1);
			expect(el.colors).to.eql([
				'var(--d2l-color-celestine)',
				'var(--d2l-color-celestine)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)',
				'var(--d2l-color-mica)']);
		});
	});

	describe('binning', () => {
		it('should bin data in the range 0-50', async() => {
			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[50, 40],
				[40, 30],
				[30, 20],
				[20, 10],
				[10, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should create 0-50 bins for no data', async() => {
			const localData = makeDataFromUserViews([]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[50, 40],
				[40, 30],
				[30, 20],
				[20, 10],
				[10, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should bin data in the range 0-100', async() => {
			const localData = makeDataFromUserViews([0, 10, 30, 50, 70, 90]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[100, 80],
				[80, 60],
				[60, 40],
				[40, 20],
				[20, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should bin data in the range 0-200', async() => {
			const localData = makeDataFromUserViews([0, 30, 70, 110, 150, 190]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[200, 160],
				[160, 120],
				[120, 80],
				[80, 40],
				[40, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should bin data in the range 0-500', async() => {
			const localData = makeDataFromUserViews([0, 50, 150, 250, 350, 450]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[500, 400],
				[400, 300],
				[300, 200],
				[200, 100],
				[100, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should bin data in the range 0-1000', async() => {
			const localData = makeDataFromUserViews([0, 150, 350, 550, 750, 950]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[1000, 800],
				[800, 600],
				[600, 400],
				[400, 200],
				[200, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should create extra bin for data > 1000', async() => {
			const localData = makeDataFromUserViews([0, 150, 350, 550, 750, 1100]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[Number.POSITIVE_INFINITY, 1000],
				[1000, 800],
				[800, 600],
				[600, 400],
				[400, 200],
				[200, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});

		it('should capture outliers', async() => {
			const localData = makeDataFromUserViews([0, 10, 20, 30, 40, 50, 200]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);

			const expectedBins = [
				[Number.POSITIVE_INFINITY, 50],
				[50, 40],
				[40, 30],
				[30, 20],
				[20, 10],
				[10, 0],
			];

			await expect(el.bins).to.eql(expectedBins);
		});
	});

	describe('axe descrptions', () => {

		it('should create an axe description', async() => {

			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;

			filter.selectedCategories.clear();
			filter.toggleCategory(0);
			const description = filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Content View in these categories  41 to 50');
		});

		it('should merge categories in axe description', async() => {

			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;

			filter.selectedCategories.clear();
			filter.toggleCategory(0);
			filter.toggleCategory(1);

			const description = el.filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Content View in these categories  31 to 50');
		});

		it('should seperate skipped categories in axe description and 0 read on its own', async() => {

			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 45]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;

			filter.selectedCategories.clear();
			filter.toggleCategory(5);
			filter.toggleCategory(3);

			const description = el.filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Content View in these categories  0, 11 to 20');
		});

		it('should say greater than for outlier bin', async() => {

			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 200]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;

			filter.selectedCategories.clear();
			filter.toggleCategory(0);

			const description = el.filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Content View in these categories  greater than 50');
		});

		it('should group greater than for outlier bin and smaller bin', async() => {

			const localData = makeDataFromUserViews([0, 5, 15, 25, 35, 200]);
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${localData}"></d2l-labs-content-view-histogram>`);
			const filter = el.filter;

			filter.selectedCategories.clear();
			filter.toggleCategory(0);
			filter.toggleCategory(1);

			const description = el.filter.axeDescription(localizer, 'alert:axeDescriptionRange');

			expect(description).to.equal('Viewing learners with Content View in these categories  greater than 40');
		});
	});
});
