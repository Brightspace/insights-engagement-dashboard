import { action, computed, decorate, observable } from 'mobx';

export class CategoryFilter {
	constructor(filterId, title, filter) {
		this.id = filterId;
		this.title = title;
		this.filter = filter;
		this.selectedCategories = new Set();
	}

	get isApplied() {
		return this.selectedCategories.size > 0;
	}

	set isApplied(isApplied) {
		if (!isApplied) this.selectedCategories.clear();
	}

	clearCategory(category) {
		this.selectedCategories.delete(category);
	}

	selectCategory(category) {
		this.selectedCategories.add(category);
	}

	toggleCategory(category) {

		if (this._history) {
			this._history.save({}, () => this.toggleCategory(category));
		}

		if (this.selectedCategories.has(category)) {
			this.clearCategory(category);
		} else {
			this.selectCategory(category);
		}
	}

	set history(history) {
		this._history = history;
	}
}
decorate(CategoryFilter, {
	isApplied: computed,
	clearCategory: action,
	selectCategory: action,
	toggleCategory: action,
	selectedCategories: observable
});
