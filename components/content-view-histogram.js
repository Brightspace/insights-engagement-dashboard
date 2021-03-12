import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { USER } from '../consts';
const filterId = 'd2l-insights-content-view-histogram';

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

	get bins() {
		// changing these ranges will change the bins throught the chart.
		const peaks = [50, 100, 200, 500, 1000];
		const values = this.courseAccessWithoutOutliers();
		const largestAccess = values[values.length - 1];
		let upperBin = peaks.find(peak => peak >= largestAccess);
		if (upperBin === undefined) upperBin = 1000;
		if (values.length === 0) upperBin = 50;
		const range = upperBin / 5;
		const bins = [];

		for (let i = 1; i <= 5; i++) {
			bins.push([range * i, range * (i - 1)]);
		}

		if (this.courseAccessOutliers.length !== 0 || largestAccess > 1000) {
			bins.push([Number.POSITIVE_INFINITY, upperBin]);
		}

		return bins.reverse();
	}

	_median(a) {
		const result = a[Math.floor((a.length - 1) / 2)];
		return result;
	}

	get courseAccesses() {
		return this.data
			.withoutFilter(filterId)
			.users.map(record => record[USER.TOTAL_COURSE_ACCESS]).sort((a, b) => a - b)
			.filter(value => value !== undefined && value !== null);
	}

	get _Q1() {
		if (this.courseAccesses.length < 2) return [];
		return this._median(
			this.courseAccesses.splice(
				0,
				Math.round(this.courseAccesses.length / 2) - 1
			)
		);
	}

	get _Q3() {
		if (this.courseAccesses.length < 2) return [];
		return this._median(
			this.courseAccesses.splice(
				Math.round(this.courseAccesses.length / 2),
				this.courseAccesses.length
			)
		);
	}

	calculateIQRWhisker() {
		const IQR = this._Q3 - this._Q1;
		return IQR * 1.5;
	}

	courseAccessWithoutOutliers() {
		if (this.courseAccesses.length < 5) return this.courseAccesses;
		const IQRWhisker = this.calculateIQRWhisker();
		const upperBound = this._Q3 + IQRWhisker;
		return this.courseAccesses.filter(access => access < upperBound);
	}

	get courseAccessOutliers() {
		const IQRWhisker = this.calculateIQRWhisker();
		const upperBound = this._Q3 + IQRWhisker;
		return this.courseAccesses.filter(access => access >= upperBound);
	}

	get dataBuckets() {
		return new Array(this.bins.length + 1).fill(0);
	}

	get categories() {
		return this.bins.reduce((acc, cur) => {
			if (cur[0] === Number.POSITIVE_INFINITY) {
				acc.push(`> ${cur[1]}`);
			} else {
				acc.push(`${cur[0]}-${cur[1] + 1}`);
			}
			return acc;
		}, []).concat(['0']);
	}

	get _chartDataBuckets() {

		const findBin = (record) => {
			const totalCount = record[USER.TOTAL_COURSE_ACCESS];
			if (totalCount === 0) return this.bins.length;
			return this.bins.findIndex(bin => totalCount <= bin[0] && totalCount > bin[1]);
		};

		const buckets = [...this.dataBuckets];

		return this.data
			.withoutFilter(filterId)
			.users
			.reduce((acc, record) => {
				acc[findBin(record)] += 1;
				return acc;
			}, buckets);
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
					colors: new Array(6).fill('var(--d2l-color-celestine)')
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
		return html`
		<div class="d2l-insights-content-views-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
		<d2l-labs-chart
			.options="${this.chartOptions}"
			?skeleton="${this.skeleton}"
		></d2l-labs-chart>`;
	}
}

customElements.define('d2l-labs-content-view-histogram', ContentViewHistogram);
