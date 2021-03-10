import '../../components/content-view-histogram';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

const data = {
	withoutFilter: () => ({
		users: new Array(6).fill([0, 0, 0, 0, 0, 0])
	})
};

describe('content-view-histogram', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-labs-content-view-histogram');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-labs-content-view-histogram .data="${data}"></d2l-labs-content-view-histogram>`);
			await expect(el).to.be.accessible();
		});
	});
});
