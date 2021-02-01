import { USER } from '../consts.js';

// Works with strings, dates, and numbers
export const defaultSort = (chosenOrder, column) =>
	(user1, user2) => {
		// undefined is neither greater or less then a value so we set it to -infinity
		const record1 = user1[column] ? user1[column] : Number.NEGATIVE_INFINITY;
		const record2 = user2[column] ? user2[column] : Number.NEGATIVE_INFINITY;
		return (record1 > record2 ? chosenOrder[1] :
			record1 < record2 ? chosenOrder[0] :
				chosenOrder[2]);
	};

// sorts by last then first name
export const userNameSort = (chosenOrder, column) =>
	(user1, user2) => {
		const lastFirstName1 = `${user1[column][USER.LAST_NAME]}, ${user1[column][USER.FIRST_NAME]}`.toLowerCase();
		const lastFirstName2 = `${user2[column][USER.LAST_NAME]}, ${user2[column][USER.FIRST_NAME]}`.toLowerCase();
		return (lastFirstName1 > lastFirstName2 ? chosenOrder[1] :
			lastFirstName1 < lastFirstName2 ? chosenOrder[0] :
				chosenOrder[2]);
	};

// case insensitive string sort
export const courseNameSort = (chosenOrder, column) =>
	(course1, course2) => {
		const courseId1 = course1[column].toLowerCase();
		const courseId2 = course2[column].toLowerCase();
		return (courseId1 > courseId2 ? chosenOrder[1] :
			courseId1 < courseId2 ? chosenOrder[0] :
				chosenOrder[2]);
	};

const reverseSorts = [userNameSort, courseNameSort]; // add sorts here to revers them
export const SortMixin = superclass => class extends superclass {
	static get properties() {
		return {
			_sortColumn: { type: Number, attribute: false },
			_sortOrder: { type: String, attribute: false }
		};
	}

	constructor() {
		super();
		this._sortColumn = 0;
		this._sortOrder = 'desc';
		this.sorts = [];
	}

	_chosenSortFunction(column, chosenOrder) {
		let ORDER = {
			'asc': [-1, 1, 0],
			'desc': [1, -1, 0]
		};

		if (!this.sorts[column]) return defaultSort(ORDER[chosenOrder, column]);

		if (reverseSorts.includes(this.sorts[column])) {
			ORDER = {
				'asc': [1, -1, 0],
				'desc': [-1, 1, 0]
			};
		}
		return this.sorts[column](ORDER[chosenOrder], column);
	}
};
