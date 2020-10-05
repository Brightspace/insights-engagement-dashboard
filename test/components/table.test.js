import '../../components/table.js';

import { expect, fixture, html } from '@open-wc/testing';
import { COLUMN_TYPES } from '../../components/table';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const columnInfo = [
	{
		headerText: 'header1',
		columnType: COLUMN_TYPES.NORMAL_TEXT
	},
	{
		headerText: 'header2',
		columnType: COLUMN_TYPES.NORMAL_TEXT
	},
	{
		headerText: 'header3',
		columnType: COLUMN_TYPES.TEXT_SUB_TEXT
	}
];

const data = [
	['First Item', 1, ['text1', 'subtext1']],
	['Second Item', 2, ['text2', 'subtext2']],
	['Third Item', 3, ['text3', 'subtext3']],
	['Fourth Item', 4, ['text4', 'subtext4']]
];

describe('d2l-insights-table', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-table');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-table .columnInfo=${columnInfo} .data="${data}"></d2l-insights-table>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should have correct header and data', async() => {
			const el = await fixture(html`<d2l-insights-table .columnInfo=${columnInfo} .data="${data}"></d2l-insights-table>`);

			const headerCells = Array.from(el.shadowRoot.querySelectorAll('thead>tr>th'));
			expect(headerCells.length).to.equal(columnInfo.length);
			headerCells.forEach((cell, idx) => {
				expect(cell.innerText).to.equal(columnInfo[idx].headerText);
			});

			const rows = Array.from(el.shadowRoot.querySelectorAll('tbody>tr'));
			expect(rows.length).to.equal(4);

			rows.forEach((row, rowIdx) => {
				const cells = Array.from(row.querySelectorAll('td'));
				expect(cells.length).to.equal(3);

				cells.forEach((cell, colIdx) => {
					verifyCellData(cell, rowIdx, colIdx);
				});
			});
		});
	});
});

function verifyCellData(cell, rowIdx, colIdx) {
	const columnType = columnInfo[colIdx].columnType;

	if (columnType === COLUMN_TYPES.NORMAL_TEXT) {
		const innerDiv = cell.querySelector('div');
		expect(innerDiv.innerText).to.equal(data[rowIdx][colIdx].toString());

	} else if (columnType === COLUMN_TYPES.TEXT_SUB_TEXT) {
		const mainTextDiv = cell.querySelector('div:first-child');
		const subTextDiv = cell.querySelector('div:last-child');
		expect(mainTextDiv.innerText).to.equal(data[rowIdx][colIdx][0].toString());
		expect(subTextDiv.innerText).to.equal(data[rowIdx][colIdx][1].toString());
	}
}
