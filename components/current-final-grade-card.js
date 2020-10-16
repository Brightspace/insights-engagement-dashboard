import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export const CurrentFinalGradeCardFilter  = {
	id: 'd2l-insights-current-final-grade-card',
	title: 'components:insights-current-final-grade-card:currentGrade',
	filter: (record, data) => data.selectedGradesCategories.has(data.gradeCategory(record[RECORD.CURRENT_FINAL_GRADE]))
};

class CurrentFinalGradeCard extends SkeletonMixin(Localizer(MobxLitElement)) {

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
		`];
	}

	get _cardTitle() {
		return this.localize('components:insights-current-final-grade-card:currentGrade');
	}

	get _chartDescriptionTextLabel() {
		return this.localize('components:insights-current-final-grade-card:textLabel');
	}

	get _preparedHistogramData() {
		return this.data.currentFinalGrades;
	}

	get _xAxisLabel() {
		return this.localize('components:insights-current-final-grade-card:xAxisLabel');
	}

	get _yAxisLabel() {
		return this.localize('components:insights-current-final-grade-card:numberOfStudents');
	}

	setCategoryEmpty() {
		this.data.setGradesCategoryEmpty();
	}

	addToCategory(category) {
		this.data.addToGradesCategory(category);
	}

	get category() {
		return this.data.selectedGradesCategories;
	}

	get isApplied() {
		return this.data.cardFilters['d2l-insights-current-final-grade-card'].isApplied;
	}

	_valueClickHandler() {
		this.data.setApplied('d2l-insights-current-final-grade-card', true);
	}

	_colorNonSelectedPoints(seriesData, color) {
		seriesData.forEach(point => {
			if (!this.category.has(Math.ceil(point.category))) this._pointUpdateColor(point, color);
		});
	}

	_colorSelectedPoints(seriesData, color) {
		seriesData.forEach(point => {
			if (this.category.has(Math.ceil(point.category))) this._pointUpdateColor(point, color);
		});
	}

	_colorAllPoints(seriesData, color) {
		seriesData.forEach(point => this._pointUpdateColor(point, color));
	}

	_pointUpdateColor(point, colorForPoint) {
		point.update({ color: colorForPoint }, false);
	}

	_gradeBetweenText(numberOfUsers, range) {
		return this.localize('components:insights-current-final-grade-card:gradeBetween', { numberOfUsers, range });
	}

	_gradeBetweenTextSingleUser(range) {
		return this.localize('components:insights-current-final-grade-card:gradeBetweenSingleUser', { range });

	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		const options = this.chartOptions;
		if (!this.skeleton && !options.series[1].data.length) {
			return html`<div class="d2l-insights-final-grade-container">
				<div class="d2l-insights-current-final-grade-title">${this._cardTitle}</div>
				<div class="d2l-insights-summary-card-body">
					<span class="d2l-insights-empty-chart-message">
						${this.localize('components:insights-current-final-grade-card:emptyMessage')}
					</span>
				</div>
			</div>`;
		} else {
			return html`<div class="d2l-insights-final-grade-container">
				<div class="d2l-insights-current-final-grade-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
				<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${options}" ?skeleton="${this.skeleton}" ></d2l-labs-chart>
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
							that._colorNonSelectedPoints(this.series[0].data, 'var(--d2l-color-mica)');
							that._colorSelectedPoints(this.series[0].data, 'var(--d2l-color-amethyst)');
						} else {
							that.setCategoryEmpty();
							that._colorAllPoints(this.series[0].data, 'var(--d2l-color-amethyst)');
						}
						this.render(false);
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
				title: {
					text: this._xAxisLabel,
					x: -24, // needed due to compensate for width override below
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},
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
				width: '108%', // move extra space at end of x-axis out of the container
			},
			yAxis: {
				tickAmount: 4,
				title: {
					text: this._yAxisLabel,
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
								that._colorSelectedPoints(this.series.data, 'var(--d2l-color-amethyst)');
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
