import { action, computed, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { ORG_UNIT, RECORD, UserTrendColorsIterator } from '../consts';
import { bodySmallStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { classMap } from 'lit-html/directives/class-map';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';
import { UrlState } from '../model/urlState';

window.colors = UserTrendColorsIterator;
export class SelectedCourses {
	constructor() {
		this.selected = new Set();
		this.urlState = new UrlState(this);
	}

	filter(record) {
		return !this.selected.has(record[RECORD.ORG_UNIT_ID]);
	}

	toggle(value) {
		if (this.selected.has(value)) {
			this.selected.delete(value);
		}
		else {
			this.selected.add(value);
		}
	}

	has(value) {
		return this.selected.has(value);
	}

	get size() {
		return this.selected.size;
	}

	get isEmpty() {
		return this.selected.size === 0;
	}

	set(values) {
		this.selected = new Set();
		values.forEach(value => this.selected.add(value));
	}

	//for Urlstate
	get persistenceKey() {
		return 'clf';
	}

	get persistenceValue() {
		if (this.selected.size === 0) return '';
		return [...this.selected].join(',');
	}

	set persistenceValue(value) {
		if (value === '') {
			this.selected.clear();
			return;
		}
		const newValues = value.split(',').map(category => Number(category));
		this.set(newValues);
	}
}
decorate(SelectedCourses, {
	selected: observable,
	toggle: action,
});
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
					margin-bottom: 10px;
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

		if (this.skeleton) return new Array(20).fill({ orgUnitId: -1, name: '&nbsp' });

		const recordOrgUnitId = record => record[RECORD.ORG_UNIT_ID];
		const orgUnitInfo = orgUnitId => {
			const orgUnit = this.serverData.orgUnits.find(unit => unit[ORG_UNIT.ID] === orgUnitId);
			return {
				name: `${orgUnit[ORG_UNIT.NAME]} (Id: ${orgUnitId})`,
				orgUnitId
			};
		};

		const userRecords = this.data.recordsByUser.get(this.user.userId);
		if (!userRecords) return [];
		// get a unique set of orgId's then get the name of those org units.
		return Array.from(
			new Set(userRecords.map(recordOrgUnitId))
		).map(orgUnitInfo);
	}

	//EVENTS

	_handleInteraction(e) {
		if (e.target.parentElement === null) return;
		const orgUnitId = e.target.getAttribute('data-ouid') || e.target.parentElement.getAttribute('data-ouid');
		this.selectedCourses.toggle(Number(orgUnitId));
	}

	// RENDERERS

	_isEnabled(orgUnitId) {
		return this.selectedCourses.has(orgUnitId);
	}

	_renderCourse(course, color) {
		const containerStyles = classMap({
			'd2l-insights-user-course-legend-item': true,
			'd2l-insights-user-course-legend-item-filtered': !this.skeleton && (!this.selectedCourses.isEmpty && !this.selectedCourses.has(course.orgUnitId)),
			'd2l-skeletize': this.skeleton,
		});
		return html`
			<div
				role="button"
				aria-pressed=${!this._isEnabled(course.orgUnitId)}
				tabindex="0"
				data-ouid="${course.orgUnitId}"
				class="${containerStyles}"
			>
				<div class="d2l-insights-user-course-legend-color" style="background-color: ${color};"></div>
				<p class="d2l-insights-user-sourse-legend-name">${course.name}</p>
			</div>
		`;
	}

	_renderCourses() {
		const colors = UserTrendColorsIterator(0, 1, this.courses.length);
		return this.courses.map(course => this._renderCourse(course, colors.next().value));
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
		user: observable,
		skeleton: observable,
	}
);

customElements.define('d2l-insights-courses-legend', CoursesLegend);
