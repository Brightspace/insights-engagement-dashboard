import 'd2l-navigation/d2l-navigation-immersive';
import 'd2l-navigation/d2l-navigation-link-back';
import 'd2l-navigation/d2l-navigation-button';
import '@brightspace-ui/core/components/icons/icon';

import { css, html, LitElement } from 'lit-element/lit-element';

// Extends the standard immersive nav to
// - resize the back button on small screens
// - allow use of a button instead of a link
class InsightsImmersiveNav extends LitElement {
	static get properties() {
		return {
			/**
			 * type: either 'button' or 'link'
			 */
			backButtonType: { type: String, attribute: 'back-button-type' },
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
		this.backButtonType = '';
		this.href = '';
		this.mainText = '';
		this.backText = '';
		this.backTextShort = '';
	}

	_renderBackButton() {
		return html`
			<d2l-navigation-button
				text="${this.backText}"
				class="d2l-insights-link-back-default"
				@click="${this._handleBackButtonClick}">

				<d2l-icon icon="d2l-tier1:chevron-left"></d2l-icon>
				<span>${this.backText}</span>
			</d2l-navigation-button>

			<d2l-navigation-button
				text="${this.backTextShort}"
				class="d2l-insights-link-back-responsive"
				@click="${this._handleBackButtonClick}">

				<d2l-icon icon="d2l-tier1:chevron-left"></d2l-icon>
				<span>${this.backTextShort}</span>
			</d2l-navigation-button>
		`;
	}

	_renderBackLink() {
		return html`
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
		`;
	}

	render() {
		return html`
			<d2l-navigation-immersive width-type="fullscreen">

				<div slot="left">
					${ this.backButtonType === 'button' ? this._renderBackButton() : this._renderBackLink() }
				</div>

				<div slot="middle" class="d2l-insights-immersive-nav-title">
					${this.mainText}
				</div>

			</d2l-navigation-immersive>
		`;
	}

	// only for when the immersive nav is configured to use a button and not a link
	_handleBackButtonClick() {
		this.dispatchEvent(new Event('d2l-insights-immersive-nav-back'));
	}
}

customElements.define('d2l-insights-immersive-nav', InsightsImmersiveNav);
