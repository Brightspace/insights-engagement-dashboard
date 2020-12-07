import { autorun } from 'mobx';

let isDisabledForTesting = false;
export function disableUrlStateForTesting() {
	isDisabledForTesting = true;
}
export function enableUrlState() {
	isDisabledForTesting = false;
}

export function isDefault() {
	// this function does not attempt to handle
	// pages that include query parameters for the server in their default state
	const searchParams = new URLSearchParams(window.location.search);
	const keys = Array.from(searchParams.keys());

	// there are no query params or one `v` parame pointed to the home view
	return keys.length < 1
		|| (keys.length < 2 && keys[0] === 'v' && searchParams.get('v').startsWith('home'));
}

export function setStateForTesting(key, value) {
	const searchParams = new URLSearchParams(window.location.search);
	searchParams.set(key, value);
	const url = new URL(window.location.href);
	url.search = searchParams.toString();
	window.history.pushState({}, '', url.toString());
}

export function clearUrlState() {
	window.history.replaceState({}, '', '');
}

// plan: store various filter settings in the url query (handled by each component); then add a button
// "make this my default view" that stores the current query in local storage
/**
 * The wrapped object must implement:
 * {String} get persistenceKey() - a constant string used as the url query parameter for this component
 * {String} get persistenceValue() - should return current state as a string
 * set persistenceValue({String}) - called when the component should set the given state
 * If persistenceValue references one or more mobx observables, mobx will track changes. Otherwise,
 * it is necessary to call save() when the state changes.
 * The wrapped object may optionally implement:
 * {Boolean} get persistEmpty() - if true, the key will not be removed from the url even if the value is ''
 */
export class UrlState {

	static currentId = 0;

	constructor(wrapped) {
		this._wrapped = wrapped;
		if (isDisabledForTesting) return;

		// load state from the url on setup, and again when the user hits forward or back;
		// have mobx save state whenever it changes
		this._load();
		this._onpopstate = this._onpopstate.bind(this);
		window.addEventListener('popstate', this._onpopstate);
		autorun(() => this.save());
	}

	save() {
		const url = new URL(window.location.href);
		const valueToSave = this.value;
		if (!this.persistEmpty && valueToSave === '' && url.searchParams.has(this.key)) {
			url.searchParams.delete(this.key);
			UrlState.pushState(url);
		}
		else if (valueToSave !== this._savedValue(url)) {
			url.searchParams.set(this.key, valueToSave);
			UrlState.pushState(url);
		}
	}

	get key() {
		return this._wrapped.persistenceKey;
	}

	get persistEmpty() {
		return this._wrapped.persistEmpty;
	}

	get value() {
		return this._wrapped.persistenceValue;
	}

	set value(value) {
		this._wrapped.persistenceValue = value;
	}

	_onpopstate(e) {
		UrlState.currentId = (e.state !== null && e.state.id) ? e.state.id : 0;
		if (e.state !== null) this._load();
	}

	_load() {
		const url = new URL(window.location.href);
		this.value = this._savedValue(url);
	}

	_savedValue(url) {
		return url.searchParams.get(this.key) || '';
	}

	// static history managment methods

	static backOrResetView() {
		if (this.currentId === 0) {
			resetUrlState();
		} else {
			window.history.back();
		}
	}

	static pushState(url) {
		this.currentId += 1;
		window.history.pushState({ id: this.currentId }, '', url.toString());
	}
}

export function resetUrlState() {
	const url = new URL(window.location.href);
	url.search = new URLSearchParams();
	UrlState.pushState(url);
	window.location.reload();
}
