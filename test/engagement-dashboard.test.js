import '../engagement-dashboard.js';
import { expect, fixture, html } from '@open-wc/testing';
import { LastAccessFilter } from '../components/last-access-card';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

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
					await new Promise(resolve => setTimeout(resolve, 100));

					allCards.forEach(card => {
						const renderedCard = el.shadowRoot.querySelector(`d2l-insights-${card}`);
						if (cards.includes(card)) {
							expect(renderedCard, card).to.exist;
						} else {
							expect(renderedCard, card).to.not.exist;
						}
					});
				})
			);
	});
});
