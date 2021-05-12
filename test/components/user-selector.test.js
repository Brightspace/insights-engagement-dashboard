import '../../components/user-selector';
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-user-selector', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-user-selector');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// give it a second to make sure users load in
			await new Promise(resolve => setTimeout(resolve, 200));
			await el.updateComplete;
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should show header that reflects sorting order', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// give it a second to make sure users load in
			await new Promise(resolve => setTimeout(resolve, 20));
			const header = Array.from(el.shadowRoot.querySelectorAll('.d2l-insights-user-selector-header > span'))
				.map(node => node.innerText)
				.join('');
			const sortedAscendingIcon = el.shadowRoot.querySelector('.d2l-insights-user-selector-header d2l-icon[aria-label="Sorted Ascending"]');

			expect(header).to.equal('Last Name,First Name');
			expect(el._sortColumn).to.equal('LAST NAME');
			expect(el._sortedAscending).to.be.true;
			expect(sortedAscendingIcon).not.null;
		});

		it('should change header text if sorting order is changed', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// give it a second to make sure users load in
			await new Promise(resolve => setTimeout(resolve, 20));
			const spans = Array.from(el.shadowRoot.querySelectorAll('.d2l-insights-user-selector-header > span'));
			const firstNameSpan = spans[1];

			firstNameSpan.click();

			await new Promise(resolve => setTimeout(resolve, 20));
			const header = Array.from(el.shadowRoot.querySelectorAll('.d2l-insights-user-selector-header > span'))
				.map(node => node.innerText)
				.join('');
			const sortedAscendingIcon = el.shadowRoot.querySelector('.d2l-insights-user-selector-header d2l-icon[aria-label="Sorted Ascending"]');

			expect(header).to.equal('First Name,Last Name');
			expect(el._sortColumn).to.equal('FIRST NAME');
			expect(el._sortedAscending).to.be.true;
			expect(sortedAscendingIcon).not.null;
		});

		it('should change header icon if sorting order is changed', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// give it a second to make sure users load in
			await new Promise(resolve => setTimeout(resolve, 20));
			const spans = Array.from(el.shadowRoot.querySelectorAll('.d2l-insights-user-selector-header > span'));
			const lastNameSpan = spans[0];

			lastNameSpan.click();

			await new Promise(resolve => setTimeout(resolve, 20));
			const header = Array.from(el.shadowRoot.querySelectorAll('.d2l-insights-user-selector-header > span'))
				.map(node => node.innerText)
				.join('');
			const sortedDescendingIcon = el.shadowRoot.querySelector('.d2l-insights-user-selector-header d2l-icon[aria-label="Sorted Descending"]');

			expect(header).to.equal('Last Name,First Name');
			expect(el._sortColumn).to.equal('LAST NAME');
			expect(el._sortedAscending).to.be.false;
			expect(sortedDescendingIcon).not.null;
		});

		it('Should add the Load More button if HasMoreItems from API is true', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			await waitUntil(
				() => el.shadowRoot.querySelector('d2l-button'), "Couldn't find the button"
			);
			expect(el.shadowRoot.querySelector('d2l-button')).to.exist;
		});

		it('Should not add the Load More button if HasMoreItems from API is false', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector demo></d2l-insights-user-selector>`);
			// wait for initial render
			await waitUntil(
				() => el.shadowRoot.querySelector('d2l-button'), "Couldn't find the button"
			);

			el._canLoadMore = false;
			await el.updateComplete;
			expect(el.shadowRoot.querySelector('d2l-button')).to.not.exist;
		});
	});

	describe('interactions/eventing', () => {
		const mockLmsResponseData = [
			{ Id: 1, FirstName: 'first name 1', LastName: 'last name 1', Username: 'username1' },
			{ Id: 2, FirstName: 'first name 2', LastName: 'last name 2', Username: 'username2' },
			{ Id: 3, FirstName: 'first name 3', LastName: 'last name 3', Username: 'username3' }
		];

		beforeEach(() => {
			fetchMock.reset();
			fetchMock.get('path:/d2l/api/ap/unstable/insights/data/engagement/users', { Items: mockLmsResponseData });
			D2L.LP = {
				Web: {
					Authentication: {
						OAuth2: {
							GetToken: function() { return Promise.resolve('token'); }
						}
					}
				}
			};
		});

		afterEach(() => {
			D2L.LP = {};
			fetchMock.reset();
		});

		it('should call LMS API', async() => {
			const el = await fixture(html`
				<d2l-insights-user-selector></d2l-insights-user-selector>`);
			await waitUntil(() => !el.skeleton);

			expect(el.users).to.deep.equal(mockLmsResponseData);
		});
	});
});
