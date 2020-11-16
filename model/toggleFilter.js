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
		if (this.history) {
			this.history.save(this.isApplied, (oldState) => this.isApplied = oldState);
		}
		this.isApplied = newState;
	}
}

decorate(ToggleFilter, {
	isApplied: observable
});
