import '../../components/column-configuration';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-column-configuration', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-column-configuration');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-engagement-column-configuration></d2l-insights-engagement-column-configuration>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('card selection', () => {
		it('should update properties when columns are selected', async() => {
			const el = await fixture(html`<d2l-insights-engagement-column-configuration></d2l-insights-engagement-column-configuration>`);
			const listItem = el.shadowRoot.querySelector('d2l-list-item[key="showTicCol"]');

			listItem.setSelected(true);
			await el.updateComplete;
			expect(el.showTicCol).to.be.true;
			expect(el.showGradeCol).to.be.false;

			listItem.setSelected(false);
			await el.updateComplete;
			expect(el.showTicCol).to.be.false;
			expect(el.showGradeCol).to.be.false;
		});
	});
});
