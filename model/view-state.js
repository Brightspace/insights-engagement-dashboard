import { action, decorate, observable } from 'mobx';
import { UrlState } from './urlState';

export const DefaultViewState = {
	currentView: 'home'
};

export class ViewState {
	constructor() {
		this._urlState = new UrlState(this);
	}

	setUserView(userId) {
		this.currentView = 'user';
		this.userViewUserId = userId;
		// odd, but after second navigation to user view
		// autorun reaction stops observing properties form ViewState
		// therefore this line is needed
		if (this._urlState) this._urlState.save();
	}

	setHomeView() {
		this.currentView = 'home';
		this.userViewUserId = 0;
		// odd, but after second navigation to user view
		// autorun reaction stops observing properties form ViewState
		// therefore this line is needed
		if (this._urlState) this._urlState.save();
	}

	setSettingsView() {
		this.currentView = 'settings';
		// odd, but after second navigation to user view
		// autorun reaction stops observing properties form ViewState
		// therefore this line is needed
		if (this._urlState) this._urlState.save();
	}

	//for Urlstate
	get persistenceKey() {
		return 'v';
	}

	get persistenceValue() {
		return [this.currentView || 'home', this.userViewUserId || 0].join(',');
	}

	set persistenceValue(value) {
		if (value === '') {
			return;
		}

		const [view, userId] = value.split(',');

		switch (view) {
			case 'home': this.setHomeView();
				break;
			case 'user': this.setUserView(Number(userId));
				break;
			case 'settings': this.setSettingsView();
				break;
			default:
				this.setHomeView();
				break;
		}
	}
}

decorate(ViewState, {
	userViewUserId: observable,
	currentView: observable,
	setUserView: action,
	setHomeView: action,
	setSettingsView: action
});
