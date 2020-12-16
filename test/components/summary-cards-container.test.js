import '../../components/summary-cards-container';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-summary-cards', () => {
	const data = {
		users: [],
		withoutFilter: () => ({ records: [], users: [] }),
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
			{ pos: 'show-top-left', name: 'd2l-insights-results-card' },
			{ pos: 'show-top-right', name: 'd2l-insights-overdue-assignments-card' },
			{ pos: 'show-bottom-left', name: 'd2l-insights-discussion-activity-card' },
			{ pos: 'show-bottom-right', name: 'd2l-insights-last-access-card' }
		];

		[
			{ cards: allCards, properties: [] },
			{ cards: [], properties: [] },
			{ cards: [allCards[0]], properties: [{ wide: true, tall: true }] },
			{ cards: [allCards[0], allCards[3]], properties: [{ wide: true }, { wide: true }] },
			{ cards: [allCards[0], allCards[3], allCards[2]], properties: [{ wide: true }] }
		]
			.forEach(testCase =>
				it(`should show selected cards (${testCase.cards.map(card => card.name).join(', ')})`, async() => {
					const el = await fixture(html`
						<d2l-summary-cards-selector
							.data="${data}"
							view="home"

							?show-top-left="${testCase.cards.find(card => card.pos === 'show-top-left')}"
							?show-top-right="${testCase.cards.find(card => card.pos ===  'show-top-right')}"
							?show-bottom-left="${testCase.cards.find(card => card.pos ===  'show-bottom-left')}"
							?show-bottom-right="${testCase.cards.find(card => card.pos ===  'show-bottom-right')}"
						>
					</d2l-summary-cards-selector>`);
					await new Promise(resolve => setTimeout(resolve, 100));

					allCards.forEach(card => {
						const cardIndex = testCase.cards.findIndex(c => c === card);
						let cardProps = { wide: false, tall: false };
						if (cardIndex > -1 && cardIndex < testCase.properties.length) {
							cardProps = Object.assign({ wide: false, tall: false }, testCase.properties[cardIndex]);
						}

						const renderedCard = el.shadowRoot.querySelector('d2l-summary-cards-container')
							.shadowRoot.querySelector(`${card.name}${getSelector('wide', cardProps.wide)}${getSelector('tall', cardProps.tall)}`);
						console.log(el.shadowRoot.querySelector('d2l-summary-cards-container'));
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
