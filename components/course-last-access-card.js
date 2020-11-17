import { computed, decorate } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { CategoryFilter } from '../model/categoryFilter';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

const filterId = 'd2l-insights-course-last-access-card';

function lastAccessDateBucket(record) {
	const courseLastAccessDateRange = record[RECORD.COURSE_LAST_ACCESS] === null
		? -1
		: Date.now() - record[RECORD.COURSE_LAST_ACCESS];
	const fourteenDayMillis = 1209600000;
	const sevenDayMillis = 604800000;
	const fiveDayMillis = 432000000;
	const threeDayMillis = 259200000;
	const oneDayMillis = 86400000;
	if (courseLastAccessDateRange < 0) {
		return 0;
	}
	if (courseLastAccessDateRange >= fourteenDayMillis) {
		return 1;
	}
	if (courseLastAccessDateRange <= oneDayMillis) {
		return 6;
	}
	if (courseLastAccessDateRange <= threeDayMillis) {
		return 5;
	}
	if (courseLastAccessDateRange <= fiveDayMillis) {
		return 4;
	}
	if (courseLastAccessDateRange <= sevenDayMillis) {
		return 3;
	}
	if (courseLastAccessDateRange <= fourteenDayMillis) {
		return 2;
	}
}

export class CourseLastAccessFilter extends CategoryFilter {
	constructor() {
		super(
			filterId,
			'components.insights-course-last-access-card.courseAccess',
			record => this.selectedCategories.has(lastAccessDateBucket(record))
		);
	}
}

class CourseLastAccessCard extends SkeletonMixin(Localizer(MobxLitElement)) {

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
			.d2l-insights-course-last-access-container {
				border-color: var(--d2l-color-mica);
				border-radius: 15px;
				border-style: solid;
				border-width: 1.5px;
				display: inline-block;
				height: 275px;
				margin-top: 10px;
				padding: 15px 4px;
				width: 581px;
			}

			@media screen and (max-width: 615px) {
				.d2l-insights-course-last-access-container {
					margin-right: 0;
				}
			}

			.d2l-insights-course-last-access-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-course-last-access-title {
				margin-left: 19px;
			}
		`];
	}

	get _cardTitle() {
		return this.localize('components.insights-course-last-access-card.courseAccess');
	}

	get _chartDescriptionTextLabel() {
		return this.localize('components.insights-course-last-access-card.textLabel');
	}

	get _horizontalLabel() {
		return this.localize('components.insights-course-last-access-card.numberOfUsers');
	}

	get _verticalLabel() {
		return this.localize('components.insights-course-last-access-card.lastDateSinceAccess');
	}

	get _preparedBarChartData() {
		// return an array of size 7, each element mapping to a category on the course last access bar chart
		const dateBucketCounts = [0, 0, 0, 0, 0, 0, 0];
		this.data
			.withoutFilter(filterId)
			.records
			.forEach(record => dateBucketCounts[ lastAccessDateBucket(record) ]++);
		return dateBucketCounts;
	}

	get _colours() {
		if (!this.isApplied) return ['var(--d2l-color-celestine)'];

		return [0, 1, 2, 3, 4, 5, 6]
			.map(category =>
				(this.category.has(category) ?
					'var(--d2l-color-celestine)' :
					'var(--d2l-color-mica)')
			);
	}

	get _accessibilityLessThanOneLabel() {
		return this.localize('components.insights-course-last-access-card.accessibilityLessThanOne');
	}

	get _cardCategoriesText() {
		return [
			this.localize('components.insights-course-last-access-card.never'),
			this.localize('components.insights-course-last-access-card.moreThanFourteenDaysAgo'),
			this.localize('components.insights-course-last-access-card.sevenToFourteenDaysAgo'),
			this.localize('components.insights-course-last-access-card.fiveToSevenDaysAgo'),
			this.localize('components.insights-course-last-access-card.threeToFiveDaysAgo'),
			this.localize('components.insights-course-last-access-card.oneToThreeDaysAgo'),
			this.localize('components.insights-course-last-access-card.lessThanOneDayAgo')
		];
	}

	_cardTooltipText(numberOfUsers) {
		return [
			this.localize('components.insights-course-last-access-card.tooltipNeverAccessed', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.tooltipMoreThanFourteenDays', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.toolTipSevenToFourteenDays', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.toolTipFiveToSevenDays', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.toolTipThreeToFiveDays', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.toolTipOneToThreeDays', { numberOfUsers }),
			this.localize('components.insights-course-last-access-card.toolTipLessThanOneDay', { numberOfUsers })
		];
	}

	get _cardTooltipTextSingleUser() {
		return [
			this.localize('components.insights-course-last-access-card.tooltipNeverAccessedSingleUser'),
			this.localize('components.insights-course-last-access-card.tooltipMoreThanFourteenDaysSingleUser'),
			this.localize('components.insights-course-last-access-card.toolTipSevenToFourteenDaysSingleUser'),
			this.localize('components.insights-course-last-access-card.toolTipFiveToSevenDaysSingleUser'),
			this.localize('components.insights-course-last-access-card.toolTipThreeToFiveDaysSingleUser'),
			this.localize('components.insights-course-last-access-card.toolTipOneToThreeDaysSingleUser'),
			this.localize('components.insights-course-last-access-card.toolTipLessThanOneDaySingleUser')
		];
	}

	get isApplied() {
		return this.filter.isApplied;
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	get category() {
		return this.filter.selectedCategories;
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`<div class="d2l-insights-course-last-access-container">
			<div class="d2l-insights-course-last-access-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart class="d2l-insights-summary-card-body" .options="${this.chartOptions}" ?skeleton="${this.skeleton}"></d2l-labs-chart>
		</div>`;
	}

	get chartOptions() {
		const that = this;
		return {
			chart: {
				type: 'bar',
				height: '250px',
				width: 581
			},
			tooltip: {
				formatter: function() {
					if (this.point.y === 1) {
						return `${that._cardTooltipTextSingleUser[this.point.x]}`;
					}
					return `${that._cardTooltipText(this.point.y)[this.point.x]}`;
				},
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderColor: 'var(--d2l-color-ferrite)',
				borderRadius: 12,
				style: {
					color: 'white',
				}
			},
			title: {
				text: this._cardTitle,
				style: {
					display: 'none'
				}
			},
			xAxis: { // axis flipped for this chart
				title: {
					text: this._verticalLabel,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '10px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					},
					margin: 25
				},
				labels: {
					align: 'right',
					reserveSpace: true,
					style: {
						fontSize: '12px',
						fontFamily: 'Lato'
					}
				},
				width: '108%',
				categories: this._cardCategoriesText
			},
			yAxis: {
				tickAmount: 5,
				title: {
					text: this._horizontalLabel,
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
					pointWidth: 16,
					pointPadding: 0.60,
					accessibility: {
						description: this._chartDescriptionTextLabel,
						pointDescriptionFormatter: function(point) {
							const val = point.y;
							if (point.x === 6) {
								return `${that._accessibilityLessThanOneLabel}, ${that._horizontalLabel}, ${val}.`;
							}
							return `${that._cardCategoriesText[point.x]}, ${that._horizontalLabel}, ${val}.`;
						}
					},
					colorByPoint: true,
					colors: this._colours,
					point: {
						events: {
							click: function() {
								that.filter.toggleCategory(this.index);
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
				// Highcharts modifies this array, which MobX has cached, so make a copy to be safe
				data: [...this._preparedBarChartData]
			}]
		};
	}
}
decorate(CourseLastAccessCard, {
	filter: computed,
	_preparedBarChartData: computed
});
customElements.define('d2l-insights-course-last-access-card', CourseLastAccessCard);
