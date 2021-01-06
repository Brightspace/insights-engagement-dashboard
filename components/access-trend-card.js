import 'highcharts';
import { css, html } from 'lit-element/lit-element.js';
import { ORG_UNIT, USER_TREND_COLORS } from '../consts';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class AccessTrendCard extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			user: { type: Object, attribute: false },
			selectedCourses: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.user = {};
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

	_toggleFilter(orgUnitId) {
		this.selectedCourses.toggle(orgUnitId);
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
					format: '{value:%b %e/%y}',
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
				area: {
					trackByArea: true,

					events: {
						click: function(e) {
							const orgUnitId = parseInt(e.point.series.userOptions.orgUnitId, 10);
							if (Number.isInteger(orgUnitId)) {
								that._toggleFilter(orgUnitId);
							}
						}
					},

					states: {
						hover: {
							enabled: true
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
				}
			},

			series: this._series
		};
	}

	get _trendData() {
		const courses = [{
			orgUnitId: 1,
			data: [
				{ x: Date.UTC(2020, 1, 1), y: 43934 },
				{ x: Date.UTC(2020, 1, 3), y: 52503 },
				{ x: Date.UTC(2020, 1, 5), y: 57177 },
				{ x: Date.UTC(2020, 1, 7), y: 69658 },
				{ x: Date.UTC(2020, 1, 9), y: 97031 },
				{ x: Date.UTC(2020, 1, 11), y: 119931 },
				{ x: Date.UTC(2020, 1, 13), y: 137133 },
				{ x: Date.UTC(2020, 1, 15), y: 154175 }
			]
		}, {
			orgUnitId: 2,
			data: [
				{ x: Date.UTC(2020, 1, 1), y:24916 },
				{ x: Date.UTC(2020, 1, 3), y: 24064 },
				{ x: Date.UTC(2020, 1, 5), y: 29742 },
				{ x: Date.UTC(2020, 1, 7), y: 29851 },
				{ x: Date.UTC(2020, 1, 9), y: 32490 },
				{ x: Date.UTC(2020, 1, 11), y: 30282 },
				{ x: Date.UTC(2020, 1, 13), y: 38121 },
				{ x: Date.UTC(2020, 1, 15), y: 40434 }
			]
		}, {
			orgUnitId: 3,
			data: [
				{ x: Date.UTC(2020, 1, 1), y: 12908 },
				{ x: Date.UTC(2020, 1, 3), y: 5948 },
				{ x: Date.UTC(2020, 1, 5), y: 8105 },
				{ x: Date.UTC(2020, 1, 7), y: 11248 },
				{ x: Date.UTC(2020, 1, 9), y: 8989 },
				{ x: Date.UTC(2020, 1, 11), y: 11816 },
				{ x: Date.UTC(2020, 1, 13), y: 18274 },
				{ x: Date.UTC(2020, 1, 15), y: 18111 }
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
		return this._trendData
			.map((course, idx) => ({
				...course,
				// It is read as `Course 1, series 1 of 3 with 8 data points.`
				name: this._orgUnitName(course.orgUnitId),
				color: USER_TREND_COLORS[idx % USER_TREND_COLORS.length] }))
			.filter(course => this.selectedCourses.has(course.orgUnitId) || this.selectedCourses.size === 0);
	}
}
customElements.define('d2l-insights-access-trend-card', AccessTrendCard);
