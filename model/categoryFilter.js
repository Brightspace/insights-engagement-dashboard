import { action, computed, decorate, observable } from 'mobx';

export class CategoryFilter {
	constructor(filterId, title, filter, key) {
		this.id = filterId;
		this.title = title;
		this.filter = filter;
		this.selectedCategories = new Set();
		this.persistenceKey = key;
		this._all = undefined;
	}

	get isApplied() {
		return this.selectedCategories.size > 0;
	}

	set isApplied(isApplied) {
		if (!isApplied) this.selectedCategories.clear();
	}

	//@action
	setAll(allValues) {
		this._all = allValues;
		if (this._all && this.isAllCategoriesSelected()) {
			this.selectedCategories.clear();
		}
	}

	isAllCategoriesSelected() {
		const intersection = [...this._all].filter(v => this.selectedCategories.has(v));

		if (intersection.length === this._all.size) return true;
		return false;
	}

	clearCategory(category) {
		this.selectedCategories.delete(category);
	}

	selectCategory(category) {
		this.selectedCategories.add(category);
		if (this._all && this.isAllCategoriesSelected()) {
			this.selectedCategories.clear();
		}
	}

	setCategories(categories) {
		this.selectedCategories.clear();
		categories.forEach(category => this.selectedCategories.add(category));
	}

	toggleCategory(category) {
		if (this.selectedCategories.has(category)) {
			this.clearCategory(category);
		} else {
			this.selectCategory(category);
		}
	}
}
decorate(CategoryFilter, {
	isApplied: computed,
	clearCategory: action,
	selectCategory: action,
	setCategories: action,
	toggleCategory: action,
	setAll: action,
	selectedCategories: observable
});
