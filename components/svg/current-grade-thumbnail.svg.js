import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class CurrentGradeThumbnailSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('currentFinalGradeCard:currentGrade')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 291 150">
				<g id="Current_Grade" data-name="Current Grade">
					<g fill="#fff" stroke="#e3e9f1" stroke-width="1">
						<rect width="291" height="144" rx="15" stroke="none"/>
						<rect x="0.5" y="0.5" width="291" height="143" rx="14.5" fill="none"/>
					</g>
					<g id="Current_Grade-2" transform="translate(10 25)">
						<g id="Chart" transform="translate(17.605 20.263)">
							<path id="Line_4" d="M.479.5H241.973" transform="translate(-0.479 -0.5)" fill="none"
								  stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-2" d="M.479.5H241.973" transform="translate(-0.479 27.496)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-3" d="M.479.5H241.973" transform="translate(-0.479 55.098)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-4" d="M.479.5H241.973" transform="translate(-0.479 83.094)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
						</g>
						<g id="Group_822" transform="translate(34.126 11.118)">
							<rect width="18" height="35" transform="translate(183 57.882)" fill="#6038ff"/>
							<rect width="18" height="49" transform="translate(160 43.882)" fill="#6038ff"/>
							<rect width="18" height="28" transform="translate(206 64.882)" fill="#6038ff"/>
							<rect width="18" height="93" transform="translate(137 -0.118)" fill="#6038ff"/>
							<rect width="18" height="25" transform="translate(69 67.882)" fill="#6038ff"/>
							<rect width="18" height="1" transform="translate(0 91.882)" fill="#6038ff"/>
							<rect width="18" height="8" transform="translate(23 84.882)" fill="#6038ff"/>
							<rect width="18" height="8" transform="translate(46 84.882)" fill="#6038ff"/>
							<rect width="18" height="35" transform="translate(92 57.882)" fill="#6038ff"/>
							<rect width="18" height="49" transform="translate(115 43.882)" fill="#6038ff"/>
						</g>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-current-grade-thumbnail', CurrentGradeThumbnailSvg);
