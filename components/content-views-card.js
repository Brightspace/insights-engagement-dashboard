import 'highcharts';
import { css, html } from 'lit-element/lit-element.js';
import { ORG_UNIT, UserTrendColorsIterator } from '../consts';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class ContentViewsCard extends SkeletonMixin(Localizer(MobxLitElement)) {
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

	get _cardTitle() {
		return this.localize('contentViewsCard:contentViewOverTime');
	}

	get _viewCountText() {
		return this.localize('contentViewsCard:viewCount');
	}

	get _dateText() {
		return this.localize('contentViewsCard:date');
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`
			<div class="d2l-insights-content-views-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart
				.options="${this.chartOptions}"
				?skeleton="${this.skeleton}"
			></d2l-labs-chart>`;
	}

	_toggleFilterEventHandler(series) {
		const orgUnitId = parseInt(series.userOptions.orgUnitId, 10);

		if (Number.isInteger(orgUnitId)) {
			this.selectedCourses.toggle(orgUnitId);
		}
	}

	get chartOptions() {
		const that = this;

		return {
			chart: {
				height: 260,
				width: 583,
				zoomType: 'x',
				resetZoomButton: {
					position: {
						align: 'right',
						y: -10
					}
				}
			},
			title: {
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
			tooltip: {
				enabled: false
			},
			xAxis: {
				tickInterval:  7 * 24 * 3600 * 1000, //week
				type: 'datetime',
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
				},
				title: {
					text: this._dateText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				}
			},
			yAxis: {
				title: {
					text: this._viewCountText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},
				max: 100,
				tickPositions: [0, 25, 50, 75, 100],
				startOnTick: true,
				endOnTick: true,
				gridLineWidth: 1,
				gridLineColor: 'var(--d2l-color-mica)',
				labels: {
					style: {
						fontSize: '14px',
						color: 'var(--d2l-color-ferrite)',
						fontFamily: 'Lato'
					}
				},
			},
			plotOptions: {
				series: {
					marker: {
						enabled: false
					},
					point: {
						events: {
							click: function(e) {
								// e.target.series - when a user hits a keaboard key
								// e.point.series -  when a user clicks point by mouse
								that._toggleFilterEventHandler(e.target.series || e.point.series);
							}
						}
					}
				}
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				},
				point: {
					valuePrefix: `${this._dateText}, `,
					valueSuffix: ` ${this._viewCountText}`
				}
			},
			series: this._series
		};
	}

	get _trendData() {
		const courses = [{
			//test data
			orgUnitId: 1,
			data: [
				[Date.UTC(2020, 1, 1), 50],
				[Date.UTC(2020, 1, 7), 60],
				[Date.UTC(2020, 1, 14), 45],
				[Date.UTC(2020, 1, 21), 65],
				[Date.UTC(2020, 1, 28), 70],
				[Date.UTC(2020, 2, 4), 65]
			]
		}, {
			orgUnitId: 2,
			data: [
				[Date.UTC(2020, 1, 1), 30],
				[Date.UTC(2020, 1, 7), 50],
				[Date.UTC(2020, 1, 14), 35],
				[Date.UTC(2020, 1, 21), 50],
				[Date.UTC(2020, 1, 28), 65],
				[Date.UTC(2020, 2, 4), 40]
			]
		}, {
			orgUnitId: 8,
			data: [
				[Date.UTC(2020, 1, 1), 10],
				[Date.UTC(2020, 1, 7), 30],
				[Date.UTC(2020, 1, 14), 25],
				[Date.UTC(2020, 1, 21), 40],
				[Date.UTC(2020, 1, 28), 55],
				[Date.UTC(2020, 2, 4), 25]
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

		const colors = [...UserTrendColorsIterator(0, 1, this._trendData.length)];
		const selected = (course) => this.selectedCourses.has(course.orgUnitId) || this.selectedCourses.size === 0;

		return this._trendData
			.map((course, idx) => ({
				...course,
				// It is read as `Course 1, series 1 of 3 with 8 data points.`
				name: this._orgUnitName(course.orgUnitId),
				color: selected(course) ? colors[idx] : 'var(--d2l-color-mica)' }));
	}
}
customElements.define('d2l-insights-content-views-card', ContentViewsCard);
