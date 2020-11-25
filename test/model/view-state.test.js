import { disableUrlStateForTesting, enableUrlState, setStateForTesting } from '../../model/urlState';
import { expect } from '@open-wc/testing';
import { ViewState } from '../../model/view-state';

const KEY = 'v';

describe('ViewState', () => {
	describe('urlState', () => {
		before(() => {
			enableUrlState();
		});
		after(() => disableUrlStateForTesting());

		it('should load home view from the url', async() => {
			setStateForTesting(KEY, 'home,0');

			const sut = new ViewState();

			expect(sut.currentView).equals('home');
			expect(sut.userViewUserId).equals(0);
			expect(sut.persistenceValue).equals('home,0');
		});

		it('should load user view from the url', async() => {
			setStateForTesting(KEY, 'user,321');

			const sut = new ViewState();

			expect(sut.currentView).equals('user');
			expect(sut.userViewUserId).equals(321);
			expect(sut.persistenceValue).equals('user,321');
		});

		it('should save home view to the url', async() => {
			setStateForTesting(KEY, 'viewId,userId');

			const sut = new ViewState();

			sut.setHomeView();

			expect(sut.currentView).equals('home');
			expect(sut.userViewUserId).equals(0);
			expect(sut.persistenceValue).equals('home,0');

			const searchParams = new URLSearchParams(window.location.search);
			expect(searchParams.get(KEY)).equals('home,0');
		});

		it('should save user view to the url', async() => {
			setStateForTesting(KEY, 'viewId,userId');

			const sut = new ViewState();

			sut.setUserView(321);

			expect(sut.currentView).equals('user');
			expect(sut.userViewUserId).equals(321);
			expect(sut.persistenceValue).equals('user,321');

			const searchParams = new URLSearchParams(window.location.search);
			expect(searchParams.get(KEY)).equals('user,321');
		});
	});
});
