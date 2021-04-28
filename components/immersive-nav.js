import 'd2l-navigation/d2l-navigation-immersive';
import 'd2l-navigation/d2l-navigation-link-back';

import { css, html } from 'lit-element/lit-element';
import { DefaultViewState } from '../model/view-state';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { removeState } from '../model/urlState';
import { SelectedCourses } from './courses-legend';
const insightsPortalEndpoint = '/d2l/ap/insightsPortal/main.d2l';

// Extends the standard immersive nav to resize the back link on small screens
class InsightsImmersiveNav extends Localizer(MobxLitElement) {
	static get properties() {
		return {
			viewState: { type: Object, attribute: false },
			orgUnitId: { type: Number, attribute: 'org-unit-id' },
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
		this.orgUnitId = 0;
		this.viewState = DefaultViewState;
	}

	get view() {
		return this.viewState.currentView;
	}

	get mainText() {
		switch (this.view) {
			case 'home': return this.localize('dashboard:title');
			case 'user': return this.localize('dashboard:userView:title');
			case 'userSelection': return this.localize('dashboard:userView:title');
			case 'settings': return this.localize('settings:title');
		}
		return this.localize('dashboard:title');
	}

	get backText() {
		switch (this.view) {
			case 'home':
				return this.localize('dashboard:backToInsightsPortal');
			case 'user':
				if (this.viewState.isSingleLearner) return this.localize('dashboard:backToUserSelector');
				else return this.localize('dashboard:backToEngagementDashboard');
			case 'settings':
				return this.localize('dashboard:backToEngagementDashboard');
		}
		return this.localize('dashboard:backToInsightsPortal');
	}

	render() {
		const linkToInsightsPortal = new URL(insightsPortalEndpoint, window.location.origin);
		linkToInsightsPortal.searchParams.append('ou', this.orgUnitId);
		const href = linkToInsightsPortal.toString();

		return html`
			<d2l-navigation-immersive width-type="fullscreen">

				<div slot="left">
					<d2l-navigation-link-back
						text="${this.backText}"
						href="${href}"
						class="d2l-insights-link-back-default"
						@click=${this._backLinkClickHandler}>
					</d2l-navigation-link-back>
					<d2l-navigation-link-back
						text="${this.localize('dashboard:backLinkTextShort')}"
						href="${href}"
						class="d2l-insights-link-back-responsive"
						@click=${this._backLinkClickHandler}>
					</d2l-navigation-link-back>
				</div>

				<div slot="middle" class="d2l-insights-immersive-nav-title">
					${this.mainText}
				</div>

			</d2l-navigation-immersive>
		`;
	}

	_backLinkClickHandler(e) {
		if (this.view === 'home' || this.view === 'userSelection') {
			return true;
		}

		if (this.view === 'user') {
			removeState((new SelectedCourses()).persistenceKey);
		}

		if (this.viewState.isSingleLearner) {
			this.viewState.setUserSelectionView();
		} else {
			this.viewState.setHomeView();
		}
		// prevent href navigation
		e.preventDefault();
		return false;
	}
}
customElements.define('d2l-insights-immersive-nav', InsightsImmersiveNav);
