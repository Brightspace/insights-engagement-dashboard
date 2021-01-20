import '../engagement-dashboard.js';
import { expect, fixture, html } from '@open-wc/testing';
import { LastAccessFilter } from '../components/last-access-card';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import { trySelect } from './tools.js';

describe('d2l-insights-engagement-dashboard', () => {

	describe('accessibility', () => {
		it('should pass all axe tests', async function() {
			this.timeout(7000);

			const el = await fixture(html`<d2l-insights-engagement-dashboard
				course-access-card courses-col discussions-card discussions-col
				grade-col grades-card last-access-col overdue-card results-card
				system-access-card tic-col tic-grades-card
 				demo
 			></d2l-insights-engagement-dashboard>`);
			// need for this delay might be tied to the mock data async loading in engagement-dashboard.js
			await new Promise(resolve => setTimeout(resolve, 1500));

			// close the default view dialog that shows up. It causes browsers on OSX to assign aria-attributes and
			// roles to buttons in the background that are not normally allowed
			const defaultViewDialog = el.shadowRoot.querySelector('d2l-insights-default-view-popup');
			defaultViewDialog.opened = false;
			// wait for the dialog closing animation to finish
			await new Promise(resolve => setTimeout(resolve, 500));

			// the scroll wrapper table component has a button in an aria-hidden div
			// so it technically breaks the accessibility test. To get around this
			// we exclude that test from this element. Please check for this rule manually
			// or disable this rule and make sure no other issues were introduced
			// during future development.
			await expect(el).to.be.accessible({
				ignoredRules: [
					'aria-hidden-focus',
					'button-name' // d2l-scroll-wrapper draws button at the right edge of the table. This button does not have a label.
				]
			});
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-dashboard');
		});
	});

	describe('prefs', () => {
		it('should provide configured roles to the data object', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard
					include-roles="900, 1000, 11"
					demo
				></d2l-insights-engagement-dashboard>`);
			await new Promise(resolve => setTimeout(resolve, 100));
			await el.updateComplete;
			expect(el._serverData.selectedRoleIds).to.deep.equal([900, 1000, 11]);
		});

		it('should provide threshold to last access filter', async() => {
			const el = await fixture(html`<d2l-insights-engagement-dashboard
					last-access-threshold-days="6"
					demo
				></d2l-insights-engagement-dashboard>`);
			await new Promise(resolve => setTimeout(resolve, 100));

			expect(el._data.getFilter(new LastAccessFilter().id).thresholdDays).to.equal(6);
		});

		const allCards = [
			'course-last-access-card',
			'discussion-activity-card',
			'current-final-grade-card',
			'overdue-assignments-card',
			'results-card',
			'last-access-card',
			'time-in-content-vs-grade-card'
		];

		const smallCards = [
			{ card: 'discussion-activity-card', property: 'discussions-card' },
			{ card: 'overdue-assignments-card', property: 'overdue-card' },
			{ card: 'results-card', property: 'results-card' },
			{ card: 'last-access-card', property: 'system-access-card' }
		];

		[
			allCards,
			[],
			['results-card', 'last-access-card'],
			...allCards.map(omitCard => allCards.filter(card => card !== omitCard))
		]
			.forEach(cards =>
				it(`should show selected cards (${cards})`, async() => {
					const el = await fixture(html`<d2l-insights-engagement-dashboard
						?course-access-card="${cards.includes('course-last-access-card')}"
						?discussions-card="${cards.includes('discussion-activity-card')}"
						?grades-card="${cards.includes('current-final-grade-card')}"
						?overdue-card="${cards.includes('overdue-assignments-card')}"
						?results-card="${cards.includes('results-card')}"
						?system-access-card="${cards.includes('last-access-card')}"
						?tic-grades-card="${cards.includes('time-in-content-vs-grade-card')}"

						courses-col	discussions-col	grade-col last-access-col tic-col
						demo
					></d2l-insights-engagement-dashboard>`);
					await new Promise(resolve => setTimeout(resolve, 200));

					const summaryContainerEl = await trySelect(el.shadowRoot
						, 'd2l-summary-cards-container');

					allCards.forEach(async card => {
						let renderedCard = await trySelect(el.shadowRoot, `d2l-insights-${card}`);
						const smallCard = smallCards.find(c => c.card === card);
						if (smallCard) {
							renderedCard = await trySelect(summaryContainerEl.shadowRoot, `d2l-insights-${card}`);
						}
						if (cards.includes(card)) {
							expect(renderedCard, card).to.exist;
						} else {
							expect(renderedCard, card).to.not.exist;
						}
					});
				})
			);

		const allCols = new Map([
			['courses-col', 'Courses'],
			['grade-col', 'Average Grade'],
			['tic-col', 'Average Time in Content (mins)'],
			['discussions-col', 'Average Discussion Activity'],
			['last-access-col', 'Last Accessed System']
		]);
		const allColsKeys = Array.from(allCols.keys());

		[
			allColsKeys,
			[],
			['grade-col', 'discussions-col'],
			...allColsKeys.map(omitCol => allColsKeys.filter(col => col !== omitCol))
		].forEach(expectedList => {
			it(`should show selected columns in users table (${expectedList})`, async() => {
				// cards aren't loaded for this test
				const el = await fixture(html`<d2l-insights-engagement-dashboard
						?courses-col="${expectedList.includes('courses-col')}"
						?discussions-col="${expectedList.includes('discussions-col')}"
						?grade-col="${expectedList.includes('grade-col')}"
						?last-access-col="${expectedList.includes('last-access-col')}"
						?tic-col="${expectedList.includes('tic-col')}"
						demo
					></d2l-insights-engagement-dashboard>`);
				await new Promise(resolve => setTimeout(resolve, 100));

				const usersTable = await trySelect(el.shadowRoot, 'd2l-insights-users-table');
				const innerTable = await trySelect(usersTable.shadowRoot, 'd2l-insights-table');
				await innerTable.updateComplete;

				const actualColHeaders = Array.from(innerTable.shadowRoot.querySelectorAll('th'));
				expect(actualColHeaders.length).to.equal(expectedList.length + 2); // 2 extra for row-selector and name columns

				expect(actualColHeaders[0].firstElementChild.nodeName).to.equal('D2L-INPUT-CHECKBOX');
				expect(actualColHeaders[1].innerText.trim()).to.equal('Name');

				expectedList.forEach((col, idx) => {
					expect(actualColHeaders[idx + 2].innerText).to.equal(allCols.get(col));
				});
			});
		});
	});
});
