import '../../components/user-drill-view';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import fetchMock from 'fetch-mock/esm/client';
import { flush } from '@polymer/polymer/lib/utils/render-status.js';
import { mockOuTypes } from '../model/mocks';
import noProfile from '../responses/no_profile';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from 'sinon/pkg/sinon-esm.js';

describe('d2l-insights-user-drill-view', () => {
	const user = {
		userId: 232,
		firstName: 'firstName',
		lastName: 'lastName',
		username: 'username',
		lastSysAccess: 1606900000000
	};

	const userRecords = [
		[3, 232, 0, 0, 45, 0, 0, 0, 0, 0, null],
		[2, 232, 0, 1, 78, 0, 0, 0, 0, 0, null]
	];

	const filter = {
		get isApplied() {
			return this._isApplied;
		},
		set isApplied(value) {
			this._isApplied = value;
		}
	};

	const data = {
		_data: {
			serverData: {
				orgUnits: [
					[1, 'Course 1', mockOuTypes.course, [1001], false],
					[2, 'Course 2', mockOuTypes.course, [1001], false],
					[3, 'Course 3', mockOuTypes.course, [1002], true],
					[4, 'Course 4', mockOuTypes.course, [1002], true],
					[5, 'Course 5', mockOuTypes.course, [1002], true],
					[6, 'Course 6', mockOuTypes.course, [1002], true],
					[7, 'Course 7', mockOuTypes.course, [1002], true],
					[8, 'Course 8', mockOuTypes.course, [1002], true],
					[9, 'Course 9', mockOuTypes.course, [1002], true],
					[10, 'Course 10', mockOuTypes.course, [1002], true],
					[11, 'Course 11', mockOuTypes.course, [1002], true]
				],
			}
		},
		records: userRecords,
		orgUnitTree: {
			isActive: () => true,
			getName: () => '',
			getAncestorIds: () => [],
			getType: () => 0
		},
		users: [Object.values(user)],
		getFilter: () => filter
	};

	data.recordsByUser = new Map();
	data.recordsByUser.set(user.userId, data.records);
	data.userDictionary = new Map();
	data.userDictionary.set(user.userId, Object.values(user));

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
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user=${user} .data=${data}></d2l-insights-user-drill-view>`);
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
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user=${user} .data=${data}></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 10));

			const title = el.shadowRoot.querySelector('div.d2l-insights-user-drill-view-profile-name > div.d2l-heading-2').innerText;
			expect(title).to.equal('firstName lastName');

			const subTitle = el.shadowRoot.querySelector('div.d2l-insights-user-drill-view-profile-name > div.d2l-body-small').innerText;
			expect(subTitle).to.equal('username - 232');
		});

		it('should render the users profile', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view
				.user=${user} .data=${data}
			></d2l-insights-user-drill-view>`);
			const profile = el.shadowRoot.querySelector('d2l-profile-image');
			await new Promise(res => setTimeout(res, 140));

			const names = [profile._firstName, profile._lastName];
			const results = ['First', 'Last'];

			expect(names).to.eql(results);
		});

		it('should render no user error message if there is no user', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view .data=${data}></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 10));

			const errorMessage = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(errorMessage.type).to.equal('button');
			expect(errorMessage.text).to.equal('This user could not be loaded. Go to the Engagement Dashboard to view the list of users.');
		});

		it('should render no data error message if user exists but has no data', async() => {
			const dataNoRecords = { ...data };
			dataNoRecords.records = [];

			const el = await fixture(html`<d2l-insights-user-drill-view .user="${user}" .data=${dataNoRecords}></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 10));

			const errorMessage = el.shadowRoot.querySelector('d2l-insights-message-container');
			expect(errorMessage.type).to.equal('default');
			expect(errorMessage.text).to.equal('No data in filtered ranges. Refine your selection.');
		});

		it('should return correct data from coursesInView user card', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');

			expect(summaryCards[0].value).to.eql('2');
			expect(summaryCards[0].message).to.eql('courses returned within results.');
			expect(summaryCards[0].title).to.eql('Courses in View');
		});

		it('should return correct data from overdueAssignments user card', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');

			expect(summaryCards[2].value).to.eql('1');
			expect(summaryCards[2].message).to.eql('assignments are currently overdue.');
			expect(summaryCards[2].title).to.eql('Overdue Assignments');
		});

		it('should return correct data from systemAccess user card', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');

			expect(summaryCards[3].value).to.eql('12');
			expect(summaryCards[3].message).to.eql('days since the learner last accessed the system.');
			expect(summaryCards[3].title).to.eql('System Access');
		});

		it('should return correct data from systemAccess user card if user never accessed the system', async() => {
			data.userDictionary.set(232, [232, '', '', '', null]);
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');

			expect(summaryCards[3].value).to.eql('');
			expect(summaryCards[3].message).to.eql('User has never accessed the system.');
			expect(summaryCards[3].title).to.eql('System Access');
		});

		it('should return correct data from average grades card', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');
			expect(summaryCards[1].value).to.eql('61.5 %');
			expect(summaryCards[1].message).to.eql('grade averaged from the courses in view.');
			expect(summaryCards[1].title).to.eql('Average Grade');
		});

		it('should render the proper message in average grades card if no grades available', async() => {
			data.recordsByUser.set(232, []);
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 20));
			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const summaryCards = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card');
			expect(summaryCards[1].value).to.eql('');
			expect(summaryCards[1].message).to.eql('No grade information available.');
			expect(summaryCards[1].title).to.eql('Average Grade');
		});

		it('should render the alert if there are >= 10 courses', async() => {
			data.recordsByUser = new Map();
			data.recordsByUser.set(232, []);
			(new Array(11)).fill([]).forEach((record, i) => data.recordsByUser.get(232).push([i + 1, 232]));

			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 50));

			const alert = el.shadowRoot.querySelector('d2l-alert');
			expect(alert.hidden).to.equal(false);
		});

		it('should not render the alert if there are < 10 courses', async() => {
			data.recordsByUser = new Map();
			(new Array(8)).fill([]).forEach(record => data.recordsByUser.set(232, record));

			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 50));

			const alert = el.shadowRoot.querySelector('d2l-alert');
			expect(alert.hidden).to.equal(true);
		});
	});

	describe('interactions/eventing', () => {

		it('should set filter after click on overdue assignment card', async() => {
			const el = await fixture(html`<d2l-insights-user-drill-view demo .user="${user}" .data="${data}" org-unit-id=100></d2l-insights-user-drill-view>`);
			await new Promise(res => setTimeout(res, 250));

			const summaryCardsContainer = el.shadowRoot.querySelector('d2l-summary-cards-container');
			const overdueAssignmentsCard = summaryCardsContainer.shadowRoot.querySelectorAll('d2l-labs-summary-card')[2];

			const listener = oneEvent(overdueAssignmentsCard, 'd2l-labs-summary-card-value-click');

			const isAppliedSpy = sinon.spy(filter, 'isApplied', ['set']);
			const button = overdueAssignmentsCard.shadowRoot.querySelector('.d2l-insights-summary-card-button');
			button.click();

			const event = await listener;
			expect(event).exist;
			expect(isAppliedSpy.set.calledWith(true)).to.be.true;
		});
	});
});
