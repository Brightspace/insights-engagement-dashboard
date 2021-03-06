import 'highcharts';
import { computed, decorate } from 'mobx';
import { css, html } from 'lit-element/lit-element.js';
import { ORG_UNIT, RECORD, UserTrendColorsIterator } from '../consts';
import { BEFORE_CHART_FORMAT } from './chart/chart';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { CoursesHelper } from './courses-legend';
import { filterEventQueue } from './alert-data-update';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class GradesTrendCard extends SkeletonMixin(Localizer(MobxLitElement)) {
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
			.d2l-insights-grades-trend-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-grades-trend-title {
				margin-left: 19px;
			}
		`];
	}

	get _cardTitle() {
		return this.localize('gradesTrendCard:gradesOverTime');
	}

	get _currentGradeText() {
		return this.localize('gradesTrendCard:currentGrade');
	}

	get _dateText() {
		return this.localize('gradesTrendCard:date');
	}

	get courses() {
		return CoursesHelper.getUsersCourses(this.skeleton, this._serverData, this.data, this.user);
	}

	get axeDescription() {
		return CoursesHelper.getAxeDescription(this.courses, this.selectedCourses, this);
	}

	render() {
		// NB: relying on mobx rather than lit-element properties to handle update detection: it will trigger a redraw for
		// any change to a relevant observed property of the Data object
		return html`
			<div class="d2l-insights-grades-trend-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
			<d2l-labs-chart
				.options="${this.chartOptions}"
				?skeleton="${this.skeleton}"
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
					text: this._currentGradeText,
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
					},
					point: {
						events: {
							click: function(e) {
								// e.target.series - when a user hits a keaboard key
								// e.point.series -  when a user clicks point by mouse
								that._toggleFilterEventHandler(e.target.series || e.point.series);
								const chartName = { chartName: that.localize('userDrill:course') };
								filterEventQueue.add(that.localize('alert:updatedFilter', chartName), that.axeDescription);
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
					valueSuffix: ` ${this._currentGradeText}`
				}
			},
			series: this._series
		};
	}

	get _trendData() {
		return [...this.userData.courseGrades]
			.filter(grades => this._filteredOrgUnitIds.has(grades.courseId))
			.map(grades => {
				return {
					orgUnitId: grades.courseId,
					data: grades.gradesData.map(item => [item.date, Math.floor(item.grade * 10000) / 100])
				};
			});
	}

	get _filteredOrgUnitIds() {
		const allSelectedCourses = this.data.orgUnitTree.allSelectedCourses;
		return allSelectedCourses.length !== 0 ? new Set(allSelectedCourses) : new Set(this._userOrgUnitIds);
	}

	get _serverData() {
		return this.data._data.serverData;
	}

	_orgUnitName(orgUnitId) {
		const orgUnit = this._serverData.orgUnits.find(unit => unit[ORG_UNIT.ID] === orgUnitId);

		return orgUnit ? orgUnit[ORG_UNIT.NAME] : '';
	}

	get _userOrgUnitIds() {
		const userRecords = this.data.recordsByUser.get(this.user.userId);
		if (!userRecords) return [];
		return Array.from(
			new Set(userRecords.map(record => record[RECORD.ORG_UNIT_ID]))
		);
	}

	get _series() {
		if (!this.data._data || !this.userData.courseGrades || this.userData.courseGrades.length === 0) return [{ data:[] }];
		const colors = [...UserTrendColorsIterator(0, 1, this._userOrgUnitIds.length)];
		const selected = (course) => this.selectedCourses.has(course.orgUnitId) || this.selectedCourses.size === 0;

		return this._trendData
			.map((course) => ({
				...course,
				marker:{
					enabled: course.data && course.data.length === 1
				},
				name: this._orgUnitName(course.orgUnitId),
				//if grades data are not available for some course, the colors will remain consistent
				color: selected(course) ? colors[this._userOrgUnitIds.findIndex(orgId => orgId === course.orgUnitId)] : 'var(--d2l-color-mica)',
				zIndex: selected(course) ? 1 : undefined
			}));
	}
}
decorate(GradesTrendCard, {
	_trendData: computed,
	_userOrgUnitIds: computed,
	_series: computed,
	_filteredOrgUnitIds: computed
});
customElements.define('d2l-insights-grades-trend-card', GradesTrendCard);
