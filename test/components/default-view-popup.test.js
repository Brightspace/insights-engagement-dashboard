import '../../components/default-view-popup';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper';

describe('d2l-insights-default-view-popup', () => {
	const data = [
		{ id: 1, name: 'Course 1' },
		{ id: 2, name: 'Course 2' },
		{ id: 3, name: 'Course 3' }
	];
	let el;

	beforeEach(async() => {
		el = await fixture(html`
				<d2l-insights-default-view-popup
					opened
					.data="${data}"
				></d2l-insights-default-view-popup>
			`);
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-default-view-popup');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should have the correct entries for the courses list', () => {
			const listEntries = Array.from(el.shadowRoot.querySelectorAll('li'));
			listEntries.forEach((entry, idx) => {
				const expected = data[idx];
				expect(entry.innerText).to.equal(`${expected.name} (Id: ${expected.id})`);
			});
		});
	});

	describe('okButton', () => {
		it('should close when the ok button is clicked', async() => {
			const okButton = el.shadowRoot.querySelector('d2l-button');
			okButton.click();
			expect(el.opened).to.be.false;
		});
	});
});