import { computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { ORG_UNIT, RECORD, UserTrendColorsIterator } from '../consts';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { classMap } from 'lit-html/directives/class-map';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';
class CoursesLegend extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			data: { type: Object, attribute: false },
			user: { type: Object, attribute: false },
			selectedCourses: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [
			super.styles, bodySmallStyles,
			css`
				:host {
					display: block;
				}
				.d2l-insights-user-course-legend {
					display: flex;
					flex-wrap: wrap;
					margin-top: 20px;
					max-width: 1200px;
				}
				.d2l-insights-user-course-legend-item {
					align-items: center;
					cursor: pointer;
					display: flex;
					margin-left: 12px;
					margin-right: 24px;
					width: 267px;
				}
				.d2l-insights-user-course-legend-item-filtered {
					opacity: 0.5;
				}
				.d2l-insights-user-course-legend-item > .d2l-insights-user-course-legend-color {
					border-radius: 10px;
					height: 20px;
					margin: 0 5px;
					width: 20px;
				}
				.d2l-insights-user-sourse-legend-name {
					color: var(--d2l-color-ferrite);
					font-size: smaller;
					font-weight: bold;
					margin: 5px 0;
					overflow: hidden;
					text-overflow: ellipsis;
					user-select: none;
					white-space: nowrap;
					width: calc(100% - 30px);
				}
				@media only screen and (max-width: 970px) {
					.d2l-insights-user-course-legend-item:nth-child(2n) {
						margin-right: 10px;
					}

					.d2l-insights-user-course-legend {
						max-width: 594px;
						width: auto;
					}
				}
				@media only screen and (min-width: 970px) and (max-width: 1275px) {
					.d2l-insights-user-course-legend-item:nth-child(3n) {
						margin-right: 10px;
					}
					.d2l-insights-user-course-legend {
						max-width: 897px;
					}
				}

				@media only screen and (min-width: 1276px) {
					.d2l-insights-user-course-legend-item:nth-child(4n) {
						margin-right: 10px;
					}
				}
			`
		];
	}

	get serverData() {
		return this.data._data.serverData;
	}

	get courses() {

		const isUsersRecord = record => record[RECORD.USER_ID] === this.user.userId;
		const recordOrgUnitId = record => record[RECORD.ORG_UNIT_ID];
		// get a unique set of orgId's then get the name of those org units.
		return Array.from(
			new Set(this.data
				.records
				.filter(isUsersRecord)
				.map(recordOrgUnitId)))
			.map(this._orgUnitInfo.bind(this));
	}

	_orgUnitInfo(orgUnitId) {
		const orgUnit = this.serverData.orgUnits.find(unit => unit[ORG_UNIT.ID] === orgUnitId);
		return {
			name: `${orgUnit[ORG_UNIT.NAME]} (Id: ${orgUnitId})`,
			orgUnitId
		};
	}

	_renderCourse(course, color) {
		const containerStyles = classMap({
			'd2l-insights-user-course-legend-item': true,
			'd2l-insights-user-course-legend-item-filtered': this.selectedCourses.selected.has(course.orgUnitId)
		});
		return html`
		<div tabindex="0" ouid="${course.orgUnitId}" class="${containerStyles}">
			<div class="d2l-insights-user-course-legend-color" style="background-color: ${color};"></div>
			<p class="d2l-insights-user-sourse-legend-name">${course.name}</p>
		</div>
		`;
	}

	_renderCourses() {
		const colors = UserTrendColorsIterator();
		return this.courses.map(course => this._renderCourse(course, colors.next().value));
	}

	//EVENTS

	_handleInteraction(e) {

		// interaction out of scope, but this will get ya started

		if (e.target.parentElement === null) return;
		const orgUnitId = e.target.getAttribute('ouid') | e.target.parentElement.getAttribute('ouid');

		this.selectedCourses.toggle(orgUnitId);
	}

	render() {
		return html`
			<!-- Use Event Delegation for the click, and direct event handling for the keyboard -->
			<div role="button" @click="${this._handleInteraction}" @keypress=${this._handleInteraction} class="d2l-insights-user-course-legend">
				${this._renderCourses()}
			</div>
		`;
	}
}

decorate(CoursesLegend,
	{
		courses: computed,
		data: observable,
	}
);

customElements.define('d2l-insights-courses-legend', CoursesLegend);
