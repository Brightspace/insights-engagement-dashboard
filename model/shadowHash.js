// The browser traverses the dom tree and adds all components with an ID to a hash table.
// However, it excludes elements in shadowRoots since they are technically separate DOM trees.
// To make up for this limitation the shadowHash allows you to register and query for components outside
// of the browsers tooling. Allowing for linking, scrolling etc.

const CLASS = Symbol('class');
const ID = Symbol('id');
const ELEMENT = Symbol('element');

class ShadowHash {
	constructor() {
		this._store = new Map();
	}

	register(elm) {
		if (elm.id === '' || elm.id === undefined || elm.id === null) {
			throw new Error('Elements registered to the shadow hash must have an id');
		}
		this._store.set(elm.id, elm);
	}

	queryType(query) {
		return query[0] === '.' ? { type: CLASS, query: query.substring(1) }
			: query[0] === '#' ? { type: ID, query: query.substring(1) }
			: { type: ELEMENT, query };
	}

	// supported queries are
	// #id
	// .class
	querySelector(query) {
		const { type, query: parsedQuery } = this.queryType(query);
		if (type === CLASS) {
			return Array.from(this._store.values()).find(elm => elm.classList.contains(parsedQuery));
		} else if (type === ID) {
			return this._store.get(parsedQuery);
		} else {
			return Array.from(this._store.values()).find(elm => elm.nodeName.toLowerCase() === parsedQuery);
		}
	}
}

const shadowHash = new ShadowHash();

export default shadowHash;
