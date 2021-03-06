import 'highcharts';
import { computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { filterEventQueue } from './alert-data-update';
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

	get title() { return 'timeInContentVsGradeCard:timeInContentVsGrade'; }

	calculateQuadrant(tic, grade) {
		// accept either a record or coordinates
		if (Array.isArray(tic)) {
			const record = tic;
			if (record[RECORD.CURRENT_FINAL_GRADE] === null) return null;
			tic = Math.floor(record[RECORD.TIME_IN_CONTENT] / 60);
			grade = record[RECORD.CURRENT_FINAL_GRADE];
		}

		let quadrant;
		// this function gets called in a loop, so avoiding the tiny overhead of multiple mobx gets
		// per call on these is worthwhile
		const avgTimeInContent = this.avgTimeInContent;
		const avgGrade = this.avgGrade;
		if (tic < avgTimeInContent && grade < avgGrade) quadrant = 'leftBottom';
		else if (tic <= avgTimeInContent && grade >= avgGrade) quadrant = 'leftTop';
		else if (tic > avgTimeInContent && grade > avgGrade) quadrant = 'rightTop';
		else quadrant = 'rightBottom';
		return quadrant;
	}

	getDataForQuadrant(quadrant) {
		const fullData = this.tiCVsGrades.filter(r => this.calculateQuadrant(r[TIC], r[GRADE]) === quadrant);

		if (fullData.length <= 1000) return { data: fullData, size: fullData.length };

		// If there are 50k data points, it takes several seconds to render them.
		// The highcharts boost module seems not to have all the features we need, so we reduce the number of data
		// points by rounding and coalescing. Note that the highstock module can also do data grouping, so that
		// could be investigated in future.
		// The rounding here should have little effect on UX because we only allow interaction with the quadrants.
		// Round grades to 2% increments; round tic to 15 minute intervals
		const roundedData = fullData.map(([tic, grade]) => [Math.floor(tic / 15) * 15, Math.floor(grade / 2) * 2]);
		// now drop duplicates
		const sorted = roundedData.sort(([tic1, grade1], [tic2, grade2]) => (tic1 === tic2 ? grade1 - grade2 : tic1 - tic2));
		let [lastTic, lastGrade] = sorted[0];
		const grouped = [sorted[0]];
		for (let i = 1; i < sorted.length; i++) {
			const [tic, grade] = sorted[i];
			if (tic === lastTic && grade === lastGrade) continue;
			grouped.push(sorted[i]);
			[lastTic, lastGrade] = sorted[i];
		}

		return { data: grouped, size: fullData.length };
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

	descriptiveTitle(localizer) {
		switch (this.quadrant) {
			case 'rightTop' :
				return `${localizer(this.title)}:  ${localizer('timeInContentVsGradeCard:highTimeHighGrade')}`;
			case 'rightBottom' :
				return `${localizer(this.title)}:  ${localizer('timeInContentVsGradeCard:highTimeLowGrade')}`;
			case 'leftTop' :
				return `${localizer(this.title)}:  ${localizer('timeInContentVsGradeCard:lowTimeHighGrade')}`;
			case 'leftBottom' :
				return `${localizer(this.title)}:  ${localizer('timeInContentVsGradeCard:lowTimeLowGrade')}`;
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
				height: 285px;
				margin-inline-end: 12px;
				margin-top: 10px;
				padding: 15px 4px;
				width: 583px;
			}

			@media only screen and (max-width: 615px) {
				:host {
					margin-inline-end: 0;
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
		return this.localize('timeInContentVsGradeCard:timeInContentVsGrade');
	}

	get _currentGradeText() {
		return this.localize('timeInContentVsGradeCard:currentGrade');
	}

	get _timeInContentText() {
		return this.localize('timeInContentVsGradeCard:timeInContentLong');
	}

	get _dataMidPoints() {
		const maxTimeInContent = this.filter.tiCVsGrades.reduce((max, arr) => {
			return Math.max(max, arr[0]);
		}, -Infinity);
		const leftTic = this.filter.avgTimeInContent / 2;
		const rightTic = (maxTimeInContent + this.filter.avgTimeInContent) / 2;
		const bottomGrade = this.filter.avgGrade / 2;
		const topGrade = (100 + this.filter.avgGrade) / 2;
		return [['leftBottom', leftTic, bottomGrade],
			['leftTop', leftTic, topGrade],
			['rightBottom', rightTic, bottomGrade],
			['rightTop', rightTic, topGrade]];
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	_descriptiveTextByQuadrant(quadrant, numberOfUsers) {
		const quadrantTerm = `timeInContentVsGradeCard:${quadrant}`;
		return this.localize(quadrantTerm, { numberOfUsers });
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`
			<div class="d2l-insights-time-in-content-vs-grade-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${this.chartOptions}" ?skeleton="${this.skeleton}"></d2l-labs-chart>`;
	}

	getAxeDescription(quadrant) {
		const chartName = { chartName : this.localize('timeInContentVsGradeCard:timeInContentVsGrade') };
		if (!this.filter.isApplied) return this.localize('alert:axeNotFiltering', chartName);

		const options = { category: '' };

		switch (quadrant) {
			case 'rightTop':
				options.category = this.localize('timeInContentVsGradeCard:highTimeHighGrade');
				break;
			case 'rightBottom':
				options.category = this.localize('timeInContentVsGradeCard:highTimeLowGrade');
				break;
			case 'leftTop':
				options.category = this.localize('timeInContentVsGradeCard:lowTimeHighGrade');
				break;
			case 'leftBottom':
				options.category = this.localize('timeInContentVsGradeCard:lowTimeLowGrade');
				break;
		}
		return this.localize('alert:axeDescription', options);
	}

	get chartOptions() {
		const that = this;
		return {
			chart: {
				type: 'scatter',
				height: 260,
				width: 583,
				events: {
					click: function(event) {
						const quadrant = that.filter.calculateQuadrant(Math.floor(event.xAxis[0].value), Math.floor(event.yAxis[0].value));
						that.filter.toggleQuadrant(quadrant);
						const chartName = { chartName: that.localize('timeInContentVsGradeCard:timeInContentVsGrade') };
						filterEventQueue.add(
							that.localize('alert:updatedFilter', chartName),
							that.getAxeDescription(quadrant)
						);
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
						this.localize('timeInContentVsGradeCard:averageTimeInContent', {
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
						this.localize('timeInContentVsGradeCard:averageGrade', {
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
		const scatterData = this._scatterData;
		return [
			...this._scatterSeries,
			{
				// These points have two purposes:
				// 1. They display a tool tip to summarize the quadrant.
				// 2. They are the points screen-readers interact with.
				name: 'midPoint',
				data: this._dataMidPoints.map(x => ({
					x: x[1],
					y: x[2],
					custom: {
						quadrant: x[0],
						size: scatterData[x[0]].size
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
		const quadrants = this._scatterData;
		return Object.keys(quadrants).map(s => ({
			name: s,
			data: quadrants[s].data,
			accessibility: {
				enabled: false,
				keyboardNavigation: {
					enabled: false
				}
			},
			marker: {
				radius: 5,
				fillColor: (!this.filter.isApplied || this.filter.quadrant === s) ?
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
		const quadrants = {};
		['leftBottom', 'leftTop', 'rightTop', 'rightBottom']
			.forEach(quadrant => quadrants[quadrant] = this.filter.getDataForQuadrant(quadrant));
		return quadrants;
	}
}
decorate(TimeInContentVsGradeCard, {
	filter: computed,
	_dataMidPoints: computed,
	_scatterData: computed
});
customElements.define('d2l-insights-time-in-content-vs-grade-card', TimeInContentVsGradeCard);
