import '../../components/content-view-histogram';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const data = {
	withoutFilter: () => ({
		users: Array(6).fill(0)
	})
};

const makeDataFromUserViews = (views) => ({
	withoutFilter: () => ({
		users: views.map(view => [0, 0, 0, 0, 0, view])
	})
});

describe('content-view-histogram', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-content-view-histogram');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${data}"></d2l-labs-content-view-histogram>`);
			await expect(el).to.be.accessible();
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
});
