import '@brightspace-ui/core/components/button/button';
import { css, html, LitElement } from 'lit-element/lit-element';

class ErrorMessage extends LitElement {

	static get properties() {
		return {
			// possible types: link, button, default
			type: { type: String, attribute: true },
			text: { type: String, attribute: true },
			linkText: { type: String, attribute: 'link-text' },
			href: { type: String, attribute: true },
			buttonText: { type: String, attribute: 'button-text' }
		};
	}

	static get styles() {
		return [css`
			:host {
				display: inline-block;
				padding-top: 20px;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-insights-message-container-body {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-gypsum);
				border-radius: 8px;
				color: var(--d2l-color-ferrite);
				display: flex;
				margin-bottom: 20px;
				padding: 40px;
				width: 73vw;
			}

			.d2l-insights-message-container-body.d2l-insights-message-noResultsAvailable {
				flex-direction: column;
			}

			.d2l-insights-message-container-value {
				word-wrap: break-word;
			}

			.d2l-insights-message-container-body.d2l-insights-message-noResultsAvailable > d2l-button {
				margin-top: 20px;
				width: 200px;
			}
		`];
	}

	render() {
		switch (this.type) {
			case 'link':
				return html`
					<div class="d2l-insights-message-container-body">
						<span class="d2l-insights-message-container-value">
							${this.text}
							<a href="${this.href}" target="_blank">${this.linkText}</a>
						</span>
					</div>
				`;
			case 'button':
				return html`
					<div class="d2l-insights-message-container-body d2l-insights-message-noResultsAvailable">
						<span class="d2l-insights-message-container-value">${this.text}</span>
						<d2l-button primary slot="footer" @click="${this._handleButtonClick}">${this.buttonText}</d2l-button>
					</div>
				`;
			default:
				return html`
					<div class="d2l-insights-message-container-body">
						<span class="d2l-insights-message-container-value">${this.text}</span>
					</div>
				`;
		}
	}

	_handleButtonClick() {
		this.dispatchEvent(new Event('d2l-insights-error-message-button-click'));
	}
}
customElements.define('d2l-insights-error-message', ErrorMessage);
