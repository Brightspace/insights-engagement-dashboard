import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class GradesTrendSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		return html`
			<span class="d2l-insights-thumbnail-title">${this.localize('gradesTrendCard:gradesOverTime')}</span>
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 293 150">
				<defs>
					<clipPath id="clip-path">
						<rect width="211.047" height="30.099" fill="none"/>
					</clipPath>
				</defs>
				<g id="Grade_over_time"  transform="translate(-619 -463)">
					<g id="Card_Container"  transform="translate(619 463)">
						<g id="card_container-2"  fill="#fff" stroke="#e3e9f1" stroke-miterlimit="10" stroke-width="1">
							<rect width="293" height="150" rx="10" stroke="none"/>
							<rect x="0.5" y="0.5" width="292" height="149" rx="9.5" fill="none"/>
						</g>
						<g id="Chart" transform="translate(53.791 39.816)">
							<path id="Line_4"  d="M.479.5h213.2" transform="translate(-0.479 -0.5)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-2"  d="M.479.5h213.2" transform="translate(-0.479 19.158)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-3"  d="M.479.5h213.2" transform="translate(-0.469 38.816)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-4"  d="M.479.5h213.2" transform="translate(-0.479 78.132)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-5"  d="M.479.5h213.2" transform="translate(-0.469 58.474)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
						</g>
						<g id="X_axis"  transform="translate(24 26.083)" opacity="0.001">
							<text id="_100"  transform="translate(6.163 5)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">100</tspan></text>
							<text id="_60"  transform="translate(10.092 23.591)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">75</tspan></text>
							<text id="_40"  transform="translate(10.092 61.215)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">25</tspan></text>
							<text id="_0"  transform="translate(13.184 79.806)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">0</tspan></text>
							<text id="Current_Final_Grade-2"  transform="translate(3 59.297) rotate(-90)" fill="#494c4e" font-size="3" font-family="Lato-Bold, Lato" font-weight="700" letter-spacing="0.014em"><tspan x="0" y="0">Current Grade (%)</tspan></text>
							<text id="_40-2"  transform="translate(10.092 42.624)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">50</tspan></text>
						</g>
						<g id="grade_range"  transform="translate(55.064 107.901)" opacity="0">
							<g id="Repeat_Grid_8"  transform="translate(0 0)" clip-path="url(#clip-path)">
								<g transform="translate(39.497 48.379)">
									<text id="_100-2"  transform="translate(-39.497 19.621) rotate(-90)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 01/20</tspan></text>
								</g>
								<g transform="translate(97.497 48.379)">
									<text id="_100-3"  transform="translate(-39.497 19.621) rotate(-90)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 15/20</tspan></text>
								</g>
								<g transform="translate(155.497 48.379)">
									<text id="_100-4"  transform="translate(-39.497 19.621) rotate(-90)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 29/20</tspan></text>
								</g>
								<g transform="translate(213.497 48.379)">
									<text id="_100-5"  transform="translate(-39.497 19.621) rotate(-90)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.653" y="14">Oct 13/20</tspan></text>
								</g>
							</g>
						</g>
					</g>
					<g id="Grades" transform="translate(676.951 512.565)">
						<g id="SS20">
							<path id="Course13" d="M4.161-3.979l58.7-1.971,83.157,1.1L178.8-7.761l32.308,3.782" transform="translate(-4.161 7.761)" fill="none" stroke="#008eab" stroke-linecap="round" stroke-width="3"/>
							<path id="Course14" d="M14.659-40.463l85.347-1.279,43.342,6.485,39.3-5.206" transform="translate(24.417 46.624)" fill="none" stroke="#e87511" stroke-linecap="round" stroke-width="3"/>
						</g>
						<g id="F20" transform="translate(5.593 15.691)">
							<path id="Course15" d="M8.3-12.953l47.452,6.2,21.9-6.2,67.587-1.079,32.822,1.079" transform="translate(23.031 29.396)" fill="none" stroke="#8982ff" stroke-linecap="round" stroke-width="3"/>
							<path id="Course16" d="M9.058,2.9,84.522,1.077l22.271,5.816L140.523,0H178.83" transform="translate(22.643 24.015)" fill="none" stroke="#168fe6" stroke-linecap="round" stroke-width="3"/>
							<path id="Course17" d="M4.631-6.165H128.287l43.976-1.76L189.821-4.7" transform="translate(11.652 12.166)" fill="none" stroke="#d40067" stroke-linecap="round" stroke-width="3"/>
							<path id="Course18" d="M-75.518-10.7l86.3-3.395,40.2-10.139,34.316,7.463,40.667,4.344" transform="translate(75.518 24.23)" fill="none"/>
						</g>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-grades-trend-thumbnail', GradesTrendSvg);
