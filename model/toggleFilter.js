import { decorate, observable } from 'mobx';

export class ToggleFilter {

	isApplied;
	filterId;
	title;

	constructor(applied, filterId, title, filter) {
		this.isApplied = applied;
		this.filterId = filterId;
		this.title = title;
		this.filter = filter;
	}

	get id() { return this.filterId; }

	get title() {
		return this.title;
	}

	setIsApplied(newState) {
		if (this._history) {
			this._history.save(this.title, this.isApplied);
		}
		this.isApplied = newState;
	}

	set history(history) {
		this._history = history;
		history.register(this.title, (oldState) => this.isApplied = oldState);
	}
}

decorate(ToggleFilter, {
	isApplied: observable
});
