import '@brightspace-ui/core/components/list/list';
import '@brightspace-ui/core/components/list/list-item';
import { bodySmallStyles, bodyStandardStyles, heading3Styles } from '@brightspace-ui/core/components/typography/styles';
import { css, html, LitElement } from 'lit-element/lit-element';
import { formatNumber, formatPercent } from '@brightspace-ui/intl';
import { formatDateTimeFromTimestamp } from '@brightspace-ui/intl/lib/dateTime.js';
import { Localizer } from '../locales/localizer';
import { numberFormatOptions } from './users-table';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

function thirtyHoursAgo() {
	return Date.now() - 30 * 60 * 60 * 1000;
}

class ColumnConfiguration extends RtlMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			isDemo: { type: Boolean, attribute: 'demo' },
			s3Enabled: { type: Boolean, attribute: 'student-success-system-enabled' },

			showCoursesCol: { type: Boolean, attribute: 'courses-col', reflect: true },
			showDiscussionsCol: { type: Boolean, attribute: 'discussions-col', reflect: true },
			showGradeCol: { type: Boolean, attribute: 'grade-col', reflect: true },
			showLastAccessCol: { type: Boolean, attribute: 'last-access-col', reflect: true },
			showTicCol: { type: Boolean, attribute: 'tic-col', reflect: true },
			showPredictedGradeCol: { type: Boolean, attribute: 'predicted-grade-col', reflect: true }
		};
	}

	static get styles() {
		return [bodySmallStyles, bodyStandardStyles, heading3Styles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-insights-config-list-item {
				display: flex;
				flex-direction: row;
			}

			@media screen and (max-width: 767px) {
				.d2l-insights-config-list-item {
					display: flex;
					flex-direction: column;
				}
			}
			.d2l-column-example {
				margin: 10px 30px;
				min-width: 300px;
			}
			.d2l-column-selection-text {
				margin: 10px 30px;
			}
			h3.d2l-heading-3 {
				margin-top: 0;
			}

			table {
				width: min-content;
			}
			td.d2l-insights-discussion-info {
				vertical-align: top;
			}
		`];
	}

	constructor() {
		super();

		this.isDemo = false;
		this.s3Enabled = false;

		this.showCoursesCol = false;
		this.showDiscussionsCol = false;
		this.showGradeCol = false;
		this.showLastAccessCol = false;
		this.showTicCol = false;
		this.showPredictedGradeCol = false;
	}

	render() {
		// NB: list-item keys MUST have the same name as its corresponding component property
		// e.g. the key for this.showCoursesCol must be "showCoursesCol" (see _handleSelectionChange)

		return html`
			<d2l-list id="card-selection-list" @d2l-list-selection-change="${this._handleSelectionChange}">
				<d2l-list-item key="showGradeCol" selectable ?selected="${this.showGradeCol}">
					<div class="d2l-insights-config-list-item">
						<div class="d2l-column-example">${formatPercent(0.8705, numberFormatOptions)}</div>
						<div class="d2l-column-selection-text">
							<h3 class="d2l-heading-3">${this.localize('settings:avgGrade')}</h3>
							<p class="d2l-body-standard">${this.localize('settings:avgGradeDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
				<d2l-list-item key="showTicCol" selectable ?selected="${this.showTicCol}">
					<div class="d2l-insights-config-list-item">
						<div class="d2l-column-example">${formatNumber(92, numberFormatOptions)}</div>
						<div class="d2l-column-selection-text">
							<h3 class="d2l-heading-3">${this.localize('settings:avgTimeInContent')}</h3>
							<p class="d2l-body-standard">${this.localize('settings:avgTimeInContentDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
				<d2l-list-item key="showDiscussionsCol" selectable ?selected="${this.showDiscussionsCol}">
					<div class="d2l-insights-config-list-item">
						<div class="d2l-column-example">${this._discussionsExample}</div>
						<div class="d2l-column-selection-text">
							<h3 class="d2l-heading-3">${this.localize('settings:avgDiscussionActivity')}</h3>
							<p class="d2l-body-standard">${this.localize('settings:avgDiscussionActivityDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
				<d2l-list-item key="showLastAccessCol" selectable ?selected="${this.showLastAccessCol}">
					<div class="d2l-insights-config-list-item">
						<div class="d2l-column-example">${formatDateTimeFromTimestamp(this.isDemo ? 1607546883964 : thirtyHoursAgo(), { format: 'medium' })}</div>
						<div class="d2l-column-selection-text">
							<h3 class="d2l-heading-3">${this.localize('settings:lastAccessedSystem')}</h3>
							<p class="d2l-body-standard">${this.localize('settings:lastAccessedSystemDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
				${this._predictedGradeListItem}
			</d2l-list>
		`;
	}

	get _discussionsExample() {
		return html`<table>
			<tr>
				<td class="d2l-insights-discussion-info">
					<div class="d2l-body-standard" style="text-align:center;">1</div>
					<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:threads')}</div>
				</td>
				<td>
					<d2l-icon icon="tier2:divider"></d2l-icon>
				</td>
				<td class="d2l-insights-discussion-info">
					<div class="d2l-body-standard" style="text-align:center;">1</div>
					<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:reads')}</div>
				</td>
				<td>
					<d2l-icon icon="tier2:divider"></d2l-icon>
				</td>
				<td class="d2l-insights-discussion-info">
					<div class="d2l-body-standard" style="text-align:center;">0</div>
					<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:replies')}</div>
				</td>
			</tr>
		</table>`;
	}

	get _predictedGradeListItem() {
		if (this.s3Enabled) {
			return html`
				<d2l-list-item key="showPredictedGradeCol" selectable ?selected="${this.showPredictedGradeCol}">
					<div class="d2l-insights-config-list-item">
						<div class="d2l-column-example">${formatPercent(0.9175, numberFormatOptions)}</div>
						<div class="d2l-column-selection-text">
							<h3 class="d2l-heading-3">${this.localize('settings:predictedGrade')}</h3>
							<p class="d2l-body-standard">${this.localize('settings:predictedGradeDescription')}</p>
						</div>
					</div>
				</d2l-list-item>
			`;
		}

		return html``;
	}

	get settings() {
		return {
			showCoursesCol: this.showCoursesCol,
			showDiscussionsCol: this.showDiscussionsCol,
			showGradeCol: this.showGradeCol,
			showLastAccessCol: this.showLastAccessCol,
			showTicCol: this.showTicCol,
			showPredictedGradeCol: this.showPredictedGradeCol
		};
	}

	_handleSelectionChange(event) {
		this[event.detail.key] = event.detail.selected;
	}
}
customElements.define('d2l-insights-engagement-column-configuration', ColumnConfiguration);
