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

		if (point.y === 1 && range[0] === '0') {
			return this.localize('contentViewHistogram:userZeroTimes');
		} else if (point.y === 1 && range[0] !== '0') {
			return this.localize('contentViewHistogram:userInRange', { start: range[0], end: range[1] });
		} else if (range[0] === '0') {
			return this.localize('contentViewHistogram:usersZeroTimes', { numUsers: point.y });
		} else {
			return this.localize('contentViewHistogram:usersInRange', { numUsers: point.y, start: range[0], end: range[1] });
		}
	}

	get bins() {
		// changing these ranges will change the bins throught the chart.
		return [
			[200, 150],
			[150, 100],
			[100, 50],
			[50, 10],
			[10, 0],
		];
	}

	get dataBuckets() {
		return new Array(this.bins.length + 1).fill(0);
	}

	get categories() {
		return this.bins.reduce((acc, cur) => acc.concat([cur.join('-')]), []).concat(['0']);
	}

	get _chartDataBuckets() {
		// buckets go from top to bottom, 200 views to 0

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
