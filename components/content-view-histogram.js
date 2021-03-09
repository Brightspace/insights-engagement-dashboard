import { css, html } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

const fakeData = [{}];

class ContentViewHistogram extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get styles() {
		return [super.styles, bodyStandardStyles, css`
			:host {
				border-color: var(--d2l-color-mica);
				border-radius: 15px;
				border-style: solid;
				border-width: 1.5px;
				display: inline-block;
				height: 285px;
				margin-right: 12px;
				margin-top: 10px;
				padding: 15px 4px;
				width: 583px;
			}

			@media only screen and (max-width: 615px) {
				:host {
					margin-right: 0;
				}
			}

			:host([hidden]) {
				display: none;
			}
			.d2l-insights-content-views-title {
				color: var(--d2l-color-ferrite);
				font-size: smaller;
				font-weight: bold;
				text-indent: 3%;
			}

			:host([skeleton]) .d2l-insights-content-views-title {
				margin-left: 19px;
			}
		`];
	}

	get chartOptions() {
		return {
			chart: {
				type: 'bar',
				height: 260,
				width: 583
			},
			title: {
				style: {
					display: 'none'
				}
			},
			xAxis: {

			},
			yAxis: {

			},
			series: []
		};
	}

	render() {
		return html`
		<div class="d2l-insights-content-views-title d2l-skeletize d2l-skeletize-45 d2l-body-standard">${this._cardTitle}</div>
		<d2l-labs-chart
			.options="${this.chartOptions}"
			?skeleton="${this.skeleton}"
		></d2l-labs-chart>`;
	}
}

customElements.define('d2l-labs-content-view-histogram', ContentViewHistogram);
