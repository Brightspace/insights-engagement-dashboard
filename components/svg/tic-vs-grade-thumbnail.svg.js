import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class TicVsGradeThumbnailSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('components.insights-time-in-content-vs-grade-card.timeInContentVsGrade')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 291 150">
				<g id="TiC_v_Grade">
					<g fill="#fff" stroke="#e3e9f1" stroke-miterlimit="10" stroke-width="1">
						<rect width="291" height="144" rx="15" stroke="none"/>
						<rect x="0.5" y="0.5" width="291" height="143" rx="14.5" fill="none"/>
					</g>
					<g transform="translate(5 15)">
						<g transform="translate(25.873 14.498)">
							<path id="Line_3-6" d="M.5.449V102.612" transform="translate(1.452 -0.199)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_3-7" d="M.5.449V102.612" transform="translate(53.278 -0.199)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_3-8" d="M.5.449V102.612" transform="translate(108.838 -0.199)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_3-9" d="M.5.449V102.612" transform="translate(164.144 -0.199)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_3-10" d="M.5.449V102.612" transform="translate(230.789 -0.199)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-5" d="M.479.5H233.185" transform="translate(-0.212 1.452)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-6" d="M.479.5H233.185" transform="translate(-0.212 27.073)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-7" d="M.479.5H233.185" transform="translate(-0.212 50.44)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-8" d="M.479.5H233.185" transform="translate(-0.212 75.592)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-9" d="M.479.5H233.185" transform="translate(-0.212 100.212)"
								  fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-10" d="M.479.5H233.185" transform="translate(-0.479 46.146)"
								  fill="none" stroke="red" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"
								  stroke-dasharray="5"/>
							<path id="Line_3-11" d="M.5.449V102.612" transform="translate(112.033 -0.449)"
								  fill="none" stroke="red" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"
								  stroke-dasharray="5"/>
						</g>
						<g id="datapoints" transform="translate(25.873 14.029)">
							<g transform="translate(0 16.803)">
								<circle cx="4" cy="4" r="4" transform="translate(108.771 77.152) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(4 19.896)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(60.779 14.673)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(98.997 72.691) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(84.499 47.445) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(98.997 28.348) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(72.232 71.576) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(77.808 23.044) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(59.407 55.933) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(109.592 71.576) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(109.328 71.576) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(222.402 60.523) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(208.213 28.694) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(223.287 25.512) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(221.038 41.426) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(202.637 -7.555) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(184.236 30.816) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(169.739 9.598) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(184.236 -12.016) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(157.471 28.694) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(222.499 -12.016) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(163.047 -14.804) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(144.646 18.085) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(144.646 57.34) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(141.858 22.329) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(194.831 72.315) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(169.181 41.426) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(136.282 52.036) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(150.78 32.938) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(192.042 32.938) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(129.591 27.634) rotate(-21)" fill="#7866ff"/>
								<circle cx="4" cy="4" r="4" transform="translate(132.642 30.816) rotate(-21)" fill="#7866ff"/>
							</g>
						</g>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-tic-vs-grade-thumbnail', TicVsGradeThumbnailSvg);
