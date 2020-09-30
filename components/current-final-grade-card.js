import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../model/data';

function or(pred1, pred2) {
	return el => pred1(el) || pred2(el);
}

export const CurrentFinalGradeCardFilter  = {
	id: 'd2l-insights-current-final-grade-card',
	title: 'components.insights-current-final-grade-card.currentGrade',
	filter: (record, data) => {
		const categories = Array.from(data.gradesCategory).slice();
		const rec = record[RECORD.CURRENT_FINAL_GRADE];
		const predicate = cat => rec => rec < (cat + 10) && rec >= cat;
		const predicateForNinetyCondition = cat => rec => rec <= (cat + 10) && rec >= cat;
		const combPred = categories.map(cat => {
			if (cat === 90) {
				return predicateForNinetyCondition(cat);
			} else {
				return predicate(cat);
			}
		}).reduce(or);
		return combPred(rec);
	}
};

class CurrentFinalGradeCard extends Localizer(MobxLitElement) {

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
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-final-grade-container {
				border-color: var(--d2l-color-mica);
				border-radius: 15px;
				border-style: solid;
				border-width: 1.5px;
				display: inline-block;
				height: 275px;
				margin-right: 10px;
				margin-top: 19.5px;
				padding: 15px;
				width: 602px;
			}

			.d2l-insights-current-final-grade-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}
		`;
	}

	get _cardTitle() {
		return this.localize('components.insights-current-final-grade-card.currentGrade');
	}

	get _numberOfStudentsText() {
		return this.localize('components.insights-current-final-grade-card.numberOfStudents');
	}

	get _chartDescriptionTextLabel() {
		return this.localize('components.insights-current-final-grade-card.textLabel');
	}

	get _preparedHistogramData() {
		return this.data.currentFinalGrades;
	}

	setCategoryEmpty() {
		this.data.setGradesCategoryEmpty();
	}

	addToCategory(category) {
		this.data.addToGradesCategory(category);
	}

	get category() {
		return this.data.gradesCategory;
	}

	get isApplied() {
		return this.data.cardFilters['d2l-insights-current-final-grade-card'].isApplied;
	}

	_valueClickHandler() {
		this.data.setApplied('d2l-insights-current-final-grade-card', true);
	}

	_colorNonSelectedPointsInMica(seriesData) {
		seriesData.forEach(point => {
			if (!this.category.has(Math.ceil(point.category))) {
				point.update({ color: 'var(--d2l-color-mica)' }, false);
			}
		});
	}

	_colorSelectedPointsInAmethyst(seriesData) {
		seriesData.forEach(point => {
			if (this.category.has(Math.ceil(point.category))) {
				point.update({ color: 'var(--d2l-color-amethyst)' }, false);
			}
		});
	}

	_gradeBetweenText(numberOfUsers, range) {
		return this.localize('components.insights-current-final-grade-card.gradeBetween', { numberOfUsers, range });
	}

	_gradeBetweenTextSingleUser(range) {
		return this.localize('components.insights-current-final-grade-card.gradeBetweenSingleUser', { range });

	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		const options = this.chartOptions;
		if (!this.data.isLoading && !options.series[1].data.length) {
			return html`<div class="d2l-insights-final-grade-container">
				<div class="d2l-insights-current-final-grade-title">${this._cardTitle}</div>
				<div class="d2l-insights-summary-card-body">
					<span class="d2l-insights-empty-chart-message">
						${this.localize('components.insights-current-final-grade-card.emptyMessage')}
					</span>
				</div>
			</div>`;
		} else {
			return html`<div class="d2l-insights-final-grade-container">
				<div class="d2l-insights-current-final-grade-title">${this._cardTitle}</div>
				<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${options}" ?loading="${this.data.isLoading}" ></d2l-labs-chart>
			</div>`;
		}
	}

	get chartOptions() {
		const that = this;

		return {
			chart: {
				height: 230,
				events: {
					render: function() {
						//after redrawing the chart as a result of updating (for example, when the user disable any of the filters),
						// we need to keep the color of the selected/nonselected bars
						if (that.isApplied) {
							that._colorNonSelectedPointsInMica(this.series[0].data);
							this.render(false);
							that._colorSelectedPointsInAmethyst(this.series[0].data);
							this.render(false);
						} else {
							that.setCategoryEmpty();
							that._colorSelectedPointsInAmethyst(this.series[0].data);
							this.render(false);
						}
					}
				}
			},
			animation: false,
			tooltip: {
				formatter: function() {
					const yCeil = Math.ceil(this.y);
					const xCeil = Math.ceil(this.x);
					if (yCeil === 1) {
						return `${that._gradeBetweenTextSingleUser(`${xCeil}-${xCeil + 10}`)}`;
					}
					return `${that._gradeBetweenText(`${yCeil}`, `${xCeil}-${xCeil + 10}`)}`;
				},
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderColor: 'var(--d2l-color-ferrite)',
				borderRadius: 12,
				style: {
					color: 'white',
				}
			},
			title: {
				text: this._cardTitle, // override default title
				style: {
					display: 'none'
				}
			},
			xAxis: {
				title: { text: '' }, // override default title
				min: 0,
				allowDecimals: false,
				alignTicks: false,
				tickWidth: 0, // remove tick marks
				tickPositions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
				floor: 0,
				ceiling: 100,
				endOnTick: true,
				labels: {
					align: 'center',
					reserveSpace: true
				},
				width: '108%',
			},
			yAxis: {
				tickAmount: 4,
				title: {
					text: this._numberOfStudentsText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '10px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},
				allowDecimals: false
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: false,
			},
			plotOptions: {
				series: {
					minPointLength: 2, // visualize 0 points
					pointStart: 0,
					animation: false,
					pointWidth: 37,
					pointPadding: 0.60,
					accessibility: {
						description: this._chartDescriptionTextLabel,
						pointDescriptionFormatter: function(point) {
							const ix = (point.index + 1) * 10,
								val = point.y;
							return `${ix - 10} to ${ix}, ${val}.`;
						}
					},
					allowPointSelect: true,
					color: 'var(--d2l-color-amethyst)',
					states: {
						select: {
							color: 'var(--d2l-color-amethyst)'
						}
					},
					point: {
						events: {
							select: function() {
								that.addToCategory(Math.ceil(this.category));
								that._valueClickHandler();
								that._colorNonSelectedPointsInMica(this.series.data);
								that._colorSelectedPointsInAmethyst(this.series.data);
							}
						}
					}
				}
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				}
			},
			series: [{
				type: 'histogram',
				animation: false,
				lineWidth: 1,
				baseSeries: 1,
				shadow: false,
				binWidth: 9.9999
			},
			{
				data: this._preparedHistogramData,
				visible: false,
			}],
		};
	}
}

customElements.define('d2l-insights-current-final-grade-card', CurrentFinalGradeCard);
