import 'highcharts';
import { css, html } from 'lit-element/lit-element.js';
import { ORG_UNIT, UserTrendColorsIterator } from '../consts';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class AccessTrendCard extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			selectedCourses: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.selectedCourses = {
			size: 0,
			has: () => false
		};
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
			.d2l-insights-access-trend-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-access-trend-title {
				margin-left: 19px;
			}
		`];
	}

	get _cardTitle() {
		return this.localize('accessTrendCard:title');
	}

	get _xAxisTitle() {
		return this.localize('accessTrendCard:xAxisTitle');
	}

	get _yAxisTitle() {
		return this.localize('accessTrendCard:yAxisTitle');
	}

	render() {
		return html`
			<div class="d2l-insights-access-trend-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart
				.options="${this._chartOptions}"
				?skeleton="${this.skeleton}"
			></d2l-labs-chart>`;
	}

	_toggleFilterEventHandler(series) {
		const orgUnitId = parseInt(series.userOptions.orgUnitId, 10);

		if (Number.isInteger(orgUnitId)) {
			this.selectedCourses.toggle(orgUnitId);
		}
	}

	get _chartOptions() {
		const that = this;

		return {
			chart: {
				type: 'area',
				height: 250,
				width: 583,
				zoomType: 'x'
			},

			title: {
				text: this._cardTitle,
				style: {
					display: 'none'
				}
			},

			xAxis: {
				title: {
					text: this._xAxisTitle,

					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},

				type: 'datetime',

				style: {
					color: 'var(--d2l-color-ferrite)',
					fontSize: '9px',
					fontWeight: 'bold',
					fontFamily: 'Lato'
				},

				labels: {
					formatter: function() {
						return formatDate(new Date(this.value), { format: 'short' });
					},
					rotation: -60,

					style: {
						fontSize: '14px',
						color: 'var(--d2l-color-ferrite)',
						fontFamily: 'Lato'
					}
				}
			},

			yAxis: {
				title: {
					text: this._yAxisTitle,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '10px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				}
			},

			legend: {
				enabled: false
			},

			credits: {
				enabled: false,
			},

			tooltip: {
				enabled: false
			},

			plotOptions: {

				series: {

					point: {
						events: {
							click: function(e) {
								// handles also spacebar and enter keys
								// in opposite to area.event.click which handles only mouse events
								// e.target.series - when a user hits a keaboard key
								// e.point.series -  when a user clicks point by mouse

								that._toggleFilterEventHandler(e.target.series || e.point.series);
							}
						}
					}
				},

				area: {
					trackByArea: true,

					states: {
						hover: {
							enabled: true,
							halo: {
								size: 0
							}
						},
						inactive: {
							enabled: false
						}
					},

					marker: {
						enabled: false
					}
				}
			},

			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				},

				point: {
					// 6. Saturday, Mar  7, 2020, Date, 7 Course Access Count. Course 1.
					// it adds `Date, ` and ` Course Access Count` into point descripton
					valuePrefix: `${this._xAxisTitle}, `,
					valueSuffix: ` ${this._yAxisTitle}`
				}
			},

			series: this._series
		};
	}

	get _trendData() {
		const courses = [{
			orgUnitId: 1,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 3 },
				{ x: Date.UTC(2020, 1, 17), y: 4 },
				{ x: Date.UTC(2020, 1, 24), y: 5 },
				{ x: Date.UTC(2020, 1, 31), y: 3 },
				{ x: Date.UTC(2020, 2, 7), y: 7 },
				{ x: Date.UTC(2020, 2, 14), y: 7 },
				{ x: Date.UTC(2020, 2, 21), y: 6 }
			]
		}, {
			orgUnitId: 2,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 2 },
				{ x: Date.UTC(2020, 1, 17), y: 3 },
				{ x: Date.UTC(2020, 1, 24), y: 4 },
				{ x: Date.UTC(2020, 1, 31), y: 1 },
				{ x: Date.UTC(2020, 2, 7), y: 4 },
				{ x: Date.UTC(2020, 2, 14), y: 4 },
				{ x: Date.UTC(2020, 2, 21), y: 6 }
			]
		}, {
			orgUnitId: 8,
			data: [
				{ x: Date.UTC(2020, 1, 3), y: 0 },
				{ x: Date.UTC(2020, 1, 10), y: 1 },
				{ x: Date.UTC(2020, 1, 17), y: 2 },
				{ x: Date.UTC(2020, 1, 24), y: 3 },
				{ x: Date.UTC(2020, 1, 31), y: 0 },
				{ x: Date.UTC(2020, 2, 7), y: 2 },
				{ x: Date.UTC(2020, 2, 14), y: 2 },
				{ x: Date.UTC(2020, 2, 21), y: 4 }
			]
		}];

		return courses;
	}

	get _serverData() {
		return this.data._data.serverData;
	}

	_orgUnitName(orgUnitId) {
		const orgUnit = this._serverData.orgUnits.find(unit => unit[ORG_UNIT.ID] === orgUnitId);

		return orgUnit ? orgUnit[ORG_UNIT.NAME] : '';
	}

	get _series() {
		if (!this.data._data) return [];

		const selected = (course) => this.selectedCourses.has(course.orgUnitId) || this.selectedCourses.size === 0;
		const colors = [...UserTrendColorsIterator(0, 1, this._trendData.length)];

		return this._trendData
			.map((course, idx) => ({
				...course,
				// It is read as `Course 1, series 1 of 3 with 8 data points.`
				name: this._orgUnitName(course.orgUnitId),
				lineColor:  'var(--d2l-color-white)',
				color: selected(course) ? colors[idx] : 'var(--d2l-color-mica)' }));
	}
}
customElements.define('d2l-insights-access-trend-card', AccessTrendCard);
