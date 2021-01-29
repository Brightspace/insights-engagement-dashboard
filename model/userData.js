import { computed, decorate, observable } from 'mobx';

/**
 * User Data from the server
 */
export class UserData {
	constructor({ userServerData }) {
		this.userServerData = userServerData;

		// @observables
		this.isLoading = true;
		this.userData = {
			courseGradesData: []
		};
	}

	async loadData(orgUnitIds, userId) {
		this.isLoading = true;
		try {
			this.userData  = await this.userServerData(orgUnitIds, userId);
			this.isLoading = false;
		} catch (ignored) {
			console.log('error');
		}
	}

	get courseGrades() {
		return this.userData.courseGradesData;
	}
}

decorate(UserData, {
	courseGrades: computed,
	isLoading: observable,
	userData: observable
});

