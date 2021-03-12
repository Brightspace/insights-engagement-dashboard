import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { autorun } from 'mobx';
import { records } from '../model/mocks';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { TimeInContentVsGradeFilter } from '../../components/time-in-content-vs-grade-card';

describe('TimeInContentVsGradeFilter', () => {

	before(() => disableUrlStateForTesting());
	after(() => enableUrlState());

	let sut;
	beforeEach(() => {
		sut = new TimeInContentVsGradeFilter({ records });
	});

	describe('avgGrade', () => {
		it('should calculate the average for all records in the (filtered) data', () => {
			expect(sut.avgGrade).to.equal(69);
		});
	});

	describe('avgTimeInContent', () => {
		it('should calculate the average for all records in the (filtered) data', () => {
			expect(sut.avgTimeInContent).to.equal(29);
		});
	});

	describe('calculateQuadrant', () => {
		[
			{ tic: 10, grade: 30, expected: 'leftBottom' },
			{ tic: 0, grade: 90, expected: 'leftTop' },
			{ tic: 10000, grade: 0, expected: 'rightBottom' },
			{ tic: 100, grade: 70, expected: 'rightTop' },
			{ tic: 29, grade: 69, expected: 'leftTop' },
			{ tic: 29, grade: 68, expected: 'rightBottom' },
			{ tic: 30, grade: 69, expected: 'rightBottom' }
		].forEach(params => it(`puts (${params.tic},${params.grade}) in the ${params.expected} quadrant`, () => {
			expect(sut.calculateQuadrant(params.tic, params.grade)).to.equal(params.expected);
		}));
	});

	describe('filter', () => {
		['leftTop', 'leftBottom', 'rightTop', 'rightBottom'].forEach(quadrant =>
			[
				{ r: [0, 0, 0, 0, 98, 0], quadrant: 'leftTop' },
				{ r: [0, 0, 0, 0, 68.9, 0], quadrant: 'leftBottom' },
				{ r: [0, 0, 0, 0, 98, 1739], quadrant: 'leftTop' },
				{ r: [0, 0, 0, 0, 98, 1800], quadrant: 'rightTop' },
				{ r: [0, 0, 0, 0, 68.9, 1739], quadrant: 'leftBottom' },
				{ r: [0, 0, 0, 0, 70, 1800], quadrant: 'rightTop' },
				{ r: [0, 0, 0, 0, 25, 1800], quadrant: 'rightBottom' }
			].forEach(params =>
				it(`${params.quadrant === quadrant ? 'passes' : 'rejects'} (${params.r[5]},${params.r[4]}) for ${quadrant}`,
					() => {
						sut.quadrant = quadrant;
						expect(sut.filter(params.r)).to.equal(params.quadrant === quadrant);
					})
			)
		);
	});

	describe('getDataForQuadrant', () => {
		[
			{ quadrant: 'leftTop', expected: [[0, 100], [0, 100], [0, 100], [0, 73], [0, 73], [0, 98], [0, 89], [0, 98], [0, 88], [0, 99]] },
			{ quadrant: 'leftBottom', expected: [[0, 33], [0, 42], [0, 66]] },
			{ quadrant: 'rightTop', expected: [[116, 93], [100, 75], [66, 84]] },
			{ quadrant: 'rightBottom', expected: [[33, 22], [41, 33], [66, 44], [75, 55], [58, 41], [83, 55], [50, 39]] }
		].forEach(params => it(`returns data for ${params.quadrant}`, () => {
			expect(sut.getDataForQuadrant(params.quadrant)).to.deep.equal({ data: params.expected, size: params.expected.length });
		}));

		it('should coalesce large data sets', () => {
			// generate just a few clusters of data per quadrant, but many overall
			const lotsOfRecords = Array.from(Array(40000), (_, i) => {
				const gradeCluster = 20 + (i % 8) * 10; // 20-90 in 10% increments
				const ticCluster = 100 + (i % 4) * 200; // 100-700 in 200 minute increments
				const gradePercent = gradeCluster + (i % 100) * 0.01; // up to 1.98 more than the cluster base
				const ticMinutes = ticCluster + (i % 100) * 0.1; // up to 10 minutes more than the cluster base
				return [
					1, 100, 100, 0, gradePercent, ticMinutes * 60, null, 17, 18, 19
				];
			});

			const big = new TimeInContentVsGradeFilter({ records: lotsOfRecords });
			// performance: if we don't put these computed properties in a reaction, mobx doesn't
			// cache them and they are recalculated for every data point, causing this test to time out
			const mobxDisposer = autorun(() => {
				big.avgGrade;
				big.avgTimeInContent;
			});

			const dataForQuadrant = big.getDataForQuadrant('leftBottom');
			mobxDisposer();
			expect(dataForQuadrant).to.deep.equal({
				size: 10000,
				data: [[90, 20], [105, 20], [300, 30]]
			});
		});
	});

	describe('tiCVsGrades',  () => {
		it('should return the array of tuples: current final grade vs time in content, mins', async() => {
			const expected = [[33, 22], [41, 33], [66, 44], [75, 55], [0, 33], [0, 100], [0, 100], [0, 100], [0, 73], [0, 73], [58, 41], [83, 55], [50, 39], [116, 93], [100, 75], [66, 84], [0, 98], [0, 89], [0, 98], [0, 88], [0, 99], [0, 42], [0, 66]];
			expect(sut.tiCVsGrades).to.deep.equal(expected);
		});
	});
});

describe('d2l-insights-time-in-content-vs-grade-card', () => {
	const data = {
		records
	};
	const filter = new TimeInContentVsGradeFilter(data);
	data.getFilter = id => (id === filter.id ? filter : null);

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-time-in-content-vs-grade-card');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-time-in-content-vs-grade-card .data="${data}"></d2l-insights-time-in-content-vs-grade-card>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render as expected', async() => {
			const el = await fixture(html`<d2l-insights-time-in-content-vs-grade-card .data="${data}"></d2l-insights-time-in-content-vs-grade-card>`);
			const title = (el.shadowRoot.querySelectorAll('div.d2l-insights-time-in-content-vs-grade-title'));
			expect(title[0].innerText).to.equal('Time in Content vs. Grade');
		});

		it('should exclude chart form tabindex when data is loading', async() => {
			const el = await fixture(html`<d2l-insights-time-in-content-vs-grade-card .data="${data}" skeleton></d2l-insights-time-in-content-vs-grade-card>`);
			await new Promise(resolve => setTimeout(resolve, 50));

			const chart = el.shadowRoot.querySelector('d2l-labs-chart');
			const chartDiv = chart.shadowRoot.querySelector('#chart-container');
			expect(chartDiv.getAttribute('tabindex')).to.equal('-1');

			el.skeleton = false;
			await elementUpdated(el);
			expect(chartDiv.getAttribute('tabindex')).to.equal('0');
		});
	});

	describe('urlState', () => {

		const key = new TimeInContentVsGradeFilter().persistenceKey;
		before(() => enableUrlState());
		after(() => disableUrlStateForTesting());

		it('should load the default value and then save to the url', () => {
			// set the filter to active
			setStateForTesting(key, 'upperLeft');

			// check that the filter loads the url state
			const filter = new TimeInContentVsGradeFilter();
			expect(filter.quadrant).to.equal('upperLeft');

			filter.quadrant = 'bottomRight';

			// check that the change state was saved
			const params = new URLSearchParams(window.location.search);
			const state = params.get(filter.persistenceKey);
			expect(state).to.equal('bottomRight');
		});
	});
});
