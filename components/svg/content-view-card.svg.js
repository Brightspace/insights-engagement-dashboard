import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class ContentViewCardThumbnailSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}
	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('contentViewHistogram:title')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="283.5" height="144">
				<g data-name="Content View">
					<g data-name="Rectangle 495" fill="#fff" stroke="#e3e9f1">
						<rect width="283.5" height="144" rx="15" stroke="none"/>
						<rect x=".5" y=".5" width="282.5" height="143" rx="14.5" fill="none"/>
					</g>
					<g data-name="Content View">
					<g fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10">
						<path data-name="Line 3" d="M62.464 38.449V132M113.734 38.449V132M166.528 38.449V132M217.798 38.449V132M268.954 38.449V132"/>
					</g>
					<g data-name="X axis" fill="#72777a" font-size="9" font-family="Lato-Regular, Lato" letter-spacing=".014em">
						<text data-name="80" transform="translate(19.521 43.697)">
							<tspan x="0" y="0">150 - 200</tspan>
						</text>
						<text data-name="60" transform="translate(21.521 61.125)">
							<tspan x="0" y="0">100 -150</tspan>
						</text>
						<text data-name="40" transform="translate(24.521 78.553)">
							<tspan x="0" y="0">50 - 100</tspan>
						</text>
						<text data-name="20" transform="translate(35.521 113.41)">
							<tspan x="0" y="0">1 - 10</tspan>
						</text>
						<text data-name="0" transform="translate(53.521 132)">
							<tspan x="0" y="0">0</tspan>
						</text>
						<text data-name="40" transform="translate(30.521 94.82)">
							<tspan x="0" y="0">10 - 50</tspan>
						</text>
					</g>
					<path data-name="Rectangle 375" fill="#0057a3" d="M62.464 34.697h140v9h-140z"/>
					<path data-name="Rectangle 373" fill="#0057a3" d="M62.464 52.608h206.49v9H62.464z"/>
					<path data-name="Rectangle 372" fill="#0057a3" d="M62.464 70.622h83v9h-83z"/>
					<path data-name="Rectangle 371" fill="#0057a3" d="M62.464 105.467h91v9h-91z"/>
					<path data-name="Rectangle 377" fill="#0057a3" d="M62.464 125h111.84v9H62.464z"/>
					<path data-name="Rectangle 372" fill="#0057a3" d="M62.464 88.532h83v9h-83z"/>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-content-view-card-thumbnail', ContentViewCardThumbnailSvg);
