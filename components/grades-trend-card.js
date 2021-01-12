import 'highcharts';
import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class GradesTrendCard extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false }
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
			.d2l-insights-grades-trend-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			.d2l-insights-summary-card-body {
				align-items: center;
				display: flex;
				height: 100%;
			}

			:host([skeleton]) .d2l-insights-grades-trend-title {
				margin-left: 19px;
			}
		`];
	}

	get _cardTitle() {
		return this.localize('gradesTrendCard:gradesOverTime');
	}

	get _currentGradeText() {
		return this.localize('gradesTrendCard:currentGrade');
	}

	get _dateText() {
		return this.localize('gradesTrendCard:date');
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`
			<div class="d2l-insights-grades-trend-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart class="d2l-insights-summary-card-body"
							.options="${this.chartOptions}"
							?skeleton="${this.skeleton}"
			></d2l-labs-chart>`;
	}

	get chartOptions() {
		return {
			chart: {
				height: 250,
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
				tickLength: 1,
				labels: {
					format: '{value:%b %e/%y}',
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
					text: this._currentGradeText,
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
	get _series() {
		return [{
			//test data
			name: '1',
			data: [
				[Date.UTC(2019, 1, 10), 80],
				[Date.UTC(2019, 1, 17), 90],
				[Date.UTC(2019, 1, 24), 75],
				[Date.UTC(2019, 1, 30), 85]
			]
		}, {
			name: '2',
			data:  [
				[Date.UTC(2019, 2, 10), 50],
				[Date.UTC(2019, 2, 17), 80],
				[Date.UTC(2019, 2, 24), 55],
				[Date.UTC(2019, 2, 30), 80]
			]
		}];
	}
}
customElements.define('d2l-insights-grades-trend-card', GradesTrendCard);
