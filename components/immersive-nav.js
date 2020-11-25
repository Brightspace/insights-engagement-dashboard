import 'd2l-navigation/d2l-navigation-immersive';
import 'd2l-navigation/d2l-navigation-link-back';

import { css, html, LitElement } from 'lit-element/lit-element';

// Extends the standard immersive nav to resize the back link on small screens
class InsightsImmersiveNav extends LitElement {
	static get properties() {
		return {
			href: { type: String, attribute: true },
			mainText: { type: String, attribute: 'main-text' },
			backText: { type: String, attribute: 'back-text' },
			backTextShort: { type: String, attribute: 'back-text-short' } // optional - will default to backText if unspecified
		};
	}

	static get styles() {
		return [css`
			.d2l-insights-immersive-nav-title {
				align-items: center;
				display: flex;
			}

			.d2l-insights-link-back-default {
				display: inline-block;
			}

			.d2l-insights-link-back-responsive {
				display: none;
			}

			@media screen and (max-width: 615px) {
				.d2l-insights-link-back-default {
					display: none;
				}

				.d2l-insights-link-back-responsive {
					display: inline-block;
				}
			}
		`];
	}

	constructor() {
		super();
		this.href = '';
		this.mainText = '';
		this.backText = '';
		this.backTextShort = '';
	}

	render() {
		return html`
			<d2l-navigation-immersive width-type="fullscreen">

				<div slot="left">
					<d2l-navigation-link-back
						text="${this.backText}"
						href="${this.href}"
						class="d2l-insights-link-back-default">
					</d2l-navigation-link-back>
					<d2l-navigation-link-back
						text="${this.backTextShort || this.backText}"
						href="${this.href}"
						class="d2l-insights-link-back-responsive">
					</d2l-navigation-link-back>
				</div>

				<div slot="middle" class="d2l-insights-immersive-nav-title">
					${this.mainText}
				</div>

			</d2l-navigation-immersive>
		`;
	}
}
customElements.define('d2l-insights-immersive-nav', InsightsImmersiveNav);
