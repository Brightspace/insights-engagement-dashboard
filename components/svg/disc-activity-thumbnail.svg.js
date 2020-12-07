import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class DiscActivityThumbnailSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}
	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('discussionActivityCard:cardTitle')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 291 150">
				<g id="Discussion">
					<g fill="#fff" stroke="#e3e9f1" stroke-miterlimit="10" stroke-width="1">
						<rect width="291" height="143" rx="15" stroke="none"/>
						<rect x="0.5" y="0.5" width="291" height="142" rx="14.5" fill="none"/>
					</g>

					<rect width="80" height="10" transform="translate(179.563 44.598)" fill="#E3E9F1" stroke="none"/>
					<rect width="80" height="10" transform="translate(179.563 80.598)" fill="#E3E9F1" stroke="none"/>
					<rect width="80" height="10" transform="translate(179.563 112.598)" fill="#E3E9F1" stroke="none"/>

					<rect width="17" height="17" transform="translate(152.563 41.598)" fill="#7866ff"/>
					<rect width="17" height="17" transform="translate(152.563 77.115)" fill="#036a8a"/>
					<rect width="17" height="17" transform="translate(152.563 109)" fill="#00c4ac"/>

					<path d="M31.548,0A40.3,40.3,0,0,0,0,15.021L31.548,39h40C71.548,17.461,53.639,0,31.548,0Z"
						  transform="translate(44.798 44)" fill="#7866ff"/>
					<path d="M25.884,54.457C15.358,62.587,5.295,62.587,5.295,62.6L.053,24.456Q0,24.044,0,24.011L31.52,0h0C45.121,16.973,43.292,41.2,25.884,54.457Z"
						  transform="translate(75.716 58.66)" fill="#036a8a"/>
					<path d="M15.375,54.743a40.733,40.733,0,0,0,34.345,7.1L40,24.011h0L8.481,0h0A38.349,38.349,0,0,0,15.375,54.743Z"
						  transform="translate(36.479 58.66)" fill="#00c4ac"/>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-disc-activity-thumbnail', DiscActivityThumbnailSvg);
