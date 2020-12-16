import '../../components/summary-cards-container';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-results-card', () => {
	const data = {
		users: [],
		withoutFilter: () => ({ records: [] }),
		getFilter: () => ({ selectedCategories: new Set() })
	};

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-summary-cards-container');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-summary-cards-container .data="${data}" overdue-card results-card system-access-card discussions-card></d2l-summary-cards-container>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		function getSelector(propertyName, propertyValue) {
			return propertyValue ? `[${propertyName}]` : `:not([${propertyName}])`;
		}

		const allCards = [
			'discussion-activity-card',
			'overdue-assignments-card',
			'results-card',
			'last-access-card'
		];

		[
			{ cards: allCards, properties: [] },
			{ cards: [], properties: [] },
			{ cards: ['results-card'], properties: [{ wide: true, tall: true }] },
			{ cards: ['results-card', 'last-access-card'], properties: [{ wide: true }, { wide: true }] },
			{ cards: ['results-card', 'overdue-assignments-card', 'discussion-activity-card'], properties: [{ wide: true }] }
		]
			.forEach(testCase =>
				it(`should show selected cards (${testCase.cards})`, async() => {
					const el = await fixture(html`<d2l-summary-cards-container
						.data="${data}"

						?discussions-card="${testCase.cards.includes('discussion-activity-card')}"
						?overdue-card="${testCase.cards.includes('overdue-assignments-card')}"
						?results-card="${testCase.cards.includes('results-card')}"
						?system-access-card="${testCase.cards.includes('last-access-card')}"
					></d2l-summary-cards-container>`);
					await new Promise(resolve => setTimeout(resolve, 100));

					allCards.forEach(card => {
						const cardIndex = testCase.cards.findIndex(c => c === card);
						let cardProps = { wide: false, tall: false };
						if (cardIndex > -1 && cardIndex < testCase.properties.length) {
							cardProps = Object.assign({ wide: false, tall: false }, testCase.properties[cardIndex]);
						}

						const renderedCard = el.shadowRoot.querySelector(`d2l-insights-${card}${getSelector('wide', cardProps.wide)}${getSelector('tall', cardProps.tall)}`);
						if (cardIndex > -1) {
							expect(renderedCard, card).to.exist;
						} else {
							expect(renderedCard, card).to.not.exist;
						}
					});
				})
			);
	});
});
