import '@brightspace-ui/core/components/dialog/dialog';
import '@brightspace-ui/core/components/button/button';
import './expander-with-control';
import { css, html, LitElement } from 'lit-element';
import { Localizer } from '../locales/localizer';

/**
 * @property {Array} data - [{id: orgUnitId, name: orgUnitName}]
 * @property {Boolean} opened - whether or not the dialog should be opened
 */
class DefaultViewPopup extends Localizer(LitElement) {

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
		this.data = [];
		this.opened = false;
	}

	get _displayData() {
		return this.data.map((item) => {
			return this.localize('components:tree-filter:node-name', { orgUnitName: item.name, id: item.id });
		});
	}

	render() {
		const displayData = this._displayData;
		return html`
			<d2l-dialog
				?opened="${this.opened}"
				title-text="${this.localize('components:insights-default-view-popup:title')}"
					width="615"
					@d2l-dialog-close="${this._closeDialog}">

				<p class="d2l-insights-default-view-popup-description">
					${this.localize('components:insights-default-view-popup:defaultViewDescription1', { numDefaultCourses: displayData.length })}
				</p>
				<p class="d2l-insights-default-view-popup-description">
					${this.localize('components:insights-default-view-popup:defaultViewDescription2')}
				</p>

				<d2l-insights-expander-with-control
					control-expanded-text="${this.localize('components:insights-default-view-popup:collapseDefaultCourseList')}"
					control-collapsed-text="${this.localize('components:insights-default-view-popup:expandDefaultCourseList')}"
					@d2l-insights-expander-with-control-expanded="${this._resize}"
					@d2l-insights-expander-with-control-collapsed="${this._resize}">

					<ul class="d2l-insights-default-view-popup-course-list">
						${displayData.map(data => html`
							<li>${data}</li>
						`)}
					</ul>

				</d2l-insights-expander-with-control>

				<d2l-button primary slot="footer" @click="${this._closeDialog}">
					${this.localize('components:insights-default-view-popup:buttonOk')}
				</d2l-button>
			</d2l-dialog>
		`;
	}

	_resize() {
		this.shadowRoot.querySelector('d2l-dialog').resize();
	}

	_closeDialog() {
		this.opened = false;
	}
}
customElements.define('d2l-insights-default-view-popup', DefaultViewPopup);
