import { html, LitElement } from 'lit-element/lit-element';
import { formatPercent } from '@brightspace-ui/intl';
import { Localizer } from '../../locales/localizer';
import { numberFormatOptions } from '../user-drill-view';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { thumbnailCardStyles } from './thumbnail-card-styles';

class AverageGradeSummarySvg extends RtlMixin(Localizer(LitElement)) {
	static get styles() {
		return [thumbnailCardStyles];
	}

	render() {
		const gradeText = formatPercent(68.02 / 100, numberFormatOptions);
		return html`
			<svg xmlns="http://www.w3.org/2000/svg" width="293" height="150" viewBox="0 0 293 150">
				<g id="Average_Grade"  transform="translate(15 3)">
					<g id="card_container"  transform="translate(-15 -3)" fill="#fff" stroke="#e3e9f1" stroke-miterlimit="10" stroke-width="1">
						<rect width="293" height="150" rx="15" stroke="none"/>
						<rect x="0.5" y="0.5" width="292" height="149" rx="14.5" fill="none"/>
					</g>
					<rect id="Rectangle_384"  width="248" height="107" transform="translate(9 28)" fill="#fff" opacity="0.003"/>
					<text id="Discussion_Activity"  transform="translate(9 9)" fill="#494c4e" font-size="14" font-family="Lato-Bold, Lato" font-weight="700" letter-spacing="0.014em"><tspan x="0" y="14">${this.localize('averageGradeSummaryCard:averageGrade')}</tspan></text>
					<text id="_21"  transform="translate(9 66.6)" fill="#6c6c6c" font-size="20" font-family="Lato-Bold, Lato" font-weight="700" letter-spacing="0.01em"><tspan x="10.018" y="20">${gradeText}</tspan></text>
					<text id="learners_did_not_par"  transform="translate(102.352 60.74)" fill="#494c4e" font-size="14" font-family="Lato-Regular, Lato" letter-spacing="0.014em"><tspan x="0" y="14">${this.localize('averageGradeSummaryCard:averageGradeTextLine1')}</tspan><tspan x="0" y="32">${this.localize('averageGradeSummaryCard:averageGradeTextLine2')}</tspan></text>
				</g>
			</svg>
		`;
	}
}
customElements.define('d2l-insights-average-grade-summary-thumbnail', AverageGradeSummarySvg);
