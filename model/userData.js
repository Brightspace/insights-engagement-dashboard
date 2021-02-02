import { computed, decorate, observable } from 'mobx';

/**
 * User Data from the server
 */
export class UserData {
	constructor({ fetchUserData }) {
		this.fetchUserData  = fetchUserData ;

		// @observables
		this.isLoading = true;
		this.isQueryError = false;
		this.userData = {
			courseGradesData: []
		};
	}

	async loadData(orgUnitIds, userId) {
		this.isLoading = true;
		try {
			this.userData  = await this.fetchUserData(orgUnitIds, userId);
			this.isLoading = false;
			this.isQueryError = false;
		} catch (ignored) {
			this.isQueryError = true;
		}
	}

	get courseGrades() {
		return this.userData.courseGradesData;
	}
}

decorate(UserData, {
	courseGrades: computed,
	isLoading: observable,
	userData: observable,
	isQueryError: observable,
});

