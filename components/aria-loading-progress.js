import { css, html } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';

class AriaLoadingProgress extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			data: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-aria-loading-progress {
				left: -100vw;
				position: absolute;
			}
		`;
	}

	render() {
		// loading-start-message is rendered as text node that forces FF to read it, otherwise FF skips it
		// when loading is finished the code replaces `div` with text node to `div` with aria-label to
		// to hide loading-finish-message from screen reader (from navigation with arrow keys)
		return html`
			<div class="d2l-insights-aria-loading-progress" aria-live="assertive">
				${this.data.isLoading
					? html`<div role="alert">${this.localize('ariaLoadingProgress:loadingStart')}</div>`
					: html`<div role="alert" aria-label="${this.localize('ariaLoadingProgress:loadingFinish')}"></div>`}
			</div>`;
	}
}
customElements.define('d2l-insights-aria-loading-progress', AriaLoadingProgress);
