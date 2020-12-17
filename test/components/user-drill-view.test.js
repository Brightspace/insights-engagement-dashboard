import '../../components/user-drill-view';

import { expect, fixture, html } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { flush } from '@polymer/polymer/lib/utils/render-status.js';
import { mockOuTypes } from '../model/mocks';
import noProfile from '../responses/no_profile';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-user-drill-view', () => {
	const user = {
		firstName: 'firstName',
		lastName: 'lastName',
		username: 'username',
		userId: 232
	};

	const data = {
		_data: {
			serverData: {
				orgUnits: [
					[1, 'Course 1', mockOuTypes.course, [1001], false],
					[2, 'Course 2', mockOuTypes.course, [1001], false],
					[3, 'Course 3', mockOuTypes.course, [1002], true]
				]
			}
		},
	};

	data.recordsByUser = new Map();

	afterEach(() => {
		// d2l-action-button-group uses afterNextRender that causes
		// 'Cannot read property 'disconnect' of undefined'
		// when scheduled rendering does not happen, but the node is removed
		// flush - fixes that by calling scheduled rendering. Alternative is fixing d2l-action-button-group attached/detached functions
		flush();
	});

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-user-drill-view');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view .user=${user} .data=${data}></d2l-insights-user-drill-view>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {

		const temp = window.d2lfetch.fetch;

		before(() => {
			D2L.LP = {
				Web: {
					Authentication: {
						OAuth2: {
							GetToken: function() { return Promise.resolve('token'); }
						}
					}
				}
			};
			window.d2lfetch.fetch = fetchMock.sandbox().get('path:/d2l/api/hm/users/232', noProfile);
		});

		after(() => {
			D2L.LP = {};
			window.d2lfetch.fetch = temp;
		});

		it('should render proper title and sub-title', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view .user=${user} .data=${data}></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 10));

			const title = el.shadowRoot.querySelector('div.d2l-insights-user-drill-view-profile-name > div.d2l-heading-2').innerText;
			expect(title).to.equal('firstName lastName');

			const subTitle = el.shadowRoot.querySelector('div.d2l-insights-user-drill-view-profile-name > div.d2l-body-small').innerText;
			expect(subTitle).to.equal('username - 232');
		});

		it('should render the users profile', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view
				.user=${user}
			></d2l-insights-user-drill-view>`);
			const profile = el.shadowRoot.querySelector('d2l-profile-image');
			await new Promise(res => setTimeout(res, 10));

			const names = [profile._firstName, profile._lastName];
			const results = ['First', 'Last'];

			expect(names).to.eql(results);
		});
	});
});
