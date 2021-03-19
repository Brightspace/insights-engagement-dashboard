import 'highcharts';
import './chart/chart';
import { css, html } from 'lit-element/lit-element.js';
import { MobxLitElement } from '@adobe/lit-mobx';

// sparklines, modified from
// https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/sparkline/

/**
 * Create options for sparklines that takes some sensible defaults and merges in the individual chart options.
 */
const sparklineOptions = function(options) {
	const defaultOptions = {
		chart: {
			backgroundColor: null,
			borderWidth: 0,
			type: 'line',
			margin: [2, 0, 2, 0],
			width: 120,
			height: 20,
			style: {
				overflow: 'visible'
			},

			// small optimalization, saves 1-2 ms each sparkline
			skipClone: true
		},
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		xAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: []
		},
		yAxis: {
			endOnTick: false,
			startOnTick: false,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickPositions: [0]
		},
		legend: {
			enabled: false
		},
		tooltip: {
			hideDelay: 0,
			outside: true,
			shared: true
		},
		plotOptions: {
			series: {
				lineWidth: 1,
				shadow: false,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				marker: {
					radius: 1,
					states: {
						hover: {
							radius: 2
						}
					}
				},
				fillOpacity: 0.25
			},
			column: {
				negativeColor: '#910000',
				borderColor: 'silver'
			}
		}
	};

	// Highcharts is an implicit global: importing it properly doesn't work with es-dev-server
	// eslint-disable-next-line no-undef
	return Highcharts.merge(defaultOptions, options);
};

class HistogramCard extends MobxLitElement {

	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-summary-card {
				border-color: aliceblue;
				border-radius: 15px;
				border-style: solid;
				border-width: 4px;
				display: inline-block;
				margin-right: 10px;
				margin-top: 10px;
				padding: 10px;
				width: fit-content;
			}
			.d2l-insights-summary-card[applied] {
				border-color: darkseagreen;
			}
			.d2l-insights-summary-card[loading] {
				opacity: 30%;
			}

			.d2l-insights-summary-card-body {
				align-items: center;
				display: flex;
				flex-wrap: wrap;
				height: 100%;
				margin-top: -15px;
				width: 80px;
			}

			.d2l-insights-summary-card-title {
				font-size: smaller;
			}

			.d2l-insights-summary-card-field {
				display: inline-block;
				margin: 10px;
				vertical-align: middle;
			}

			.d2l-insights-summary-card-value {
				color: lightsteelblue;
				font-size: 40px;
			}

			.d2l-insights-summary-card-message {
				max-width: 120px;
			}
		`;
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`<div class="d2l-insights-summary-card" ?applied="${this.data.isApplied}" ?loading="${this.data.isLoading}">
			<div class="d2l-insights-summary-card-title">${this.data.title}</div>
			<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${this.chartOptions}"></d2l-labs-chart>
		</div>`;
	}

	get chartOptions() {
		return sparklineOptions({
			series:
				[
					{
						data: this.data.series,
						type: 'column',
						name: 'histogram',
						zones: [
							{
								value: 2,
								color: 'darkred'
							}, {
								color: 'darkseagreen'
							}
						],
						zoneAxis: 'x'
					}
				],
			chart: {
				width: 80,
				height: 150
			},
			xAxis: {},
			plotOptions: {}
		});
	}
}
customElements.define('d2l-labs-histogram-card', HistogramCard);
