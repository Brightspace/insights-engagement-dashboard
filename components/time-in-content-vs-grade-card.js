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

const filterId = 'd2l-insights-time-in-content-vs-grade-card';

const TIC = 0;
const GRADE = 1;

function avgOf(items, field) {
	if (items.length === 0) return 0;
	const total = items.reduce((sum, x) => sum + x[field], 0);
	return Math.floor(total / items.length);
}

export class TimeInContentVsGradeFilter {
	constructor(data) {
		this._data = data;
		this.quadrant = null;
		this._urlState = new UrlState(this);
	}

	get avgGrade() {
		return avgOf(this.tiCVsGrades, GRADE);
	}

	get avgTimeInContent() {
		return avgOf(this.tiCVsGrades, TIC);
	}

	get id() { return filterId; }

	get isApplied() {
		return this.quadrant !== null;
	}

	set isApplied(isApplied) {
		if (!isApplied) this.quadrant = null;
	}

	get tiCVsGrades() {
		return this._data.records
			// keep in count students either with a zero grade or without time in content
			.filter(record => record[RECORD.CURRENT_FINAL_GRADE] !== null && record[RECORD.CURRENT_FINAL_GRADE] !== undefined)
			.filter(item => item[RECORD.TIME_IN_CONTENT] || item[RECORD.CURRENT_FINAL_GRADE])
			.map(item => [Math.floor(item[RECORD.TIME_IN_CONTENT] / 60), item[RECORD.CURRENT_FINAL_GRADE]]);
	}

	get title() { return 'components.insights-time-in-content-vs-grade-card.timeInContentVsGrade'; }

	calculateQuadrant(tic, grade) {
		// accept either a record or coordinates
		if (Array.isArray(tic)) {
			const record = tic;
			if (record[RECORD.CURRENT_FINAL_GRADE] === null) return null;
			tic = Math.floor(record[RECORD.TIME_IN_CONTENT] / 60);
			grade = record[RECORD.CURRENT_FINAL_GRADE];
		}

		let quadrant;
		if (tic < this.avgTimeInContent && grade < this.avgGrade) quadrant = 'leftBottom';
		else if (tic <= this.avgTimeInContent && grade >= this.avgGrade) quadrant = 'leftTop';
		else if (tic > this.avgTimeInContent && grade > this.avgGrade) quadrant = 'rightTop';
		else quadrant = 'rightBottom';
		return quadrant;
	}

	getDataForQuadrant(quadrant) {
		return this.tiCVsGrades.filter(r => this.calculateQuadrant(r[TIC], r[GRADE]) === quadrant);
	}

	filter(record) {
		return this.calculateQuadrant(record) === this.quadrant;
	}

	toggleQuadrant(quadrant) {
		if (this.quadrant === quadrant) {
			this.quadrant = null;
		} else {
			this.quadrant = quadrant;
		}
	}

	//for Urlstate
	get persistenceKey() { return 'tcgf'; }

	get persistenceValue() {
		return this.quadrant ? this.quadrant : '';
	}

	set persistenceValue(value) {
		this.quadrant = value === '' ? null : value;
	}

}
decorate(TimeInContentVsGradeFilter, {
	_data: observable,
	quadrant: observable,
	isApplied: computed,
	avgGrade: computed,
	avgTimeInContent: computed,
	tiCVsGrades: computed
});

class TimeInContentVsGradeCard extends SkeletonMixin(Localizer(MobxLitElement)) {

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
				height: 275px;
				margin-right: 12px;
				margin-top: 10px;
				padding: 15px 4px;
				width: 581px;
			}

			@media only screen and (max-width: 615px) {
				:host {
					margin-right: 0;
				}
			}

			:host([hidden]) {
				display: none;
			}
			.d2l-insights-time-in-content-vs-grade-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-time-in-content-vs-grade-title {
				margin-left: 19px;
			}
		`];
	}

	get _cardTitle() {
		return this.localize('components.insights-time-in-content-vs-grade-card.timeInContentVsGrade');
	}

	get _currentGradeText() {
		return this.localize('components.insights-time-in-content-vs-grade-card.currentGrade');
	}

	get _timeInContentText() {
		return this.localize('components.insights-time-in-content-vs-grade-card.timeInContentLong');
	}

	get _dataMidPoints() {
		const maxTimeInContent = this.filter.tiCVsGrades.reduce((max, arr) => {
			return Math.max(max, arr[0]);
		}, -Infinity);
		return [['leftBottom', this.filter.avgTimeInContent / 2, 25],
			['rightBottom', this.filter.avgTimeInContent / 2, 75],
			['leftTop', (maxTimeInContent + this.filter.avgTimeInContent) / 2, 25],
			['rightTop', (maxTimeInContent + this.filter.avgTimeInContent) / 2, 75]];
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	_descriptiveTextByQuadrant(quadrant, numberOfUsers) {
		const quadrantTerm = `components.insights-time-in-content-vs-grade-card.${quadrant}`;
		return this.localize(quadrantTerm, { numberOfUsers });
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`
			<div class="d2l-insights-time-in-content-vs-grade-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${this.chartOptions}" ?skeleton="${this.skeleton}"></d2l-labs-chart>`;
	}

	get chartOptions() {
		const that = this;
		return {
			chart: {
				type: 'scatter',
				height: 250,
				width: 581,
				events: {
					click: function(event) {
						that.filter.toggleQuadrant(that.filter.calculateQuadrant(Math.floor(event.xAxis[0].value), Math.floor(event.yAxis[0].value)));
					},
				}
			},
			tooltip: {
				formatter: function() {
					if (this.series.name === 'midPoint') {
						return that._descriptiveTextByQuadrant(this.point.custom.quadrant, this.point.custom.size);
					}
					return false;
				},
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderColor: 'var(--d2l-color-ferrite)',
				borderRadius: 12,
				style: {
					color: 'white',
					width: 375
				},
				shared: false
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
			xAxis: {
				title: {
					text: this._timeInContentText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},
				min: 0,
				tickInterval: 30,
				startOnTick: true,
				gridLineWidth: 1,
				gridLineColor: 'var(--d2l-color-mica)',
				tickLength: 5,
				labels: {
					style: {
						fontSize: '14px',
						color: 'var(--d2l-color-ferrite)',
						fontFamily: 'Lato'
					}
				},
				plotLines: [{
					color: 'var(--d2l-color-celestine)',
					dashStyle: 'Dash',
					value: this.filter.avgTimeInContent,
					width: 1.5
				}],
				accessibility:{
					description: `${this._timeInContentText} ${
						this.localize('components.insights-time-in-content-vs-grade-card.averageTimeInContent', {
							avgTimeInContent: this.filter.avgTimeInContent
						})
					}`,
				}
			},
			yAxis: {
				title: {
					text: this._currentGradeText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '10px',
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
				tickLength: 5,
				tickWidth: 1,
				labels: {
					style: {
						fontSize: '14px',
						color: 'var(--d2l-color-ferrite)',
						fontFamily: 'Lato'
					}
				},
				plotLines: [{
					color: 'var(--d2l-color-celestine)',
					dashStyle: 'Dash',
					value: this.filter.avgGrade,
					width: 1.5
				}],
				accessibility:{
					description: `${this._currentGradeText} ${
						this.localize('components.insights-time-in-content-vs-grade-card.averageGrade', {
							avgGrade: this.filter.avgGrade
						})
					}`,
					rangeDescription: ''
				}
			},
			plotOptions: {
				series: {
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
		const that = this;
		return [
			...this._scatterSeries,
			{
				// These points have two purposes:
				// 1. They display a tool tip to summarize the quadrant.
				// 2. They are the points screen-readers interact with.
				name: 'midPoint',
				data: this._dataMidPoints.map(x => ({
					x: x[2],
					y: x[1],
					custom: {
						quadrant: x[0],
						size: this.filter.getDataForQuadrant(x[0]).length
					}
				})),
				accessibility: {
					pointDescriptionFormatter: function(point) {
						return that._descriptiveTextByQuadrant(point.custom.quadrant, point.custom.size);
					}
				},
				lineColor: 'transparent',
				marker: {
					fillColor: 'transparent',
					states: {
						hover: {
							enabled: false
						}
					}
				},
				point: {
					events: {
						click: function() {
							that.filter.toggleQuadrant(this.custom.quadrant);
						}
					}
				}
			}
		];
	}

	get _scatterSeries() {
		const that = this;
		return this._scatterData.map(s => ({
			name: s.name,
			data: s.data,
			accessibility: {
				enabled: false,
				keyboardNavigation: {
					enabled: false
				}
			},
			marker: {
				radius: 5,
				fillColor: (!this.filter.isApplied || this.filter.quadrant === s.name) ?
					'var(--d2l-color-amethyst-plus-1)' :
					'var(--d2l-color-mica)',
				symbol: 'circle'
			},
			point: {
				events: {
					// handles clicks directly on markers (the chart click handler only works on empty spaces)
					click: function() {
						that.filter.toggleQuadrant(this.series.name);
					}
				}
			}
		}));
	}

	get _scatterData() {
		return ['leftBottom', 'leftTop', 'rightTop', 'rightBottom']
			.map(quadrant => ({
				name: quadrant,
				data: this.filter.getDataForQuadrant(quadrant)
			}));
	}
}
decorate(TimeInContentVsGradeCard, {
	filter: computed,
	_dataMidPoints: computed,
	_scatterData: computed
});
customElements.define('d2l-insights-time-in-content-vs-grade-card', TimeInContentVsGradeCard);
