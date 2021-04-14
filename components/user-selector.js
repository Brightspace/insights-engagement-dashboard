import { css, html } from 'lit-element';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin';

class UserSelector extends SkeletonMixin(Localizer(MobxLitElement)) {
	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			viewState: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				:host {
					display: block;
				}
				:host([hidden]) {
					display: none;
				}
			`
		];
	}

	constructor() {
		super();

		this.isDemo = false;
		this.viewState = null;
	}

	render() {
		return html`user selector`;
	}
}
customElements.define('d2l-insights-user-selector', UserSelector);
