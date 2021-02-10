import { computed, decorate, observable } from 'mobx';

/**
 * User Data from the server
 */
export class UserData {
	constructor({ fetchUserData, metronEndpoint }) {
		this.fetchUserData  = fetchUserData ;
		this.metronEndpoint = metronEndpoint;

		// @observables
		this.isLoading = true;
		this.isQueryError = false;
		this.userData = {
			userGrades: [],
			userContent: [],
			userCourseAccess: []
		};
	}

	async loadData(orgUnitIds, userId) {
		this.isLoading = true;
		try {
			this.userData  = await this.fetchUserData(orgUnitIds, userId, this.metronEndpoint);
			this.isLoading = false;
			this.isQueryError = false;
		} catch (ignored) {
			this.isQueryError = true;
			this.isLoading = false;
		}
	}

	get courseGrades() {
		return this.userData.userGrades;
	}

	get contentViews() {
		return this.userData.userContent;
	}

	get courseAccess() {
		return this.userData.userCourseAccess;
	}
}

decorate(UserData, {
	courseGrades: computed,
	contentViews: computed,
	courseAccess: computed,
	isLoading: observable,
	userData: observable,
	isQueryError: observable,
});

