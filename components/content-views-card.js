import 'highcharts';
import { computed, decorate } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { ORG_UNIT, RECORD, UserTrendColorsIterator } from '../consts';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class ContentViewsCard extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false },
			userData: { type: Object, attribute: false },
			selectedCourses: { type: Object, attribute: false },
			user: { type: Object, attribute: false }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.userData = {};
		this.selectedCourses = {
			size: 0,
			has: () => false
		};
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
			<d2l-labs-chart
				.options="${this.chartOptions}"
				?skeleton="${this.skeleton}"
				@load="${this._onChartLoad}"
			></d2l-labs-chart>`;
	}

	_toggleFilterEventHandler(series) {
		const orgUnitId = parseInt(series.userOptions.orgUnitId, 10);

		if (Number.isInteger(orgUnitId)) {
			this.selectedCourses.toggle(orgUnitId);
		}
	}

	get chartOptions() {
		const that = this;

		return {
			chart: {
				height: 260,
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
				enabled: true,
				backgroundColor: 'var(--d2l-color-ferrite)',
				borderWidth: 0,
				borderRadius: 15,
				shadow: false,
				padding: 10,

				style: {
					color: 'var(--d2l-color-white)',
					fontSize: '10px',
					fontFamily: 'Lato',
					lineHeight: '18px'
				}
			},
			xAxis: {
				startOnTick: true,
				endOnTick: true,
				type: 'datetime',
				labels: {
					formatter: function() {
						return formatDate(new Date(this.value), { format: 'short' });
					},
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
					text: this._viewCountText,
					style: {
						color: 'var(--d2l-color-ferrite)',
						fontSize: '9px',
						fontWeight: 'bold',
						fontFamily: 'Lato'
					}
				},
				max: this.isDemo ? 100 : undefined,
				tickPositions: this.isDemo ? [0, 25, 50, 75, 100] : undefined,

				tickPositioner: function() {
					return that._emptyData ? [0, 25, 50, 75, 100] : undefined;
				},
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
					},
					point: {
						events: {
							click: function(e) {
								// e.target.series - when a user hits a keaboard key
								// e.point.series -  when a user clicks point by mouse
								that._toggleFilterEventHandler(e.target.series || e.point.series);
							}
						}
					}
				}
			},
			accessibility: {
				screenReaderSection: {
					beforeChartFormat: BEFORE_CHART_FORMAT
				},
				point: {
					valuePrefix: `${this._dateText}, `,
					valueSuffix: ` ${this._viewCountText}`
				}
			},
			series: this._series
		};
	}

	get _trendData() {
		return this.userData
			.contentViews
			.map(courseData => ({
				...courseData,
				orgUnitId: courseData.orgUnitId ? Number(courseData.orgUnitId) : 0,
				data: courseData.data.map(point => ({ x: point[0], y: point[1] }))
			}))
			.filter(courseData => this._filteredOrgUnitIds.has(courseData.orgUnitId));
	}

	get _filteredOrgUnitIds() {
		const allSelectedCourses = this.data.orgUnitTree.allSelectedCourses;
		return allSelectedCourses.length !== 0 ? new Set(allSelectedCourses) : new Set(this._userOrgUnitIds);
	}

	get _userOrgUnitIds() {
		const userRecords = this.data.recordsByUser.get(this.user.userId);
		if (!userRecords) return [];
		return Array.from(
			new Set(userRecords.map(record => record[RECORD.ORG_UNIT_ID]))
		);
	}

	get _serverData() {
		return this.data._data.serverData;
	}

	_orgUnitName(orgUnitId) {
		const orgUnit = this._serverData.orgUnits.find(unit => unit[ORG_UNIT.ID] === orgUnitId);

		return orgUnit ? orgUnit[ORG_UNIT.NAME] : '';
	}

	get _emptyData() {
		return !this.data._data || !this.userData.contentViews || this._trendData.length === 0;
	}

	_onChartLoad(event) {
		this._chart = event.detail;
	}

	get _series() {
		if (this._emptyData) return [{ data:[] }];

		const colors = [...UserTrendColorsIterator(0, 1, this._userOrgUnitIds.length)];
		const selected = (course) => this.selectedCourses.has(course.orgUnitId) || this.selectedCourses.size === 0;

		return this._trendData
			.map((course) => ({
				...course,
				marker: {
					enabled: course.data && course.data.length === 1
				},
				// It is read as `Course 1, series 1 of 3 with 8 data points.`
				name: this._orgUnitName(course.orgUnitId),
				color: selected(course) ? colors[this._userOrgUnitIds.findIndex(orgId => orgId === course.orgUnitId)] : 'var(--d2l-color-mica)' }));
	}
}
decorate(ContentViewsCard, {
	_trendData: computed,
	_userOrgUnitIds: computed,
	_series: computed,
	_filteredOrgUnitIds: computed
});
customElements.define('d2l-insights-content-views-card', ContentViewsCard);
