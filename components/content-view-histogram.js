import { action, computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { getOutliers, removeOutliers } from '../model/stats.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { CategoryFilter } from '../model/categoryFilter';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { filterEventQueue } from './alert-data-update';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { RECORD, USER } from '../consts';
import { UrlState } from '../model/urlState';

const filterId = 'd2l-insights-content-view-histogram';

let userBinCache = {}
// we need to map the bin index to a real bin...
export class ContentViewHistogramFilter extends CategoryFilter {
	constructor() {
		const filterFunc = (record, _, userRecords) => {
			let recordBin = 0;
			const userId = record[RECORD.USER_ID];
			// skip the n*n search, we've done this before
			if (userId in userBinCache) {
				recordBin = userBinCache[userId];
			// we don't have a bin for this user yet
			} else {
				const userRecord = userRecords.find(r => r[USER.ID] === userId);
				const views = userRecord[USER.TOTAL_COURSE_ACCESS];
				if (views === 0) return this.bins.length;
				recordBin = this.bins.findIndex(bin => views <= bin[0] && views > bin[1]);
				userBinCache[userId] = recordBin;
			}
			console.log(userBinCache);
			return this.selectedCategories.has(recordBin);
		};
		super(
			filterId,
			'contentViewHistogram:title',
			filterFunc,
			'cvhf',
			undefined // set all later
		);

		this._binScheme = 50;


		this._urlState = new UrlState(this);
	}

	set binScheme(scheme) {
		if (scheme[0] !== Number.POSITIVE_INFINITY) {
			this._binScheme = scheme[0];
		} else {
			this._binScheme = scheme[1];
		}
		userBinCache = {}
	}

	get bins() {
		let bins = [];
		const range = this._binScheme / 5;
		for (let i = 1; i <= 5; i++) {
			bins.push([range * i, range * (i - 1)]);
		}
		if (super._all.size === 7) bins.push([Number.POSITIVE_INFINITY, this._binScheme]);
		console.log(bins);
		return bins.reverse();
	}

	setAll(all) {
		// because there can be 6 or 7 bins we need to
		// set the all state before the component has rendered
		super._all = new Set(all);
		userBinCache = {}
	}

	//for Urlstate
	get persistenceValue() {
		if (this.selectedCategories.size === 0) return '';
		return [...this.selectedCategories].join(',');
	}

	set persistenceValue(value) {
		if (value === '') {
			this.selectedCategories.clear();
			return;
		}
		const categories = value.split(',').map(category => Number(category));
		this.setCategories(categories);
	}
}

decorate(ContentViewHistogramFilter, {
	setAll: action
})

class ContentViewHistogram extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
		};
	}

	constructor() {
		super();
		this.data = {};
	}

	static get styles() {
		return [super.styles, bodyStandardStyles, css`
			:host {
				border-color: var(--d2l-color-mica);
				border-radius: 15px;
				border-style: solid;
				border-width: 1.5px;
				display: inline-block;
				height: 285px;
				margin-right: 12px;
				margin-top: 10px;
				padding: 15px 4px;
				width: 583px;
			}

			@media only screen and (max-width: 615px) {
				:host {
					margin-right: 0;
				}
			}

			:host([hidden]) {
				display: none;
			}
			.d2l-insights-content-views-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-content-views-title {
				margin-left: 19px;
			}
		`];
	}

	getToolTipDescription(point) {

		const range = this.categories[point.x].split('-');

		if (point.y === 1 && range[0].includes('>')) {
			return this.localize('contentViewHistogram:userGreaterTimes', { start: range[0].replace('>', '') });
		} else if (range[0].includes('>')) {
			return this.localize('contentViewHistogram:usersGreaterTimes', { numUsers: point.y, start: range[0].replace('>', '') });
		} else if (point.y === 1 && range[0] === '0') {
			return this.localize('contentViewHistogram:userZeroTimes');
		} else if (point.y === 1 && range[0] !== '0') {
			return this.localize('contentViewHistogram:userInRange', { start: range[1], end: range[0] });
		} else if (range[0] === '0') {
			return this.localize('contentViewHistogram:usersZeroTimes', { numUsers: point.y });
		} else {
			return this.localize('contentViewHistogram:usersInRange', { numUsers: point.y, start: range[1], end: range[0] });
		}
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	//computed
	get bins() {
		// changing these ranges will change the bins throught the chart.
		const peaks = [50, 100, 200, 500, 1000];
		const values = this.allCourseAccessWithoutOutliers;
		const largestAccess = values[values.length - 1];
		let upperBin = peaks.find(peak => peak >= largestAccess);
		if (upperBin === undefined) upperBin = 1000;
		if (values.length === 0) upperBin = 50;
		const range = upperBin / 5;
		const bins = [];

		for (let i = 1; i <= 5; i++) {
			bins.push([range * i, range * (i - 1)]);
		}
		if (this.allCourseAccessOutliers.length !== 0 || largestAccess > peaks[peaks.length - 1]) {
			bins.push([Number.POSITIVE_INFINITY, upperBin]);
		}

		return bins.reverse();
	}

	// computed
	get filteredSortedUserRecords() {

		return this.data
			.withoutFilter(filterId)
			.users
			.filter(record => record[USER.TOTAL_COURSE_ACCESS] !== undefined && record[USER.TOTAL_COURSE_ACCESS] !== null)
			.sort((aRecord, bRecord) => aRecord[USER.TOTAL_COURSE_ACCESS] - bRecord[USER.TOTAL_COURSE_ACCESS]);
	}

	get serverData() {
		return this.data._data.serverData
	}

	// computed
	get sortedUserRecords() {
		return this.serverData
			.users
			.filter(record => record[USER.TOTAL_COURSE_ACCESS] !== undefined && record[USER.TOTAL_COURSE_ACCESS] !== null)
			.sort((aRecord, bRecord) => aRecord[USER.TOTAL_COURSE_ACCESS] - bRecord[USER.TOTAL_COURSE_ACCESS]);
	}

	get filteredCourseAccesses() {
		return this.filteredSortedUserRecords.map(record => record[USER.TOTAL_COURSE_ACCESS]);
	}

	get allCourseAccesses() {
		return this.sortedUserRecords.map(record => record[USER.TOTAL_COURSE_ACCESS]);
	}

	get allCourseAccessWithoutOutliers() {
		return removeOutliers(this.allCourseAccesses);
	}

	get allCourseAccessOutliers() {
		return getOutliers(this.allCourseAccesses);
	}

	get filteredCourseAccessOutliers() {
		return getOutliers(this.filteredCourseAccesses);
	}

	get dataBuckets() {
		return new Array(this.bins.length + 1).fill(0);
	}

	get categories() {
		return this.bins.reduce((acc, cur) => {
			if (cur[0] === Number.POSITIVE_INFINITY) {
				acc.push(`> ${cur[1]}`);
			} else {
				acc.push(`${cur[1] + 1}-${cur[0]}`);
			}
			return acc;
		}, []).concat(['0']);
	}

	get _chartDataBuckets() {

		const findBin = (record) => {
			if (record === 0) return this.bins.length;
			return this.bins.findIndex(bin => record <= bin[0] && record > bin[1]);
		};

		const buckets = [...this.dataBuckets];

		return this.filteredCourseAccesses
			.reduce((acc, record) => {
				acc[findBin(record)] += 1;
				return acc;
			}, buckets);
	}

	get colors() {
		if (!this.filter.isApplied) return ['var(--d2l-color-celestine)'];

		return new Array(this.bins.length + 1).fill(0).map((v,i) =>
			this.filter.selectedCategories.has(i) ?
				'var(--d2l-color-celestine)' :
				'var(--d2l-color-mica)'
		);
	}

	mergeCategories(categories) {
		const result = categories.sort().reverse().reduce((acc, cur) => {
			// take the category and find the bin
			// turn the bin range into a pair
			const curRanges = cur < this.bins.length ? this.bins[cur] : [0,-1];
			if (acc[acc.length - 1] !== undefined &&
				acc[acc.length - 1][0] === curRanges[1])
			{
				acc[acc.length - 1][0] = curRanges[0];
			} else {
				acc.push([curRanges[0], curRanges[1] + 1]);
			}
			return acc;

		}, []);
		return result.map(pair => pair.reverse());
	}

	getAxeDescription() {

		const chartName = { chartName : this._cardTitle };

		const categories = ([...this.filter.selectedCategories]);
		if (categories.length === 0) return this.localize('alert:axeNotFiltering', chartName);

		const pairs = this.mergeCategories(categories);

		const message = this.localize('alert:axeDescriptionRange', chartName);
		const descriptions = pairs.map(
			pair => {
				if(pair[1] === Number.POSITIVE_INFINITY) {
					return this.localize('alert:greaterThanThis', { num: pair[0] - 1 });
				} else if ( pair[1] === 0 ){
					return 0
				}
				return pair.join(this.localize('alert:this-To-That'))
			}
		).join(', ');

		return `${message} ${descriptions}`;
	}

	get chartOptions() {

		const that = this;
		const axisStyle = {
			color: 'var(--d2l-color-ferrite)',
			fontSize: '10px',
			fontWeight: 'bold',
			fontFamily: 'Lato'
		};

		return {
			chart: {
				type: 'bar',
				height: 260,
				width: 583
			},
			tooltip: {
				formatter: function() {
					return that.getToolTipDescription(this.point);
				},
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderColor: 'var(--d2l-color-ferrite)',
				borderRadius: 12,
				style: {
					color: 'white',
				}
			},
			title: {
				text: this._cardTitle,
				style: {
					display: 'none'
				}
			},
			legend: {
				enabled: false
			},
			credits: {
				enabled: false,
			},
			yAxis: {
				tickAmount: 5,
				allowDecimals: false,
				title: {
					style: axisStyle,
					text: this.localize('contentViewHistogram:userCount')
				},
				labels: {
					align: 'center',
					reserveSpace: true,
					style: {
						fontSize: '12px',
						fontFamily: 'Lato'
					}
				}
			},
			xAxis: {
				categories: this.categories,
				title: {
					style: axisStyle,
					text: this.localize('contentViewHistogram:contentViews')
				},
				labels: {
					align: 'right',
					reserveSpace: true,
					style: {
						fontSize: '12px',
						fontFamily: 'Lato'
					}
				}
			},
			plotOptions: {
				series: {
					minPointLength: 2, // visualize 0 points
					pointStart: 0,
					pointWidth: 16,
					pointPadding: 0.60,
					accessibility: {
						description: this.localize('contentViewHistogram:textLabel'),
						pointDescriptionFormatter: function(point) {
							const val = point.y;
							if (point.x === 6) {
								return `0, ${that.localize('contentViewHistogram:userCount')}, ${val}.`;
							}
							return `${that.categories[point.x]}, ${that.localize('contentViewHistogram:userCount')}, ${val}.`;
						}
					},
					colorByPoint: true,
					colors: this.colors,
					point: {
						events: {
							click: function() {
								that.filter.toggleCategory(this.index);
								filterEventQueue.add(
									that.localize('alert:updatedFilter', { chartName: that._cardTitle }),
									that.getAxeDescription()
								);
							}
						}
					}
				}
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				}
			},
			series: [{ data: this._chartDataBuckets }]
		};
	}

	get _cardTitle() {
		return this.localize('contentViewHistogram:title');
	}

	render() {

		// the filter depends on the bin scheme so we need to update it.
		this.filter.binScheme = this.bins[0];
		console.log(this.filter._binScheme)
		this.filter.setAll(new Array(this.bins.length + 1).fill(0).map((v , i) => i));

		return html`
		<div class="d2l-insights-content-views-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
		<d2l-labs-chart
			.options="${this.chartOptions}"
			?skeleton="${this.skeleton}"
		></d2l-labs-chart>`;
	}
}

decorate(ContentViewHistogram, {
	filteredSortedUserRecords: computed,
	sortedUserRecords: computed,
	allCourseAccessWithoutOutliers: computed,
	allCourseAccessOutliers: computed,
	bins: computed,
	data: observable
});

customElements.define('d2l-labs-content-view-histogram', ContentViewHistogram);
