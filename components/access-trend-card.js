import 'highcharts';
import { computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UrlState } from '../model/urlState';

const filterId = 'd2l-insights-access-trend-card';

export class CourseFilter {
	constructor() {
		this.isApplied = false;
		this.orgUnitId = null;
		this._urlState = new UrlState(this);
	}

	get id() { return filterId; }

	get title() { return 'accessTrendCard:title'; }

	get isApplied() {
		return this.orgUnitId !== null;
	}

	set isApplied(isApplied) {
		if (!isApplied) this.orgUnitId = null;
	}

	filter(record) {
		return record[RECORD.ORG_UNIT_ID] === this.orgUnitId;
	}

	toggleCourse(orgUnitId) {
		if (this.orgUnitId === orgUnitId) {
			this.orgUnitId = null;
		} else {
			this.orgUnitId = orgUnitId;
		}
	}

	get persistenceKey() { return 'c'; }

	get persistenceValue() {
		return this.isApplied ? this.orgUnitId : '';
	}

	set persistenceValue(value) {
		this.orgUnitId = value === '' ? null : value;
	}
}
decorate(CourseFilter, {
	orgUnitId: observable,
	isApplied: computed
});

class AccessTrendCard extends SkeletonMixin(Localizer(MobxLitElement)) {

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

	get filter() {
		return this.data.getFilter(filterId);
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
					format: '{value:%b %e/%y}', // TODO localization
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
					trackByArea: true,

					events: {
						click: function(e) {
							// TODO change color
							console.log(`Series ${e.point.series.name} clicked.`);
							const orgUnitId = parseInt(e.point.series.name, 10);
							if (Number.isInteger(orgUnitId)) {
								console.log('Toggle filter');
								that.filter.toggleCourse(orgUnitId);
							}
						}
					},

					states: {
						hover: {
							enabled: false
						},
						inactive: {
							enabled: false
						}
					}
				}
			},

			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				},
				series: {
					descriptionFormatter: () => this._cardTitle
				}
			},

			series: this._series
		};
	}

	get _series() {
		// TODO get real data
		return [{
			name: 'System Access',
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
			name: '1',
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
			name: '2',
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
	}
}
customElements.define('d2l-insights-access-trend-card', AccessTrendCard);
