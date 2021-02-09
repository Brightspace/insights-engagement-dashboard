import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-checkbox';
import '@brightspace-ui/core/components/link/link.js';
import 'd2l-table/d2l-scroll-wrapper';

import { bodySmallStyles, bodyStandardStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

export const COLUMN_TYPES = {
	ROW_SELECTOR: -1,
	NORMAL_TEXT: 0,
	TEXT_SUB_TEXT: 1,
	SUB_COLUMNS: 2
};

/**
 * @property {String} title - for use by screen reader users
 * @property {Array} columnInfo - list of column info. Contains headerText and columnType.
 *                                NB: only one column of type ROW_SELECTOR is allowed
 * @property {Array} data - a row-indexed 2D array of rows and columns.
 * @property {Number} sortColumn - the column that the table is sorted by (starting at 0)
 * @property {String} sortOrder - whether the column is asc or desc sorted
 * E.g. data[0] gets the entire first row; data[0][0] gets the first row / first column
 */
class Table extends SkeletonMixin(Localizer(RtlMixin(LitElement))) {

	static get properties() {
		return {
			title: { type: String, attribute: true },
			columnInfo: { type: Array, attribute: false },
			data: { type: Array, attribute: false },
			sortColumn: { type: Number, attribute: 'sort-column', reflect: true },
			sortOrder: { type: String, attribute: 'sort-order', reflect: true },
		};
	}

	static get styles() {
		return [super.styles, bodyStandardStyles, bodySmallStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}

			:host([dir="rtl"]) .d2l-insights-table-table {
				text-align: right;
			}

			.d2l-insights-table-table {
				background-color: #ffffff;
				border-collapse: separate;
				border-spacing: 0;
				font-weight: normal;
				max-width: 1200px;
				overflow-x: auto;
				text-align: left;
				width: 100%;
			}

			.d2l-insights-table-header {
				background-color: var(--d2l-color-regolith);
				color: var(--d2l-color-ferrite);
				height: 27px; /* min-height to be 48px including border */
				line-height: 1.4rem;
			}

			.d2l-insights-table-cell {
				border-bottom: 1px solid var(--d2l-color-mica);
				display: table-cell;
				font-weight: normal;
				height: 41px; /* min-height to be 62px including border */
				padding: 10px 20px;
				position: relative;
				vertical-align: middle;
			}

			.d2l-insights-table-cell-header {
				cursor: pointer;
			}

			.d2l-insights-table-cell-header:focus {
				outline: solid 0;
				text-decoration: underline;
			}

			.d2l-insights-table-cell-sort-indicator {
				pointer-events: none;
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
			}

			/* Table cell borders - to get exactly 1px inner borders in all cells */
			.d2l-insights-table-table .d2l-insights-table-row-first > th {
				border-top: 1px solid var(--d2l-color-mica);
			}

			.d2l-insights-table-table .d2l-insights-table-cell {
				border-right: 1px solid var(--d2l-color-mica);
			}

			.d2l-insights-table-table .d2l-insights-table-cell-first,
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-cell-last {
				border-left: 1px solid var(--d2l-color-mica);
			}

			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-cell-first:not(.d2l-insights-table-cell-last) {
				border-left: 0;
			}

			/* Table cell radii - to round all 4 corners */
			/* top row, first child */
			.d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-first {
				border-top-left-radius: 8px;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-first:not(.d2l-insights-table-cell-last) {
				border-top-left-radius: 0;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-first {
				border-top-right-radius: 8px;
			}

			/* top row, last child */
			.d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-last {
				border-top-right-radius: 8px;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-last:not(.d2l-insights-table-cell-first) {
				border-top-right-radius: 0;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-first > .d2l-insights-table-cell-last {
				border-top-left-radius: 8px;
			}

			/* bottom row, first child */
			.d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-first {
				border-bottom-left-radius: 8px;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-first:not(.d2l-insights-table-cell-last) {
				border-bottom-left-radius: 0;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-first {
				border-bottom-right-radius: 8px;
			}

			/* bottom row, last child */
			.d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-last {
				border-bottom-right-radius: 8px;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-last:not(.d2l-insights-table-cell-first) {
				border-bottom-right-radius: 0;
			}
			:host([dir="rtl"]) .d2l-insights-table-table .d2l-insights-table-row-last > .d2l-insights-table-cell-last {
				border-bottom-left-radius: 8px;
			}
			.d2l-insights-table-arrow-spacing {
				padding-right: 30px;
			}
			.d2l-insights-table-table td:not(.d2l-insights-table-cell-first):not(td>d2l-icon) {
				min-width: 30px;
			}

			d2l-scroll-wrapper {
				--d2l-scroll-wrapper-h-scroll: {
					border-left: var(--d2l-table-border-overflow);
					border-right: var(--d2l-table-border-overflow);
				};
				--d2l-scroll-wrapper-h-scroll-focus: {
					border-left: var(--d2l-table-border-overflow-focus);
					border-right: var(--d2l-table-border-overflow-focus);
				};
				--d2l-scroll-wrapper-left: {
					border-left: dashed 1px black;
				};
				--d2l-scroll-wrapper-right: {
					border-right: none;
				};

				--d2l-scroll-wrapper-border-color: var(--d2l-color-galena);
				--d2l-scroll-wrapper-background-color: var(--d2l-color-sylvite);
				--d2l-scroll-wrapper-inner: {
					@apply --d2l-table;
				};
			}

			td.d2l-insights-discussion-info {
				vertical-align: top;
			}
		`];
	}

	constructor() {
		super();
		this.columnInfo = [];
		this.data = [];
		this.title = '';
		this.sortColumn = 0;
		this.sortOrder = 'desc';
	}

	render() {
		return html`
			<d2l-scroll-wrapper show-actions>
				<table class="d2l-insights-table-table" aria-label="${this.title}">
					${this._renderThead()}
					${this._renderTbody()}
				</table>
			</d2l-scroll-wrapper>
		`;
	}

	get _numColumns() {
		return this.columnInfo.length;
	}

	_renderThead() {
		const styles = {
			'd2l-insights-table-row-first': true,
			// if skeleton view is displayed, then there will definitely be skeleton rows in the table,
			// even if data.length is 0. Therefore if skeleton is true, don't apply the "last row" style to header
			'd2l-insights-table-row-last': !this.skeleton && this.data.length === 0
		};

		return html`
			<thead class="d2l-insights-table-header">
				<tr class="${classMap(styles)}">
					${this.columnInfo.map(this._renderHeaderCell, this)}
				</tr>
			</thead>
		`;
	}

	_renderHeaderCell(info, idx) {
		const columnType = this.columnInfo[idx].columnType;

		const styles = {
			'd2l-insights-table-cell': true,
			'd2l-insights-table-cell-header': true,
			'd2l-insights-table-cell-first': idx === 0,
			'd2l-insights-table-cell-last': idx === this._numColumns - 1
		};

		if (columnType === COLUMN_TYPES.ROW_SELECTOR) {
			const isAllSelected = this.data.every(row => row[idx].selected);

			return html`
				<th class="${classMap(styles)}"
					scope="col"
					tabindex="${this.skeleton ? -1 : 0}"
				>
					<d2l-input-checkbox
						aria-label="${this.localize('table:selectAll')}"
						name="checkbox-all"
						@change="${this._handleAllSelected}"
						?checked="${isAllSelected}"
					></d2l-input-checkbox>
				</th>
			`;
		} else {
			const isSortedColumn = idx === this.sortColumn;
			styles['d2l-insights-table-arrow-spacing'] = isSortedColumn;
			const spaceArrow = { 'd2l-insights-table-cell-sort-indicator' : isSortedColumn };
			const arrowDirection = isSortedColumn ? this.sortOrder === 'desc' ? 'arrow-toggle-down' : 'arrow-toggle-up' : '';

			return html`
				<th role="button"
					class="${classMap(styles)}"
					scope="col"
					@keydown="${this._handleHeaderKey}"
					@click="${this._handleHeaderClicked}"
					tabindex="${this.skeleton ? -1 : 0}">

					${info.headerText}
					${!isSortedColumn ? html`` : html`<d2l-icon role="img" aria-label="${arrowDirection === 'arrow-toggle-up' ? 'Sorted Ascending' : 'Sorted Descending'}" icon="tier1:${arrowDirection}" class="${classMap(spaceArrow)}"></d2l-icon>`}
				</th>
			`;
		}
	}

	_renderTbody() {
		const styles = (rowIdx) => ({
			'd2l-insights-table-row-last': rowIdx === this.data.length - 1
		});

		return html`
			<tbody>
				${this.data.map((row, rowIdx) => html`
					<tr class="${classMap(styles(rowIdx))}">
						${row.map((cell, cellIdx) => this._renderBodyCell(cell, cellIdx, rowIdx), this)}
					</tr>
				`)}
			</tbody>
		`;
	}

	_renderBodyCell(cellValue, idx, rowIdx) {
		const columnType = this.columnInfo[idx].columnType;
		const clickable = this.columnInfo[idx].clickable;
		const ariaLabel = clickable && this.columnInfo[idx].ariaLabelFn ? this.columnInfo[idx].ariaLabelFn(cellValue) : undefined;

		const styles = {
			'd2l-insights-table-cell': true,
			'd2l-insights-table-cell-first': idx === 0,
			'd2l-insights-table-cell-last': idx === this._numColumns - 1,
			'd2l-insights-table-cell-clickable': clickable
		};

		const clickHandler = clickable ? this._clickHandler.bind(this, rowIdx, idx) : null;

		const defaultTextHtml = html`<div class="d2l-skeletize d2l-skeletize-95 d2l-body-standard">${cellValue}</div>`;
		const defaultLinkHtml = html`<d2l-link href="#" aria-label="${ifDefined(ariaLabel)}" @click="${clickHandler}">${cellValue}</d2l-link>`;
		const defaultHtml = html`
			<td class="${classMap(styles)}">
				${clickable && !this.skeleton ? defaultLinkHtml : defaultTextHtml}
			</td>
		`;

		if (this.skeleton) {
			return defaultHtml; // regardless of the column type, because the data hasn't been loaded yet
		}

		if (columnType === COLUMN_TYPES.ROW_SELECTOR) {
			return html`
				<td class="${classMap(styles)}">
					<d2l-input-checkbox
						aria-label="${cellValue.ariaLabel}"
						name="checkbox-${cellValue.value}"
						value="${cellValue.value}"
						?checked="${cellValue.selected}"
						@change="${this._handleRowSelected}"
					></d2l-input-checkbox>
				</td>
			`;
		} else if (columnType === COLUMN_TYPES.TEXT_SUB_TEXT) {
			const regularCell = html`<div class="d2l-body-standard">${cellValue[0]}</div>`;
			const clickableCell = html`<d2l-link href="#" aria-label="${ifDefined(ariaLabel)}" @click="${clickHandler}">${cellValue[0]}</d2l-link>`;

			return html`
				<td class="${classMap(styles)}">
					${clickable ? clickableCell : regularCell }
					<div class="d2l-body-small">${cellValue[1]}</div>
				</td>
			`;
		} else if (columnType === COLUMN_TYPES.SUB_COLUMNS) {
			return html`
				<td class="${classMap(styles)}">

					<table>
						<tr>
							<td class="d2l-insights-discussion-info">
								<div class="d2l-body-standard" style="text-align:center;">${cellValue[0]}</div>
								<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:threads')}</div>
							</td>
							<td>
								<d2l-icon icon="tier2:divider"></d2l-icon>
							</td>
							<td class="d2l-insights-discussion-info">
								<div class="d2l-body-standard" style="text-align:center;">${cellValue[1]}</div>
								<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:reads')}</div>
							</td>
							<td>
								<d2l-icon icon="tier2:divider"></d2l-icon>
							</td>
							<td class="d2l-insights-discussion-info">
								<div class="d2l-body-standard" style="text-align:center;">${cellValue[2]}</div>
								<div class="d2l-body-standard" style="text-align:center;">${this.localize('discussionActivityCard:replies')}</div>
							</td>
						</tr>
					</table>
				</td>
			`;
		} else if (columnType === COLUMN_TYPES.NORMAL_TEXT) {
			return defaultHtml;
		}
		throw new Error('Users table: unknown column type');
	}

	_handleHeaderKey(e) {

		const children = e.target.parentElement.children;
		let columnNumber = Array.from(children).indexOf(e.target);
		if (e.keyCode === 32 /* spacebar */ || e.key === 'Enter') {
			e.preventDefault();
			this._handleHeaderClicked(e);
			return;
		} else if (e.key === 'ArrowLeft') {
			columnNumber -= 1;
			if (columnNumber < 0) {
				columnNumber = children.length - 1;
			}
		} else if (e.key === 'ArrowRight') {
			columnNumber += 1;
			if (columnNumber >= children.length) {
				columnNumber = 0;
			}
		}
		children[columnNumber].focus();
		if (e.keyCode === 'Tab') e.preventDefault();
		return false;
	}

	_handleHeaderClicked(e) {
		const children = e.target.parentElement.children;
		const columnNumber = Array.from(children).indexOf(e.target);

		if (columnNumber !== this.sortColumn) {
			this.sortOrder = 'desc';
		} else {
			if (this.sortOrder === 'asc') {
				this.sortOrder = 'desc';
			} else {
				this.sortOrder = 'asc';
			}
		}

		this.sortColumn = columnNumber;

		this.dispatchEvent(new CustomEvent('d2l-insights-table-sort',
			{
				detail: { column: this.sortColumn, order: this.sortOrder },
			}
		));
	}

	_handleRowSelected(event) {
		this.dispatchEvent(new CustomEvent('d2l-insights-table-select-changed', {
			detail: {
				values: [event.target.value],
				selected: event.target.checked
			}
		}));
	}

	_handleAllSelected() {
		const checkboxes = Array.from(this.shadowRoot.querySelectorAll('td > d2l-input-checkbox')); // NB: this will only handle 1 checkbox column
		const values = checkboxes.map(checkbox => checkbox.value);
		const isAllSelected = checkboxes.every(checkbox => checkbox.checked);

		this.dispatchEvent(new CustomEvent('d2l-insights-table-select-changed', {
			detail: {
				values,
				selected: !isAllSelected
			}
		}));
	}

	_clickHandler(rowIdx, columnIdx, e) {
		this.dispatchEvent(new CustomEvent('d2l-insights-table-cell-clicked', {
			detail: {
				rowIdx,
				columnIdx
			}
		}));
		e.preventDefault();
	}
}
customElements.define('d2l-insights-table', Table);
