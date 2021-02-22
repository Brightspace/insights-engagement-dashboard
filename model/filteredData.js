import { action, computed, decorate, observable } from 'mobx';
import { RECORD } from '../consts';

function unique(array) {
	return [...new Set(array)];
}

/**
 * A wrapper for Data that can add and exclude filters. Allows building up collections of
 * filters with specific dependencies.
 */
export class FilteredData {
	/**
	 * Call with a Data object; to get a FilteredData with filters and exclusions, call "withFilter" and "withoutFilter"
	 * @param {Object}data - a Data object
	 * @param {Object[]}[filters]
	 */
	constructor(data, filters = []) {
		this._data = data;
		this.filters = filters;
	}

	/**
	 * @param {Object}filter - a filter must have fields id, title, and isApplied,
	 * and a filter(record, userDictionary) method; beyond that, it can keep state however it wishes.
	 * Ideally, these should be classes and the id need not
	 * be known outside the defining file (see, e.g., current-final-grade-card).
	 * @returns {FilteredData}
	 */
	withFilter(filter) {
		return new FilteredData(this._data, [...this.filters, filter]);
	}

	/**
	 * @param filterId - a filter to exclude: generally, components for row filters should exclude their own filters
	 * when rendering
	 * @returns {FilteredData}
	 */
	withoutFilter(filterId) {
		return new FilteredData(this._data, this.filters.filter(f => f.id !== filterId));
	}

	get isLoading() {
		return this._data.isLoading;
	}

	get records() {
		const appliedFilters = this.filters.filter(f => f.isApplied);
		return this._data.records.filter(r => appliedFilters.every(f => f.filter(r, this.userDictionary)));
	}

	get recordsByUser() {
		const recordsByUser = new Map();
		this.records.forEach(r => {
			if (!recordsByUser.has(r[RECORD.USER_ID])) {
				recordsByUser.set(r[RECORD.USER_ID], []);
			}
			recordsByUser.get(r[RECORD.USER_ID]).push(r);
		});
		return recordsByUser;
	}

	get userDictionary() {
		return this._data.userDictionary;
	}

	get users() {
		const userIdsInView = unique(this.records.map(record => record[RECORD.USER_ID]));
		return userIdsInView.map(userId => this.userDictionary.get(userId));
	}

	get orgUnitTree() {
		return this._data.orgUnitTree;
	}

	clearFilters() {
		this.filters.forEach(f => f.isApplied = false);
	}

	getFilter(id) {
		return this.filters.find(f => f.id === id);
	}

	get semesterTypeId() {
		return this._data.semesterTypeId;
	}

}
decorate(FilteredData, {
	_data: observable,
	filters: observable,
	records: computed,
	recordsByUser: computed,
	users: computed,
	clearFilters: action
});
