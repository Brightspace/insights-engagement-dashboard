import './expand-collapse-content-TEST-COPY';
import '@brightspace-ui/core/components/button/button-icon';

import { css, html, LitElement } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

/**
 * @property {String} controlExpandedText - The text to display in the control div when the control is expanded
 * @property {String} controlCollapsedText - The text to display in the control div when the control is collapsed
 * @property {Boolean} expanded - whether the content is expanded or not
 */
class ExpanderWithControl extends RtlMixin(Localizer(LitElement)) {

	static get properties() {
		return {
			controlExpandedText: { type: String, attribute: 'control-expanded-text' },
			controlCollapsedText: { type: String, attribute: 'control-collapsed-text' },
			expanded: { type: Boolean, attribute: true, reflect: true }
		};
	}

	static get styles() {
		return css`
			.d2l-insights-expand-collapse-control {
				align-items: center;
				display: flex;
				justify-content: space-between;
				margin: 1em 0 0.5em 0;
			}

			.d2l-insights-expand-collapse-control-button {
				margin-left: 10px;
				margin-right: 0;
			}

			.d2l-insights-expand-collapse-control-button[dir="rtl"] {
				margin-left: 0;
				margin-right: 10px;
			}

			.d2l-insights-expand-collapse-control-text {
				color: var(--d2l-color-celestine);
				display: inline-flex;
				margin: 0;
			}
		`;
	}

	constructor() {
		super();
		this.controlExpandedText = '';
		this.controlCollapsedText = '';
		this.expanded = false;
	}

	render() {
		const controlText = this.expanded ? this.controlExpandedText : this.controlCollapsedText;

		// having events be handled on the div makes the whole div clickable, as specified in the spec
		// the div's click handler also handles any events fired by the d2l-button-icon, including Enter
		// and Spacebar keypress events.
		// Note: when Enter/Spacebar is pressed on a focused button, it fires a KeyboardEvent, as well as a MouseEvent
		return html`
			<div
				role="button"
				class="d2l-insights-expand-collapse-control"
				@click="${this._toggleExpanded}">

				<p class="d2l-insights-expand-collapse-control-text">${ controlText }</p>
				<d2l-button-icon
					class="d2l-insights-expand-collapse-control-button"
					icon="tier1:${ this.expanded ? 'arrow-collapse' : 'arrow-expand' }"
					aria-label="${ controlText }"
					aria-expanded="${this.expanded}">
				</d2l-button-icon>
			</div>

			<d2l-expand-collapse-content
				?expanded="${this.expanded}"
				@d2l-expand-collapse-content-expand="${this._onExpanded}"
				@d2l-expand-collapse-content-collapse="${this._onCollapsed}">
				<slot></slot>
			</d2l-expand-collapse-content>
		`;
	}

	_onExpanded(event) {
		event.detail.expandComplete.then(() => {
			this.dispatchEvent(new Event('d2l-insights-expander-with-control-expanded'));
		});
	}

	_onCollapsed(event) {
		event.detail.collapseComplete.then(() => {
			this.dispatchEvent(new Event('d2l-insights-expander-with-control-collapsed'));
		});
	}

	_toggleExpanded() {
		this.expanded = !this.expanded;
	}
}
customElements.define('d2l-insights-expander-with-control', ExpanderWithControl);
