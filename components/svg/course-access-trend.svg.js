import { html, LitElement } from 'lit-element/lit-element';
import { Localizer } from '../../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class CourseAccessTrendSvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 293 150">
				<defs>
					<clipPath id="clip-path">
						<rect width="225.64" height="30.209" fill="none"/>
					</clipPath>
				</defs>
				<g id="Course_Access_Over_Time"  transform="translate(-619 -775)">
					<g id="Card_Container"  transform="translate(619 775)">
						<g id="card_container-2"  fill="#fff" stroke="#e3e9f1" stroke-miterlimit="10" stroke-width="1">
							<rect width="293" height="150" rx="15" stroke="none"/>
							<rect x="0.5" y="0.5" width="292" height="149" rx="14.5" fill="none"/>
						</g>
						<text id="Current_Final_Grade"  transform="translate(24.022 12)" fill="#494c4e" font-size="14" font-family="Lato-Bold, Lato" font-weight="700" letter-spacing="0.014em"><tspan x="0" y="14">${this.localize('accessTrendCard:title')}</tspan></text>
						<g id="Chart" transform="translate(52.923 40.446)">
							<path id="Line_4"  d="M.479.5H214.546" transform="translate(-0.479 -0.5)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-2"  d="M.479.5H214.546" transform="translate(-0.479 19.744)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-3"  d="M.479.5H214.546" transform="translate(-0.469 39.988)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-4"  d="M.479.5H214.546" transform="translate(-0.479 80.476)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
							<path id="Line_4-5"  d="M.479.5H214.546" transform="translate(-0.469 60.232)" fill="none" stroke="#979797" stroke-linecap="square" stroke-miterlimit="10" stroke-width="1"/>
						</g>
						<g id="X_axis"  transform="translate(24 26.174)" opacity="0">
							<text id="_100"  transform="translate(6.188 5)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">800</tspan></text>
							<text id="_60"  transform="translate(6.168 23.214)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">600</tspan></text>
							<text id="_40"  transform="translate(5.727 61.42)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">200</tspan></text>
							<text id="_0"  transform="translate(13.237 81.078)" fill="#72777a" font-size="6" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">0</tspan></text>
							<text id="Current_Final_Grade-2"  transform="translate(4 54.626) rotate(-90)" fill="#494c4e" font-size="4" font-family="Lato-Bold, Lato" font-weight="700" letter-spacing="0.014em"><tspan x="0" y="0">Access Counts</tspan></text>
							<text id="_40-2"  transform="translate(5.727 42.761)" fill="#72777a" font-size="5" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="0">400</tspan></text>
						</g>
						<g id="Repeat_Grid_11"  transform="translate(41.349 107.791)" opacity="0" clip-path="url(#clip-path)">
							<g transform="translate(39.497 48.379)">
								<text id="_100-2"  transform="translate(-44.718 9.915) rotate(-60)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 01/20</tspan></text>
							</g>
							<g transform="translate(95.497 48.379)">
								<text id="_100-3"  transform="translate(-44.718 9.915) rotate(-60)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 15/20</tspan></text>
							</g>
							<g transform="translate(151.497 48.379)">
								<text id="_100-4"  transform="translate(-44.718 9.915) rotate(-60)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.877" y="14">Sep 29/20</tspan></text>
							</g>
							<g transform="translate(207.497 48.379)">
								<text id="_100-5"  transform="translate(-44.718 9.915) rotate(-60)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.653" y="14">Oct 13/20</tspan></text>
							</g>
							<g transform="translate(263.497 48.379)">
								<text id="_100-6"  transform="translate(-44.718 9.915) rotate(-60)" fill="#72777a" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="2.653" y="14">Oct 27/20</tspan></text>
							</g>
						</g>
					</g>
					<g id="Access" transform="translate(671.917 844.199)">
						<path id="System_Access"  d="M9298.648,1347.949v-59.411h98.118l27.387,9.546,28.171-9.546,66.118,34.063v25.348Z" transform="translate(-9298.648 -1288.538)" fill="none"/>
						<path id="Path_224"  d="M0,0,51.1-28.072l38.42,8.155,62.549-13.446L206,0" transform="translate(12.084 52.801)" fill="none" stroke="#e87522" stroke-linecap="round" stroke-width="3"/>
						<path id="Path_225"  d="M0,0,37.146-30.177,86.4-35.366l35.052-5.716L169,0" transform="translate(49.084 52.801)" fill="none" stroke="#168fe6" stroke-width="3"/>
					</g>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-course-access-trend-thumbnail', CourseAccessTrendSvg);
