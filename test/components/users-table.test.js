import '../../components/users-table.js';
import { expect, fixture, html } from '@open-wc/testing';
import { mockRoleIds, records } from '../model/mocks';
import { RECORD, USER } from '../../consts';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime.js';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const data = {
	users: [
		[100, 'John', 'Lennon', 'jlennon',  1600295350000],
		[200, 'Paul', 'McCartney', 'pmccartney', null],
		[300, 'George', 'Harrison', 'gharrison', 1603093368278],
		[400, 'Ringo', 'Starr', 'rstarr', 1602295350000],
		...Array.from(
			{ length: 19 },
			(val, idx) => [
				idx,
				`zz${idx}First`,
				`zz${idx}Last`,
				`username${idx}`,
				null
			]
		)
	],
	records: [
		...records,
		...Array.from({ length: 19 }, (val, idx) => [111, idx, mockRoleIds.student, 1, 93, 7000, null])
	]
};
data.recordsByUser = new Map();
data.records.forEach(r => {
	if (!data.recordsByUser.has(r[RECORD.USER_ID])) {
		data.recordsByUser.set(r[RECORD.USER_ID], []);
	}
	data.recordsByUser.get(r[RECORD.USER_ID]).push(r);
});

const expected = [
	[['Harrison, George', 'gharrison - 300'], 14, '71.42 %', '19.64', getLocalDateTime(2)],
	[['Lennon, John', 'jlennon - 100'], 12, '22 %', '2.78', getLocalDateTime(0)],
	[['McCartney, Paul', 'pmccartney - 200'], 13, '74 %', '23.72', 'NULL'],
	[['Starr, Ringo', 'rstarr - 400'], 9, '55 %', '8.33', getLocalDateTime(3)],
	...Array.from({ length: 19 }, (val, idx) => [
		[`zz${idx}Last, zz${idx}First`, `username${idx} - ${idx}`],
		1,
		'93 %',
		'116.67',
		'NULL'
	]).sort((u1, u2) => u1[0][0].localeCompare(u2[0][0]))
];

describe('d2l-insights-users-table', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-users-table');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-users-table .data="${data}"></d2l-insights-users-table>`);
			// give it a second to make sure inner table and paging controls load in
			await new Promise(resolve => setTimeout(resolve, 200));
			await el.updateComplete;

			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should display the correct total users count', async() => {
			const el = await fixture(html`<d2l-insights-users-table .data="${data}"></d2l-insights-users-table>`);
			const totalUsersText = el.shadowRoot.querySelectorAll('.d2l-insights-users-table-total-users')[0];
			expect(totalUsersText.innerText).to.equal('Total Users: 23');
		});
	});

	describe('pagination', () => {
		describe('when there are users in the table', () => {
			let el;
			let pageSizeSelector;
			let pageSelector;
			let innerTable;

			async function finishUpdate() {
				await new Promise(resolve => setTimeout(resolve, 200));
				await innerTable.updateComplete;
				await pageSelector.updateComplete;
			}

			before(async function() {
				this.timeout(10000);

				el = await fixture(html`<d2l-insights-users-table .data="${data}"></d2l-insights-users-table>`);
				innerTable = el.shadowRoot.querySelector('d2l-insights-table');
				await new Promise(resolve => setTimeout(resolve, 200));
				await innerTable.updateComplete;
				pageSelector = el.shadowRoot.querySelector('d2l-labs-pagination');
				await pageSelector.updateComplete;
				pageSizeSelector = pageSelector.shadowRoot.querySelector('select');
			});

			// this test is randomly very flaky. When testing locally, I was able to reproduce the error by
			// minimizing my browser, so I think the browsers are also being minimized on the Sauce servers.
			// I don't see any options to force maximized windows though, so I'm increasing timeout in `before` instead
			it('should show the first 20 users in order on the first page, if there are more than 20 users', () => {
				// the default page size is 20
				expect(pageSelector.selectedCountOption).to.equal(20);
				expect(pageSelector.maxPageNumber).to.equal(2);
				expect(pageSelector.pageNumber).to.equal(1);

				// since there are 23 users, the first (default) page should show the first 20 users, in order, on it
				verifyColumns(innerTable, 20, 0);
			});

			it('should show the correct number of users on the last page', async() => {
				pageSelector
					.shadowRoot.querySelector('d2l-button-icon[text="Next page"]')
					.shadowRoot.querySelector('button')
					.click();
				await finishUpdate();

				expect(pageSelector.pageNumber).to.equal(2);

				verifyColumns(innerTable, 3, 20);
			});

			it('should change number of users shown and total number of pages if the page size changes', async() => {
				pageSizeSelector.value = '10';
				pageSizeSelector.dispatchEvent(new Event('change'));
				await finishUpdate();

				expect(pageSelector.selectedCountOption).to.equal(10);
				expect(pageSelector.maxPageNumber).to.equal(3);
				expect(pageSelector.pageNumber).to.equal(1);

				verifyColumns(innerTable, 10, 0);

				pageSelector
					.shadowRoot.querySelector('d2l-button-icon[text="Next page"]')
					.shadowRoot.querySelector('button')
					.click();
				await finishUpdate();

				expect(pageSelector.pageNumber).to.equal(2);

				verifyColumns(innerTable, 10, 10);

				pageSelector
					.shadowRoot.querySelector('d2l-button-icon[text="Next page"]')
					.shadowRoot.querySelector('button')
					.click();
				await finishUpdate();

				expect(pageSelector.pageNumber).to.equal(3);

				verifyColumns(innerTable, 3, 20);
			});

			it('should show all users on a single page if there are fewer users than the page size', async() => {
				pageSizeSelector.value = '50';
				pageSizeSelector.dispatchEvent(new Event('change'));
				await finishUpdate();

				expect(pageSelector.selectedCountOption).to.equal(50);
				expect(pageSelector.maxPageNumber).to.equal(1);
				expect(pageSelector.pageNumber).to.equal(1);

				verifyColumns(innerTable, 23, 0);
			});

			it('should show zero pages if there are no users to display', async() => {
				el.data = { users: [] };
				await finishUpdate();

				expect(pageSelector.selectedCountOption).to.equal(50);
				expect(pageSelector.maxPageNumber).to.equal(0);
				expect(pageSelector.pageNumber).to.equal(0);

				verifyColumns(innerTable, 0, 0);
			});

			it('should show 20 skeleton rows with zero pages if loading', async() => {
				el.data = { users: [], isLoading: true };
				el.skeleton = true;
				await finishUpdate();

				expect(pageSelector.selectedCountOption).to.equal(50);
				expect(pageSelector.maxPageNumber).to.equal(0);
				expect(pageSelector.pageNumber).to.equal(0);

				const displayedUsers = Array.from(innerTable.shadowRoot.querySelectorAll('tbody > tr > td:first-child'));
				expect(displayedUsers.length).to.equal(20);
			});
		});
	});

	describe('sorting', () => {

		let headers;
		let userTable;

		before(async function() {
			this.timeout(10000);

			const table = await fixture(html`<d2l-insights-users-table .data="${data}"></d2l-insights-users-table>`);
			await new Promise(resolve => setTimeout(resolve, 200));
			await table.updateComplete;

			userTable = table.shadowRoot.querySelector('d2l-insights-table');
			headers = userTable.shadowRoot.querySelectorAll('th');
		});

		const checkIfSorted = (column, order, convertToNumber = false, convertToLower = false, data = undefined) => {

			const records = data === undefined ? userTable.data.map(user => user[column]) : data;

			console.log(records);

			let inOrder = 'In Order';
			records.forEach((record, i) => {

				if (convertToNumber) {
					record = Number.parseFloat(record.replace('%', '').trim());
				}
				if (convertToLower) {
					record = record.toLowerCase();
				}
				if (i > 0) {
					let previous = records[i - 1];
					if (convertToNumber) {
						previous = Number.parseFloat(previous.replace('%', '').trim());
					}
					console.log(`Before: ${previous} After: ${record}`);
					if (order === 'desc' && !(record <= previous)) {
						inOrder = 'Out of Order';
					}
					else if (order === 'asc' && !(record >= previous)) {
						inOrder = 'Out of Order';
					}
				}
			});
			expect(inOrder).to.equal('In Order');

		};

		it('should sort by last name when header is clicked', async() => {

			// first click for descending order
			headers.item(0).click();
			await userTable.updateComplete;
			checkIfSorted(0, 'desc', false, true, userTable.data.map(record => record[0][0].split(',')[0]));

			// then sort by ascending order
			headers.item(0).click();
			await userTable.updateComplete;
			checkIfSorted(0, 'asc', false, true, userTable.data.map(record => record[0][0].split(',')[0]));
		});

		it('should sort by course total when header is clicked', async() => {

			// first click for descending order
			headers.item(1).click();
			await userTable.updateComplete;
			checkIfSorted(1, 'desc');

			// then sort by ascending order
			headers.item(1).click();
			await userTable.updateComplete;
			checkIfSorted(1, 'asc');
		});

		it('should sort by average grade when header is clicked', async() => {

			// first click for descending order
			headers.item(2).click();
			await userTable.updateComplete;
			checkIfSorted(2, 'desc', true);

			// then sort by ascending order
			headers.item(2).click();
			await userTable.updateComplete;
			checkIfSorted(2, 'asc', true);
		});

		it('should sort by average time in content when header is clicked', async() => {

			// first click for descending order
			headers.item(3).click();
			await userTable.updateComplete;
			checkIfSorted(3, 'desc', true);

			// then sort by ascending order
			headers.item(3).click();
			await userTable.updateComplete;
			checkIfSorted(3, 'asc', true);
		});

	});
});

function verifyColumns(table, expectedNumDisplayedRows, startRowNum) {
	let displayedUserInfo = Array.from(table.shadowRoot.querySelectorAll('tbody > tr > td:first-child'));
	expect(displayedUserInfo.length).to.equal(expectedNumDisplayedRows);
	displayedUserInfo.forEach((cell, rowIdx) => {
		const mainText = cell.querySelector('div:first-child');
		const subText = cell.querySelector('div:last-child');
		expect(mainText.innerText).to.equal(expected[rowIdx + startRowNum][0][0]);
		expect(subText.innerText).to.equal(expected[rowIdx + startRowNum][0][1]);
	});

	[2, 3, 4, 5].forEach(child => {

		displayedUserInfo = Array.from(table.shadowRoot.querySelectorAll(`tbody > tr > td:nth-child(${child})`));
		expect(displayedUserInfo.length).to.equal(expectedNumDisplayedRows);
		displayedUserInfo.forEach((cell, rowIdx) => {
			const mainText = cell.querySelector('div');
			expect(mainText.innerText).to.equal(expected[rowIdx + startRowNum][child - 1].toString());
		});
	});
}

function getLocalDateTime(rowIndex) {
	return formatDateTime(new Date(new Date(data.users[rowIndex][USER.LAST_SYS_ACCESS]).toISOString()), { format: 'medium' });
}
