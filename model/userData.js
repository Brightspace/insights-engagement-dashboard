import { computed, decorate, observable } from 'mobx';

/**
 * User Data from the server
 */
export class UserData {
	constructor({ fetchUserData, metronEndpoint }) {
		this.fetchUserData  = fetchUserData ;
		this.metronEndpoint = metronEndpoint;

		// @observables
		// An auditor may use the Learner Engagement Dashboard to view a user with no courses, in which case
		// loadData() is never called. By only showing the spinners once a load is requested, we ensure
		// the spinners aren't left indefinitely in this case.
		this.isLoading = false;
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

