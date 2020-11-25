import './card-overlay';
import 'highcharts';
import { computed, decorate } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { CategoryFilter } from '../model/categoryFilter';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { RECORD } from '../consts';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';
import { UrlState } from '../model/urlState';

const filterId = 'd2l-insights-discussion-activity-card';

export class DiscussionActivityFilter extends CategoryFilter {
	constructor() {
		super(
			filterId,
			'components.insights-discussion-activity-card.cardTitle',
			record => [...this.selectedCategories].some(category => record[category] > 0),
			'daf'
		);
		this._urlState = new UrlState(this);
	}

	//for Urlstate
	get persistenceValue() {
		if (this.selectedCategories.size === 0) return '';
		return [...this.selectedCategories].join(',');
	}

	set persistenceValue(value) {
		if (value === '') {
			this.selectedCategories.clear();
			return;
		}
		const categories = value.split(',').map(category => Number(category));
		this.selectedCategories.clear();
		categories.forEach(category => this.selectCategory(category));
	}
}

class DiscussionActivityCard extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [super.styles, bodyStandardStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-summary-discussion-activity-card {
				border-color: var(--d2l-color-mica);
				border-radius: 15px;
				border-style: solid;
				border-width: 1.5px;
				display: flex;
				flex-direction: column;
				height: 121px;
				margin-top: 10px;
				padding: 15px 4px;
				position: relative;
				width: 280px;
			}

			.d2l-insights-discussion-activity-card-body {
				align-items: center;
				display: flex;
				height: 100%;
				margin-bottom: 25px;
			}

			.d2l-insights-discussion-activity-card-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}
		`];
	}

	get filter() {
		return this.data.getFilter(filterId);
	}

	get _cardTitle() {
		return this.localize('components.insights-discussion-activity-card.cardTitle');
	}

	get _legendLabels() {
		return [
			this.localize('components.insights-discussion-activity-card.threads'),
			this.localize('components.insights-discussion-activity-card.replies'),
			this.localize('components.insights-discussion-activity-card.reads')
		];
	}

	// @computed
	get _discussionActivityStats() {
		let threadSum, replySum, readSum;
		threadSum = replySum = readSum = 0;
		this.data.withoutFilter(filterId).records.forEach(record => {
			threadSum += record[RECORD.DISCUSSION_ACTIVITY_THREADS];
			replySum += record[RECORD.DISCUSSION_ACTIVITY_REPLIES];
			readSum += record[RECORD.DISCUSSION_ACTIVITY_READS];
		});
		return { threadSum, replySum, readSum };
	}

	get _chartDescriptionTextLabel() {
		return this.localize('components.insights-discussion-activity-card.textLabel');
	}

	toolTipTextThreads(numberOfUsers) {
		return this.localize('components.insights-discussion-activity-card.toolTipThreads', { numberOfUsers });
	}

	toolTipTextReplies(numberOfUsers) {
		return this.localize('components.insights-discussion-activity-card.toolTipReplies', { numberOfUsers });
	}

	toolTipTextReads(numberOfUsers) {
		return this.localize('components.insights-discussion-activity-card.toolTipReads', { numberOfUsers });
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`<div class="d2l-insights-summary-discussion-activity-card">
			<div class="d2l-insights-discussion-activity-card-title d2l-body-standard">${this._cardTitle}</div>
			<div class="d2l-insights-discussion-activity-card-body">
				<d2l-labs-chart
					.options="${this.chartOptions}"
					.globalOptions="${this.globalHighchartsOptions}"
					?skeleton="${this.skeleton}"
					do-not-use-overlay
				>
				</d2l-labs-chart>
			</div>
			<d2l-insights-card-overlay ?skeleton="${this.skeleton}"></d2l-insights-card-overlay>
		</div>`;
	}

	get chartOptions() {
		const that = this;
		return {
			chart: {
				type: 'pie',
				height: 100,
				width: 245
			},
			title: {
				text: this._cardTitle, // override default title
				style: {
					display: 'none'
				}
			},
			plotOptions: {
				pie: {
					size: 80,
					colors: ['var(--d2l-color-amethyst-plus-1)', 'var(--d2l-color-zircon-plus-1)', 'var(--d2l-color-zircon)'],
					borderWidth: 1.5,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					point: {
						events: {
							legendItemClick: function(e) {
								const point = this;
								that.filter.toggleCategory(point.id);
								e.preventDefault();
							}
						}
					},
					showInLegend: true,
					slicedOffset: 7
				},
				series: {
					point: {
						events: {
							click: function() {
								const point = this;
								that.filter.toggleCategory(point.id);
							}
						}
					},
					states: {
						hover: {
							enabled: true,
							halo: {
								size: 0
							}
						},
						inactive: {
							enabled: false
						}
					}
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				itemMarginBottom: 15,
				itemStyle: {
					fontSize: '14px',
					fontFamily: 'Lato'
				},
				symbolRadius: 0,
				margin: 20,
				navigation: {
					enabled: false
				}
			},
			series: {
				colorByPoint: true,
				data: [{
					name: that._legendLabels[0],
					y: that._discussionActivityStats.threadSum,
					id: RECORD.DISCUSSION_ACTIVITY_THREADS,
					unselectedColor: 'var(--d2l-color-tungsten)'
				}, {
					name: that._legendLabels[1],
					y: that._discussionActivityStats.replySum,
					id: RECORD.DISCUSSION_ACTIVITY_REPLIES,
					unselectedColor: 'var(--d2l-color-gypsum)'
				}, {
					name: that._legendLabels[2],
					y: that._discussionActivityStats.readSum,
					id: RECORD.DISCUSSION_ACTIVITY_READS,
					unselectedColor: 'var(--d2l-color-mica)'
				}].map(slice => {
					const selected = that.filter.selectedCategories.has(slice.id);
					return Object.assign(slice, {
						selected,
						sliced: selected,
						color: (that.filter.isApplied && !selected) ? slice.unselectedColor : undefined
					});
				}),
				accessibility: {
					description: that._chartDescriptionTextLabel,
					pointDescriptionFormatter: function(point) {
						const ix = that._legendLabels[point.index];
						return `${ix}, ${point.y}.`;
					}
				}
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				}
			},
			tooltip: {
				formatter: function() {
					const seriesIndex = that._legendLabels.indexOf(this.key);
					if (seriesIndex === 0) {
						return that.toolTipTextThreads(this.point.y);
					} else if (seriesIndex === 1) {
						return that.toolTipTextReplies(this.point.y);
					}
					return that.toolTipTextReads(this.point.y);
				},
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderColor: 'var(--d2l-color-ferrite)',
				borderRadius: 12,
				hideDelay: 0,
				style: {
					color: 'white',
				},
				followPointer: false,
				width: 40
			},
			credits: {
				enabled: false,
			},
		};
	}

	get globalHighchartsOptions() {
		return {
			lang: {
				accessibility: {
					legend: {
						// highcharts will substitute the actual item name, so we pass the placeholder to localize()
						legendItem: this.localize('components.insights-discussion-activity-card.legendItem', { itemName: '{itemName}' }),
						legendLabel: this.localize('components.insights-discussion-activity-card.legendLabel')
					}
				}
			}
		};
	}
}

decorate(DiscussionActivityCard, {
	_discussionActivityStats: computed
});

customElements.define('d2l-insights-discussion-activity-card', DiscussionActivityCard);
