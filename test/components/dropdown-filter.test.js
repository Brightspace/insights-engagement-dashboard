import '../../components/dropdown-filter';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-dropdown-filter', () => {
	let el;
	const name = 'test';
	const testData = [
		{
			id: '1',
			name: 'name 1',
			displayName: 'name 1 id 1'
		},
		{
			id: '2',
			name: 'name 2',
			displayName: 'name 2 id 2'
		},
	];

	beforeEach(async() => {
		el = await fixture(html`<d2l-insights-dropdown-filter name="${name}" more .data="${testData}"></d2l-insights-dropdown-filter>`);
		await new Promise(resolve => setTimeout(resolve, 0)); // allow fetch to run
		await el.updateComplete;
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			await expect(el).to.be.accessible();
		});
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-dropdown-filter');
		});
	});

	describe('render', () => {
		it('should render the dropdown opener with the correct name if none are selected', async() => {
			const filter = el.shadowRoot.querySelector('d2l-labs-filter-dropdown');
			expect(filter.openerText).to.equal(`${name}: All`);
			expect(filter.openerTextSingle).to.equal(`${name}: 0 selected`);
			expect(filter.openerTextMultiple).to.equal(`${name}: 0 selected`);
		});

		it('should render the dropdown opener with the correct name if one is selected', async() => {
			const data = JSON.parse(JSON.stringify(testData)); // deep copy
			data[0].selected = true;

			el = await fixture(html`<d2l-insights-dropdown-filter name="${name}" more .data="${data}"></d2l-insights-dropdown-filter>`);
			await new Promise(resolve => setTimeout(resolve, 0)); // allow fetch to run
			await el.updateComplete;

			const filter = el.shadowRoot.querySelector('d2l-labs-filter-dropdown');
			expect(filter.openerText).to.equal(`${name}: All`);
			expect(filter.openerTextSingle).to.equal(`${name}: ${data[0].name}`);
			expect(filter.openerTextMultiple).to.equal(`${name}: ${data[0].name}`);
		});

		it('should render the dropdown opener with the correct name if multiple are selected', async() => {
			const data = JSON.parse(JSON.stringify(testData)); // deep copy
			data[0].selected = true;
			data[1].selected = true;

			el = await fixture(html`<d2l-insights-dropdown-filter name="${name}" more .data="${data}"></d2l-insights-dropdown-filter>`);
			await new Promise(resolve => setTimeout(resolve, 0)); // allow fetch to run
			await el.updateComplete;

			const filter = el.shadowRoot.querySelector('d2l-labs-filter-dropdown');
			expect(filter.openerText).to.equal(`${name}: All`);
			expect(filter.openerTextSingle).to.equal(`${name}: 2 selected`);
			expect(filter.openerTextMultiple).to.equal(`${name}: 2 selected`);
		});

		it('should render with the correct checkbox elements', () => {
			const checkboxList = Array.from(el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option'));
			expect(checkboxList.length).to.equal(2);
			checkboxList.forEach((checkbox, idx) => {
				expect(checkbox.value).to.equal(testData[idx].id);
				expect(checkbox.text).to.equal(testData[idx].displayName);
				expect(checkbox.selected).to.be.false;
			});
		});

		it('should render search panel', () => {
			const category = el.shadowRoot.querySelector('d2l-labs-filter-dropdown-category');
			expect(category.disableSearch).to.be.false;
		});

		it('should hide search if `disable-search` is specified', async() => {
			el = await fixture(html`<d2l-insights-dropdown-filter name="${name}" .data="${testData}" disable-search></d2l-insights-dropdown-filter>`);
			await new Promise(resolve => setTimeout(resolve, 0)); // allow fetch to run
			await el.updateComplete;

			const category = el.shadowRoot.querySelector('d2l-labs-filter-dropdown-category');
			expect(category.disableSearch).to.be.true;
		});

		it('should return only selected items when they are de/selected', async() => {
			// everything should be deselected initially
			expect(el.selected).to.deep.equal([]);

			const checkboxes = Array.from(el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option'));

			checkboxes.find(checkbox => checkbox.value === '1').click();
			checkboxes.find(checkbox => checkbox.value === '2').click();

			expect(el.selected).to.deep.equal(['1', '2']);

			checkboxes.find(checkbox => checkbox.value === '2').click();

			expect(el.selected).to.deep.equal(['1']);
		});
	});

	describe('search', () => {
		it('should filter the items when d2l-labs-filter-dropdown-category-searched is handled', async() => {
			const dropdownCategorySearchedEvent = { detail: { value: '2' } };

			el._handleSearchedClick(dropdownCategorySearchedEvent);
			await el.updateComplete;

			const checkboxList = [...el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option')];
			expect(checkboxList[0].hidden).to.be.true;
			expect(checkboxList[1].hidden).to.be.not.true;
		});

		it('should maintain selected state across searches', async() => {
			const checkboxList = [...el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option')];

			el._handleSearchedClick({ detail: { value: '2' } });
			await el.updateComplete;
			expect(checkboxList[0].selected).to.be.false;
			expect(checkboxList[1].selected).to.be.false;

			checkboxList[1].click();
			await el.updateComplete;
			expect(checkboxList[0].selected).to.be.false;
			expect(checkboxList[1].selected).to.be.true;

			el._handleSearchedClick({ detail: { value: '' } });
			await el.updateComplete;
			expect(checkboxList[0].selected).to.be.false;
			expect(checkboxList[1].selected).to.be.true;
		});

		it('should be case-insensitive', async() => {
			const dropdownCategorySearchedEvent = { detail: { value: 'nAMe 2' } };

			el._handleSearchedClick(dropdownCategorySearchedEvent);
			await el.updateComplete;

			const checkboxList = [...el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option')];
			expect(checkboxList[0].hidden).to.be.true;
			expect(checkboxList[1].hidden).to.be.not.true;
		});
	});

	describe('eventing', () => {
		it('should fire a `selected` event whenever one of the checkboxes is clicked', async() => {
			let listener = oneEvent(el, 'd2l-insights-dropdown-filter-selected');
			const checkboxList = Array.from(el.shadowRoot.querySelectorAll('d2l-labs-filter-dropdown-option'));

			checkboxList[0].click();

			let event = await listener;
			expect(event.type).to.equal('d2l-insights-dropdown-filter-selected');
			expect(event.detail).to.deep.equal({ itemId: '1', selected: true });

			// verify `selected` property changed
			expect(el.selected.length).to.equal(1);
			expect(el.selected[0]).to.equal('1');

			//  verify opener textes are changed
			let filter = el.shadowRoot.querySelector('d2l-labs-filter-dropdown');
			expect(filter.openerText).to.equal(`${name}: All`);
			expect(filter.openerTextSingle).to.equal(`${name}: ${testData[0].name}`);
			expect(filter.openerTextMultiple).to.equal(`${name}: ${testData[0].name}`);

			listener = oneEvent(el, 'd2l-insights-dropdown-filter-selected');

			checkboxList[0].click();

			event = await listener;
			expect(event.type).to.equal('d2l-insights-dropdown-filter-selected');
			expect(event.detail).to.deep.equal({ itemId: '1', selected: false });

			// verify `selected` property changed
			expect(el.selected.length).to.equal(0);

			// verify opener texts are changed
			filter = el.shadowRoot.querySelector('d2l-labs-filter-dropdown');
			expect(filter.openerText).to.equal(`${name}: All`);
			expect(filter.openerTextSingle).to.equal(`${name}: 0 selected`);
			expect(filter.openerTextMultiple).to.equal(`${name}: 0 selected`);
		});

		it('should fire a `cleared` event when d2l-insights-dropdown-filter-selection-cleared is handled', async() => {
			const listener = oneEvent(el, 'd2l-insights-dropdown-filter-selection-cleared');

			el._clearSelectionClick();

			const event = await listener;
			expect(event.type).to.equal('d2l-insights-dropdown-filter-selection-cleared');
			expect(event.detail).to.be.null;
		});

		it('should fire a `close` event when d2l-insights-dropdown-filter-close is handled', async() => {
			const listener = oneEvent(el, 'd2l-insights-dropdown-filter-close');

			el._filterClose();

			const event = await listener;
			expect(event.type).to.equal('d2l-insights-dropdown-filter-close');
			expect(event.detail).to.be.null;
		});
	});
});
