import '../../components/user-drill-courses-table';

import { expect, fixture, html } from '@open-wc/testing';
import { formatDateTimeFromTimestamp } from '@brightspace-ui/intl/lib/dateTime.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const USER_ID = 1;
const ROLE_ID = 12345; // doesn't matter
const semesterOrgUnitId = 100;

const data = {
	records: [
		// active courses
		[101, USER_ID, ROLE_ID, 0, 80, 6600, 1607979700000, 3, 3, 3, 0.90],
		[102, USER_ID, ROLE_ID, 0, 85, 5400, 1607979760000, 2, 2, 2, 0.60],
		[103, USER_ID, ROLE_ID, 0, null, 4200, 1607979820000, 5, 5, 5, 0.75],
		[104, USER_ID, ROLE_ID, 0, 70, 4800, 1607979640000, 7, 7, 7, null], // no predicted grade
		[105, USER_ID, ROLE_ID, 0, 88, null, 1607979880000, 4, 4, 4, 0.20],
		[106, USER_ID, ROLE_ID, 0, 48, 7800, null, 9, 9, 9, 0.55],

		[199, 2, ROLE_ID, 0, 90, 6000, 1607979698265, 1, 2, 3, null], // should be ignored - not the current user

		// inactive courses
		[11, USER_ID, ROLE_ID, 0, 80, 6600, 1607979700000, 3, 3, 3, null],
		[12, USER_ID, ROLE_ID, 0, 85, 5400, null, 2, 2, 2, null],
		[13, USER_ID, ROLE_ID, 0, 75, 4200, 1607979820000, 5, 5, 5, null],
		[14, USER_ID, ROLE_ID, 0, null, 4800, 1607979640000, 7, 7, 7, null],
		[15, USER_ID, ROLE_ID, 0, 88, 7200, 1607979880000, 4, 4, 4, null],

		[99, 2, ROLE_ID, 0, 90, 6000, 1607979698265, 5, 6, 7, null], // should be ignored - not the current user
	],
	orgUnitTree: {
		isActive: (orgUnitId) => orgUnitId >= 100,
		getName: (orgUnitId) =>  { if (orgUnitId === semesterOrgUnitId) { return `Semester ${orgUnitId}`; } else return `Course ${orgUnitId}`;},
		getAncestorIds: () => [semesterOrgUnitId, 200],
		getType: () => 25
	},
	semesterTypeId : 25
};

const emptyData = {
	records: [ // only records for the wrong user
		[199, 2, ROLE_ID, 0, 90, 6000, 1607979698265, 1, 2, 3],
		[99, 2, ROLE_ID, 0, 90, 6000, 1607979698265, 5, 6, 7]
	],
	orgUnitTree: {
		isActive: (orgUnitId) => orgUnitId >= 100,
		getName: (orgUnitId) => `Course ${orgUnitId}`
	}
};

const user = { userId: 1 };
const selectedCourses = {
	isEmpty: () => true
};

const expected = {
	active: [
		['Course 101 (Id: 101)', '80 %', '90 %', '110', [3, 3, 3], getLocalDateTime(1607979700000)],
		['Course 102 (Id: 102)', '85 %', '60 %', '90', [2, 2, 2], getLocalDateTime(1607979760000)],
		['Course 103 (Id: 103)', 'No grade', '75 %', '70', [5, 5, 5], getLocalDateTime(1607979820000)],
		['Course 104 (Id: 104)', '70 %', 'No predicted grade', '80', [7, 7, 7], getLocalDateTime(1607979640000)],
		['Course 105 (Id: 105)', '88 %', '20 %', '0', [4, 4, 4], getLocalDateTime(1607979880000)],
		['Course 106 (Id: 106)', '48 %', '55 %', '130', [9, 9, 9], 'NULL']
	],
	inactive: [
		['Course 11 (Id: 11)', '80 %', '110', [3, 3, 3], getLocalDateTime(1607979700000), 'Semester 100 (Id: 100)'],
		['Course 12 (Id: 12)', '85 %', '90', [2, 2, 2], 'NULL', 'Semester 100 (Id: 100)'],
		['Course 13 (Id: 13)', '75 %', '70', [5, 5, 5], getLocalDateTime(1607979820000), 'Semester 100 (Id: 100)'],
		['Course 14 (Id: 14)', 'No grade', '80', [7, 7, 7], getLocalDateTime(1607979640000), 'Semester 100 (Id: 100)'],
		['Course 15 (Id: 15)', '88 %', '120', [4, 4, 4], getLocalDateTime(1607979880000), 'Semester 100 (Id: 100)'],
	]
};

describe('d2l-insights-user-drill-courses-table', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-user-drill-courses-table');
		});
	});

	describe('active courses table', () => {
		describe('accessibility', () => {
			it('should pass all axe tests', async() => {
				const [el] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: true }));

				// see users-table a11y test for explanation
				await expect(el).to.be.accessible({
					ignoredRules: [
						'aria-hidden-focus',
						'button-name' // d2l-scroll-wrapper draws button at the right edge of the table. This button does not have a label.
					]
				});
			});
		});

		describe('render table with correct data', () => {
			it('should pass correct data to inner table if S3 enabled and show predicted grade is true', async() => {
				const [, innerTable] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: true }));

				expect(innerTable.data).to.deep.equal(expected.active);
				expect(innerTable.columnInfo.map(info => info.headerText)).to.deep.equal([
					'Course Name',
					'Current Grade',
					'Predicted Grade',
					'Time in Content (mins)',
					'Discussion Activity',
					'Course Last Access'
				]);
			});

			it('should pass correct data to inner table if S3 disabled', async() => {
				const [, innerTable] = await setupTable(getTableHtml({ data, s3Enabled: false, isActive: true }));

				const expectedWithoutPredictedGrade = expected.active.map(row => row.filter((val, idx) => idx !== 2));
				expect(innerTable.data).to.deep.equal(expectedWithoutPredictedGrade);
				expect(innerTable.columnInfo.map(info => info.headerText)).to.deep.equal([
					'Course Name',
					'Current Grade',
					'Time in Content (mins)',
					'Discussion Activity',
					'Course Last Access'
				]);
			});

			it('should display no data error message if there was no data', async() => {
				const el = await fixture(getTableHtml({ data: emptyData, s3Enabled: true, isActive: true }));

				const errorMessage = el.shadowRoot.querySelector('d2l-insights-message-container');
				expect(errorMessage.text).to.equal('No active course data in filtered ranges.');
			});
		});

		describe('sorting', () => {
			const tableHtml = getTableHtml({ data, s3Enabled: true, isActive: true });
			const noS3TableHtml = getTableHtml({ data, s3Enabled: false, isActive: true });

			const testCases = [
				['Course name', undefined, 0],
				['Current Grade', numsWithTextSort, 1],
				['Predicted Grade', numsWithTextSort, null],
				['Time in Content (mins)', numsWithTextSort, 2],
				['Discussion Activity', undefined, 3],
				['Course Last Access', datesWithTextSort, 4]
			];
			testCases.forEach(([colName, sortFunction, noS3Index], colIdx) => {
				verifySorting(true, tableHtml, expected.active, sortFunction, colIdx, colName);
				if (noS3Index) {
					verifySorting(false, noS3TableHtml, expected.active, sortFunction, colIdx, colName, noS3Index);
				}
			});
		});

		describe('pagination', () => {
			// use a different set of data from the rest to keep other test case data size small
			const data = {
				records: [
					...Array.from({ length: 22 }).map((val, idx) => {
						return [idx + 10, USER_ID, ROLE_ID, 0, 100 - idx, 0, 1607979700000, 3, 3, 3, null];
					})
				],
				orgUnitTree: {
					isActive: () => true,
					getName: (orgUnitId) => `Course ${orgUnitId}`,
					getAncestorIds: () => []
				}
			};

			const expected = [
				...Array.from({ length: 22 }).map((val, idx) => {
					return [`Course ${idx + 10} (Id: ${idx + 10})`, `${100 - idx} %`, 'No predicted grade', '0',  [3, 3, 3], getLocalDateTime(1607979700000)];
				})
			];

			let el, innerTable, pageSelector;
			async function clickNextButton() {
				pageSelector
					.shadowRoot.querySelector('d2l-button-icon[text="Next page"]')
					.shadowRoot.querySelector('button')
					.click();
				await pageSelector.updateComplete;
				await innerTable.updateComplete;
				await el.updateComplete;
			}

			before(async() => {
				[el, innerTable] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: true }));
				pageSelector = el.shadowRoot.querySelector('d2l-labs-pagination');
			});

			it('should display the correct data on each page', async() => {
				expect(innerTable.data).to.deep.equal(expected.slice(0, 20));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expected.slice(20, 22));
			});
		});
	});

	describe('inactive courses table', () => {
		describe('accessibility', () => {
			it('should pass all axe tests', async() => {
				const [el] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: false }));

				// see users-table a11y test for explanation
				await expect(el).to.be.accessible({
					ignoredRules: [
						'aria-hidden-focus',
						'button-name' // d2l-scroll-wrapper draws button at the right edge of the table. This button does not have a label.
					]
				});
			});
		});

		describe('render', () => {
			it('should pass correct data to inner table', async() => {
				const [, innerTable] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: false }));
				expect(innerTable.data).to.deep.equal(expected.inactive);
				expect(innerTable.columnInfo.map(info => info.headerText)).to.deep.equal([
					'Course Name',
					'Final Grade',
					'Total Time in Content (mins)',
					'Discussion Activity',
					'Course Last Access',
					'Semester'
				]);
			});

			it('should display no data error message if there was no data', async() => {
				const el = await fixture(getTableHtml({ data: emptyData, s3Enabled: true, isActive: false }));

				const errorMessage = el.shadowRoot.querySelector('d2l-insights-message-container');
				expect(errorMessage.text).to.equal('No inactive course data in filtered ranges.');
			});
		});

		describe('sorting', () => {
			const tableHtml = getTableHtml({ data, s3Enabled: true, isActive: false });
			const noS3TableHtml = getTableHtml({ data, s3Enabled: false, isActive: false });

			const testCases = [
				['Course name', undefined],
				['Final Grade', numsWithTextSort],
				['Total Time in Content (mins)', numsWithTextSort],
				['Discussion Activity', undefined],
				['Course Last Access', datesWithTextSort]
			];
			testCases.forEach(([colName, sortFunction], colIdx) => {
				verifySorting(true, tableHtml, expected.inactive, sortFunction, colIdx, colName);
				verifySorting(false, noS3TableHtml, expected.inactive, sortFunction, colIdx, colName);
			});
		});

		describe('pagination', () => {
			// use a different set of data from the rest to keep other test case data size small
			const data = {
				records: [
					...Array.from({ length: 22 }).map((val, idx) => {
						return [idx + 10, USER_ID, ROLE_ID, 0, 100 - idx, 0, 1607979700000, 3, 3, 3];
					})
				],
				orgUnitTree: {
					isActive: () => false,
					getName: (orgUnitId) => { if (orgUnitId === semesterOrgUnitId) { return `Semester ${orgUnitId}`; } else return `Course ${orgUnitId}`;},
					getAncestorIds: () => [semesterOrgUnitId, 200],
					getType: () => 25
				},
				semesterTypeId : 25
			};

			const expected = [
				...Array.from({ length: 22 }).map((val, idx) => {
					return [`Course ${idx + 10} (Id: ${idx + 10})`, `${100 - idx} %`, '0', [3, 3, 3], getLocalDateTime(1607979700000), 'Semester 100 (Id: 100)'];
				})
			];

			let el, innerTable, headers, pageSelector;
			async function clickNextButton() {
				pageSelector
					.shadowRoot.querySelector('d2l-button-icon[text="Next page"]')
					.shadowRoot.querySelector('button')
					.click();
				await pageSelector.updateComplete;
				await innerTable.updateComplete;
				await el.updateComplete;
			}

			before(async() => {
				[el, innerTable, headers] = await setupTable(getTableHtml({ data, s3Enabled: true, isActive: false }));
				pageSelector = el.shadowRoot.querySelector('d2l-labs-pagination');
			});

			it('should display the correct data on each page', async() => {
				expect(innerTable.data).to.deep.equal(expected.slice(0, 20));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expected.slice(20, 22));
			});

			it('should change the page size and display the correct number of items on each page', async() => {
				const pageSizeSelector = pageSelector.shadowRoot.querySelector('select');
				pageSizeSelector.value = '10';
				pageSizeSelector.dispatchEvent(new Event('change'));
				await pageSelector.updateComplete;
				await innerTable.updateComplete;

				expect(innerTable.data).to.deep.equal(expected.slice(0, 10));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expected.slice(10, 20));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expected.slice(20, 22));
			});

			it('should interact correctly with sorting controls', async() => {
				// click on the first header to reverse the sorting
				headers.item(0).click();
				await innerTable.updateComplete;
				await el.updateComplete;

				const expectedReversed = [...expected].reverse();
				expect(innerTable.data).to.deep.equal(expectedReversed.slice(0, 10));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expectedReversed.slice(10, 20));

				await clickNextButton(pageSelector);
				expect(innerTable.data).to.deep.equal(expectedReversed.slice(20, 22));
			});
		});

		describe('export', () => {
			it('should get headersForExport and dataForExport[0] for inactive course when s3 is enabled', async() => {
				const el = await fixture(getTableHtml({ data, s3Enabled: true, isActive: false }));
				await new Promise(resolve => setTimeout(resolve, 200));
				await el.updateComplete;
				expect(el.dataForExport[0]).to.deep.equal(
					['Course 11 (Id: 11)', '80 %', 'No predicted grade', '110', 3, 3, 3, getLocalDateTime(1607979700000), 'Semester 100 (Id: 100)', false]);
				expect(el.headersForExport).to.deep.equal(['Course Name', 'Grade', 'Predicted Grade', 'Time in Content (mins)', 'Threads', 'Reads', 'Replies', 'Course Last Access', 'Semester', 'Is Active Course']);
			});

			it('should get headersForExport and dataForExport[0] for active course when s3 is enabled', async() => {
				const el = await fixture(getTableHtml({ data, s3Enabled: true, isActive: true }));
				await new Promise(resolve => setTimeout(resolve, 200));
				await el.updateComplete;
				expect(el.dataForExport[0]).to.deep.equal(
					[ 'Course 101 (Id: 101)', '80 %', '90 %', '110', 3, 3, 3, getLocalDateTime(1607979700000), 'Semester 100 (Id: 100)', true]);
				expect(el.headersForExport).to.deep.equal(['Course Name', 'Grade', 'Predicted Grade', 'Time in Content (mins)', 'Threads', 'Reads', 'Replies', 'Course Last Access', 'Semester', 'Is Active Course']);
			});

			it('should get headersForExport and dataForExport[0] for active course when s3 is not enabled', async() => {
				const el = await fixture(getTableHtml({ data, s3Enabled: false, isActive: true }));
				await new Promise(resolve => setTimeout(resolve, 200));
				await el.updateComplete;
				expect(el.dataForExport[0]).to.deep.equal(
					[ 'Course 101 (Id: 101)', '80 %', '110', 3, 3, 3, getLocalDateTime(1607979700000), 'Semester 100 (Id: 100)', true]);
				expect(el.headersForExport).to.deep.equal(['Course Name', 'Grade', 'Time in Content (mins)', 'Threads', 'Reads', 'Replies', 'Course Last Access', 'Semester', 'Is Active Course']);
			});

			it('should get headersForExport and dataForExport[0] for active course when s3 is not enabled and course has no semester', async() => {
				const data = {
					records: [
						[101, USER_ID, ROLE_ID, 0, 80, 6600, 1607979700000, 3, 3, 3, 0.90]
					],
					orgUnitTree: {
						isActive: (orgUnitId) => orgUnitId >= 100,
						getName: (orgUnitId) => `Course ${orgUnitId}`,
						getAncestorIds: () => [100, 200],
						getType: () => 25
					},
					semesterTypeId : 5
				};

				const el = await fixture(getTableHtml({ data, s3Enabled: false, isActive: true }));
				await new Promise(resolve => setTimeout(resolve, 200));
				await el.updateComplete;
				expect(el.dataForExport[0]).to.deep.equal(
					[ 'Course 101 (Id: 101)', '80 %', '110', 3, 3, 3, getLocalDateTime(1607979700000), '', true]);
				expect(el.headersForExport).to.deep.equal(['Course Name', 'Grade', 'Time in Content (mins)', 'Threads', 'Reads', 'Replies', 'Course Last Access', 'Semester', 'Is Active Course']);
			});
		});
	});
});

function getTableHtml({ data, s3Enabled, isActive }) {
	return html`
		<d2l-insights-user-drill-courses-table
			.data="${data}"
			.user="${user}"
			?active-table="${isActive}"
			?student-success-system-enabled="${s3Enabled}"
			discussions-col	grade-col last-access-col tic-col predicted-grade-col
			.selectedCourses="${selectedCourses}">
		</d2l-insights-user-drill-courses-table>
	`;
}

async function setupTable(tableHtml) {
	const el = await fixture(tableHtml);
	// give it a second to make sure inner table and paging controls load in
	await new Promise(resolve => setTimeout(resolve, 200));
	await el.updateComplete;
	const innerTable = await getInnerTable(el);
	const headers = innerTable.shadowRoot.querySelectorAll('th');

	return [el, innerTable, headers];
}

async function getInnerTable(el) {
	const innerTable = el.shadowRoot.querySelector('d2l-insights-table');
	await new Promise(resolve => setTimeout(resolve, 200));
	await innerTable.updateComplete;
	return innerTable;
}

function verifySorting(hasS3, tableHtml, expectedRecords, sortFunction, colIdx, colName, displayIndex = colIdx) {
	it(`should sort by the ${colName} column with${hasS3 ? '' : 'out'} s3`, async() => {
		const [, innerTable, headers] = await setupTable(tableHtml);

		const expectedDesc = [...expectedRecords.map(record => record[colIdx])].sort(sortFunction).reverse();

		// first click to sort by descending order
		headers.item(displayIndex).click();
		await innerTable.updateComplete;
		expect(innerTable.data.map(record => record[displayIndex])).to.deep.equal(expectedDesc);

		const expectedAsc = [...expectedRecords.map(record => record[colIdx])].sort(sortFunction);

		// then click again to sort by ascending order
		headers.item(displayIndex).click();
		await innerTable.updateComplete;
		expect(innerTable.data.map(record => record[displayIndex])).to.deep.equal(expectedAsc);
	});
}

// forces non-numeric items to the front of the list. e.g. ['1', '3', 'a', '2'] -> ['a', '1', '2', '3']
function numsWithTextSort(item1, item2) {
	const num1 = parseInt(item1);
	const num2 = parseInt(item2);

	if (isNaN(num1)) {
		if (isNaN(num2)) return 0;
		return -1;
	} else if (isNaN(num2)) {
		return 1;
	} else {
		return num1 - num2;
	}
}

// forces non-date items to the front of the list. e.g. ['Dec 1', 'b', 'Dec 3', 'Dec 2'] -> ['b', 'Dec 1', 'Dec 2', 'Dec 3']
function datesWithTextSort(item1, item2) {
	const time1 = new Date(item1).getTime();
	const time2 = new Date(item2).getTime();

	if (isNaN(time1)) {
		if (isNaN(time2)) return 0;
		return -1;
	} else if (isNaN(time2)) {
		return 1;
	} else {
		return time1 - time2;
	}
}

function getLocalDateTime(timestamp) {
	return formatDateTimeFromTimestamp(timestamp, { format: 'medium' });
}
