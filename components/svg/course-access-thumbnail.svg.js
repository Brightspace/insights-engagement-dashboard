import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class CourseAccessThumbnailSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('components.insights-course-last-access-card.courseAccess')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 291 150">
				<g id="Course_Access">
					<g fill="#fff" stroke="#e3e9f1"
					   stroke-width="1">
						<rect width="291" height="144" rx="15" stroke="none"/>
						<rect x="0.5" y="0.5" width="291" height="143" rx="14.5" fill="none"/>
					</g>
					<g id="Course_Access-2" transform="translate(10 5)">
						<g transform="translate(75.558 31.449)">
							<path d="M.5.449V94" transform="translate(-0.5 -0.449)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path d="M.5.449V94" transform="translate(44.811 -0.449)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path d="M.5.449V94" transform="translate(91.468 -0.449)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path d="M.5.449V94" transform="translate(136.779 -0.449)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path d="M.5.449V94" transform="translate(181.989 -0.449)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
						</g>

						<rect width="65" height="5" transform="translate(6 28.5)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 44.562)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 59.623)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 74.772)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 89.833)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 104.074)" fill="#E3E9F1" stroke="none"/>
						<rect width="65" height="5" transform="translate(6 120.5)" fill="#E3E9F1" stroke="none"/>

						<rect width="186" height="9" transform="translate(75.047 26)" fill="#0057a3"/>
						<rect width="140" height="9" transform="translate(75.047 42.062)" fill="#0057a3"/>
						<rect width="183" height="9" transform="translate(75.047 57.123)" fill="#0057a3"/>
						<rect width="83" height="9" transform="translate(75.047 72.272)" fill="#0057a3"/>
						<rect width="83" height="9" transform="translate(75.047 87.333)" fill="#0057a3"/>
						<rect width="91" height="9" transform="translate(75.047 101.574)" fill="#0057a3"/>
						<rect width="111.84" height="9" transform="translate(75.047 118)" fill="#0057a3"/>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-course-access-thumbnail', CourseAccessThumbnailSvg);
