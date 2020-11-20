import { css, html, LitElement } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

class DashboardSettings extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [css`
			:host {
				display: flex;
				flex-direction: column; /* required so the footer actually appears on-screen */
				height: 100%;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-insights-settings-page-main-container {
				height: 100%;
				overflow-y: auto;
			}

			.d2l-insights-settings-page-main-content {
				background-color: white;
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}

			footer {
				background-color: white;
				bottom: 0;
				box-shadow: 0 -2px 4px rgba(73, 76, 78, 0.2); /* ferrite */
				left: 0;
				padding: 0.75rem 30px;
				position: fixed;
				right: 0;
				z-index: 2; /* ensures the footer box-shadow is over main areas with background colours set */
			}

			.d2l-insights-settings-page-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}

			h1, h2 {
				font-weight: normal;
				line-height: 2rem;
			}

			/* buttons */
			.d2l-insights-settings-footer-button,
			.d2l-insights-settings-footer-button-desktop,
			.d2l-insights-settings-footer-button-responsive {
				margin-right: 0.75rem;
			}

			:host([dir="rtl"]) .d2l-insights-settings-footer-button,
			:host([dir="rtl"]) .d2l-insights-settings-footer-button-desktop,
			:host([dir="rtl"]) .d2l-insights-settings-footer-button-responsive {
				margin-left: 0.75rem;
			}

			.d2l-insights-settings-footer-button-desktop {
				display: inline-block;
			}

			.d2l-insights-settings-footer-button-responsive {
				display: none;
			}

			@media screen and (max-width: 615px) {
				footer {
					padding: 0.75rem 18px;
				}

				.d2l-insights-settings-footer-button-desktop {
					display: none;
				}

				.d2l-insights-settings-footer-button-responsive {
					display: inline-block;
				}

				.d2l-insights-settings-footer-button,
				.d2l-insights-settings-footer-button-desktop,
				.d2l-insights-settings-footer-button-responsive {
					margin-right: 0;
				}

				:host([dir="rtl"]) .d2l-insights-settings-footer-button,
				:host([dir="rtl"]) .d2l-insights-settings-footer-button-desktop,
				:host([dir="rtl"]) .d2l-insights-settings-footer-button-responsive {
					margin-left: 0;
				}
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-insights-settings-page-main-container">
				<div class="d2l-insights-settings-page-main-content">
						<h1>${this.localize('components.insights-settings-view.title')}</h1>
						<h2>${this.localize('components.insights-settings-view.description')}</h2>
						<p>Mock content</p>
						<p>Mock content</p>
						<p>Mock content</p>
						<p>Mock content</p>
						<p>Mock content</p>
						<p>Mock content</p>
						<p>Mock content</p>
				</div>
			</div>

			<footer>
				<div class="d2l-insights-settings-page-footer">
					<d2l-button
						primary
						class="d2l-insights-settings-footer-button-desktop"
						@click="${this._handleSaveAndClose}">
						${this.localize('components.insights-settings-view.saveAndClose')}
					</d2l-button>
					<d2l-button
						primary
						class="d2l-insights-settings-footer-button-responsive"
						@click="${this._handleSaveAndClose}">
						${this.localize('components.insights-settings-view.save')}
					</d2l-button>
					<d2l-button
						class="d2l-insights-settings-footer-button"
						@click="${this._returnToEngagementDashboard}">
						${this.localize('components.insights-settings-view.cancel')}
					</d2l-button>
				</div>
			</footer>
		`;
	}

	_handleSaveAndClose() {
		// out of scope: save settings

		this._returnToEngagementDashboard();
	}

	_returnToEngagementDashboard() {
		this.dispatchEvent(new Event('d2l-insights-settings-view-back'));
	}
}
customElements.define('d2l-insights-engagement-dashboard-settings', DashboardSettings);
