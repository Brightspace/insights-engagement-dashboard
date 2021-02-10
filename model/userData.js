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
			courseGradesData: []
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
		return this.userData.courseGradesData;
	}
}

decorate(UserData, {
	courseGrades: computed,
	isLoading: observable,
	userData: observable,
	isQueryError: observable,
});

