import '../../components/ou-filter.js';

import { disableUrlStateForTesting, enableUrlState } from '../../model/urlState';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import { Tree } from '../../components/tree-filter.js';

async function waitForTree(el) {
	const selector = el.shadowRoot.querySelector('d2l-insights-tree-filter');
	await selector.treeUpdateComplete;
}

describe('d2l-insights-ou-filter', () => {

	before(() => disableUrlStateForTesting());
	after(() => enableUrlState());
	const sandbox = sinon.createSandbox();
	const data = {
		orgUnitTree: new Tree({
			nodes: [
				[1, 'root', 0, [0]],
				[2, 'node', 3, [1]],
			],
			selectedIds: [2]
		}),
		selectedSemesterIds: [2, 17, 19]
	};

	beforeEach(() => {
		sandbox.spy(data.orgUnitTree, 'setAncestorFilter');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-ou-filter');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-ou-filter .data="${data}"></d2l-insights-ou-filter>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render a tree-filter with the org-unit tree', async() => {
			const el = await fixture(html`<d2l-insights-ou-filter .data="${data}"></d2l-insights-ou-filter>`);
			const selector = el.shadowRoot.querySelector('d2l-insights-tree-filter');
			expect(selector.tree).to.equal(data.orgUnitTree);
			sinon.assert.calledOnce(data.orgUnitTree.setAncestorFilter);
			sinon.assert.calledWith(data.orgUnitTree.setAncestorFilter, data.selectedSemesterIds);
		});
	});

	describe('selection', () => {
		it('should return selected nodes', async() => {
			const el = await fixture(html`<d2l-insights-ou-filter .data="${data}"></d2l-insights-ou-filter>`);
			await waitForTree(el);
			expect(el.selected).to.deep.equal([2]);
		});
	});

	describe('events', () => {
		it('should fire d2l-insights-ou-filter-change on selection change', async() => {
			const el = await fixture(html`<d2l-insights-ou-filter .data="${data}"></d2l-insights-ou-filter>`);
			await waitForTree(el);

			const listener = oneEvent(el, 'd2l-insights-ou-filter-change');
			const childCheckbox = el.shadowRoot.querySelector('d2l-insights-tree-filter')
				.shadowRoot.querySelectorAll('d2l-insights-tree-selector-node')[0] // a child node
				.shadowRoot.querySelector('d2l-input-checkbox');

			childCheckbox.simulateClick();
			const event = await listener;

			expect(event.type).to.equal('d2l-insights-ou-filter-change');
			expect(event.target).to.equal(el);
		});
	});
});
