class Context {

	constructor() {
		this._store = new Map();
	}

	add(key, object) {
		this._store.set(key, object);
	}

	get(key) {
		if (this._store.has(key)) {
			return this._store.get(key);
		}
		return undefined;
	}
}
const context = new Context();
export { context };
