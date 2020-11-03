import '../../components/table.js';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
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
	},
	{
		headerText: '',
		columnType: COLUMN_TYPES.ROW_SELECTOR
	}
];

const data = [
	['First Item', 1, ['text1', 'subtext1'], { value: 123, ariaLabel: '123', selected: false }],
	['Second Item', 2, ['text2', 'subtext2'], { value: 234, ariaLabel: '234', selected: true }],
	['Third Item', 3, ['text3', 'subtext3'], { value: 345, ariaLabel: '345', selected: false }],
	['Fourth Item', 4, ['text4', 'subtext4'], { value: 456, ariaLabel: '456', selected: false }]
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
			// the scroll wrapper table component has a button in an aria-hidden div
			// so it technically breaks the accessibility test. To get around this
			// we exclude that test from this element. Please check for this rule manually
			// or disable this rule and make sure no other issues were introduced
			// during future development.
			await expect(el).to.be.accessible({
				ignoredRules: ['aria-hidden-focus']
			});
		});
	});

	describe('render', () => {
		it('should have correct header and data', async() => {
			const el = await fixture(html`<d2l-insights-table .columnInfo=${columnInfo} .data="${data}"></d2l-insights-table>`);

			const headerCells = Array.from(el.shadowRoot.querySelectorAll('thead>tr>th'));
			expect(headerCells.length).to.equal(columnInfo.length);
			headerCells.forEach((cell, idx) => {
				// trim is needed because on OSX/Safari a random space is added to the header text
				expect(cell.innerText.trim()).to.equal(columnInfo[idx].headerText);
			});

			const rows = Array.from(el.shadowRoot.querySelectorAll('tbody>tr'));
			expect(rows.length).to.equal(4);

			rows.forEach((row, rowIdx) => {
				const cells = Array.from(row.querySelectorAll('td'));
				expect(cells.length).to.equal(4);

				cells.forEach((cell, colIdx) => {
					verifyCellData(cell, rowIdx, colIdx);
				});
			});
		});
	});

	describe('eventing', () => {
		describe('single row selector', () => {
			it('should fire d2l-insights-table-select-changed when selected and deselected', async() => {
				const el = await fixture(html`<d2l-insights-table .columnInfo=${columnInfo} .data="${data}"></d2l-insights-table>`);
				const checkbox = el.shadowRoot.querySelector('td > d2l-input-checkbox'); // just grab the first one

				let listener = oneEvent(el, 'd2l-insights-table-select-changed');
				checkbox.simulateClick();
				let event = await listener;
				expect(event.detail).to.deep.equal({ values: ['123'], selected: true });

				listener = oneEvent(el, 'd2l-insights-table-select-changed');
				checkbox.simulateClick();
				event = await listener;
				expect(event.detail).to.deep.equal({ values: ['123'], selected: false });
			});
		});

		describe('select all', () => {
			const runSelectAllTest = async(initialData, expectedSelected) => {
				const el = await fixture(html`<d2l-insights-table .columnInfo=${columnInfo} .data="${initialData}"></d2l-insights-table>`);
				const checkbox = el.shadowRoot.querySelector('th > d2l-input-checkbox');

				const listener = oneEvent(el, 'd2l-insights-table-select-changed');
				checkbox.simulateClick();
				const event = await listener;
				expect(event.detail).to.deep.equal({ values: ['123', '234', '345', '456'], selected: expectedSelected });
			};

			it('should fire d2l-insights-table-select-changed with selected=true when none initially selected ', async() => {
				const initialData = [ ...data ];
				initialData.forEach(row => row[3].selected = false);

				await runSelectAllTest(initialData, true);
			});

			it('should fire d2l-insights-table-select-changed with selected=true when 1 initially selected ', async() => {
				const initialData = [ ...data ]; // default data already has 1 initially selected

				await runSelectAllTest(initialData, true);
			});

			it('should fire d2l-insights-table-select-changed with selected=true when multiple initially selected ', async() => {
				const initialData = [ ...data ];
				initialData[0][3].selected = true; // should have 2 rows selected

				await runSelectAllTest(initialData, true);
			});

			it('should fire d2l-insights-table-select-changed with selected=false when all initially selected ', async() => {
				const initialData = [ ...data ];
				initialData.forEach(row => row[3].selected = true);

				await runSelectAllTest(initialData, false);
			});
		});
	});
});

function verifyCellData(cell, rowIdx, colIdx) {
	const columnType = columnInfo[colIdx].columnType;
	const expectedValue = data[rowIdx][colIdx];

	if (columnType === COLUMN_TYPES.NORMAL_TEXT) {
		const innerDiv = cell.querySelector('div');
		expect(innerDiv.innerText).to.equal(expectedValue.toString());

	} else if (columnType === COLUMN_TYPES.TEXT_SUB_TEXT) {
		const mainTextDiv = cell.querySelector('div:first-child');
		const subTextDiv = cell.querySelector('div:last-child');
		expect(mainTextDiv.innerText).to.equal(expectedValue[0].toString());
		expect(subTextDiv.innerText).to.equal(expectedValue[1].toString());

	} else if (columnType === COLUMN_TYPES.ROW_SELECTOR) {
		const innerCheckbox = cell.querySelector('d2l-input-checkbox');
		expect(innerCheckbox.name).to.equal(`checkbox-${expectedValue.value}`);
		expect(innerCheckbox.value).to.equal(expectedValue.value.toString());
		expect(innerCheckbox.ariaLabel).to.equal(expectedValue.ariaLabel);
		expect(innerCheckbox.checked).to.equal(expectedValue.selected);
	}
}
