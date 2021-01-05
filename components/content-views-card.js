import 'highcharts';
import { css, html } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class ContentViewsCard extends SkeletonMixin(Localizer(MobxLitElement)) {
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
			<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${this.chartOptions}" ?skeleton="${this.skeleton}"></d2l-labs-chart>`;
	}

	get chartOptions() {
		return {
			chart: {
				height: 270,
				width: 583,
				zoomType: 'x'
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
			tooltip: {
				enabled: false
			},
			xAxis: {
				tickInterval:  7 * 24 * 3600 * 1000, //week
				type: 'datetime',
				labels: {
					format: '{value:%b %e/%y}',
					rotation: -60,
					y: 30,
					align: 'center'
				},
				title: {
					text: this._dateText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					},
					margin: -10
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
					}
				}
			},
			series: [{
				//test data
				data: [
					{ x: Date.UTC(2019, 1, 1), y: 50 },
					{ x: Date.UTC(2019, 1, 7), y: 60 },
					{ x: Date.UTC(2019, 1, 14), y: 45 },
					{ x: Date.UTC(2019, 1, 21), y: 65 }
				]
			}, {
				data:  [
					{ x: Date.UTC(2019, 2, 1), y: 20 },
					{ x: Date.UTC(2019, 2, 7), y: 50 },
					{ x: Date.UTC(2019, 2, 14), y: 25 },
					{ x: Date.UTC(2019, 2, 21), y: 50 }
				]
			}]
		};
	}
}
customElements.define('d2l-insights-content-views-card', ContentViewsCard);
