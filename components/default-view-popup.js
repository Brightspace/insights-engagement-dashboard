import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/button/button';
import './expander-with-control';
import { css, html, LitElement } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

/**
 * @property {Object} data - { defaultViewPopupDisplayData: [{id: orgUnitId, name: orgUnitName}], numDefaultSemesters: number }
 * @property {Boolean} opened - whether or not the dialog should be opened
 */
class DefaultViewPopup extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			data: { type: Object, attribute: false },
			opened: { type: Boolean, attribute: true, reflect: true }
		};
	}

	static get styles() {
		return css`
			.d2l-insights-default-view-popup-description {
				margin: 0;
			}

			.d2l-insights-default-view-popup-course-list {
				margin: 0;
			}
		`;
	}

	constructor() {
		super();
		this.data = {
			defaultViewPopupDisplayData: [],
			numDefaultSemesters: 0
		};
		this.opened = false;
		// when the pop-up is rendered the first time it is hidden and it can't properly calculate the height
		// of the pop-up due to data is not received yet and not all components placed into the content.
		// In order to calculate pop-up's height right, we should render all possible components for the first time
		this._firstRender = true;
	}

	get _displayData() {
		return this.data.defaultViewPopupDisplayData.map((item) => {
			return this.localize('treeFilter:nodeName', { orgUnitName: item.name, id: item.id });
		});
	}

	get _defaultSemestersCount() {
		return this.data.numDefaultSemesters;
	}

	firstUpdated() {
		this._firstRender = false;
	}

	render() {
		const displayData = this._displayData;
		return html`
			<d2l-dialog
				?opened="${this.opened}"
				title-text="${this.localize('defaultViewPopup:title')}"
					width="615"
					@d2l-dialog-close="${this._closeDialog}">

				${this._renderResultsDescription({ displayData, numDefaultCourses: displayData.length, numDefaultSemesters: this._defaultSemestersCount })}

				<p class="d2l-insights-default-view-popup-description">
					${this.localize('defaultViewPopup:promptUseFilters')}
				</p>

				${this._renderExpandableCoursesList(displayData)}

				<d2l-button primary slot="footer" @click="${this._closeDialog}">
					${this.localize('defaultViewPopup:buttonOk')}
				</d2l-button>
			</d2l-dialog>
		`;
	}

	_renderResultsDescription({ displayData, numDefaultCourses, numDefaultSemesters }) {
		if (displayData.length) {
			return html`
				<p class="d2l-insights-default-view-popup-description">
				${this.localize('defaultViewPopup:resultsFromNRecentCourses', { numDefaultCourses })}
				</p>`;
		}

		return html`
			<p class="d2l-insights-default-view-popup-description">
			${this.localize('defaultViewPopup:emptyResultsFromNRecentSemesters', { numDefaultSemesters })}
			</p>`;
	}

	_renderExpandableCoursesList(displayData) {
		if (!displayData.length && !this._firstRender) {
			return html``;
		}

		return html`
			<d2l-insights-expander-with-control
				control-expanded-text="${this.localize('defaultViewPopup:collapseDefaultCourseList')}"
				control-collapsed-text="${this.localize('defaultViewPopup:expandDefaultCourseList')}"
				@d2l-insights-expander-with-control-expanded="${this._resize}"
				@d2l-insights-expander-with-control-collapsed="${this._resize}">

				<ul class="d2l-insights-default-view-popup-course-list">
					${displayData.map(data => html`
						<li>${data}</li>
					`)}
				</ul>

			</d2l-insights-expander-with-control>`;
	}

	_resize() {
		this.shadowRoot.querySelector('d2l-dialog').resize();
	}

	_closeDialog() {
		this.opened = false;
	}
}
customElements.define('d2l-insights-default-view-popup', DefaultViewPopup);
