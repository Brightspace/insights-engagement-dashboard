// TODO: expand to support redo
export default class StateHistory {

	past = [];
	isUndoing = false;
	undoFunctions = {};

	registerCtrlZ() {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'z' && e.ctrlKey) {
				this.undo();
			}
		});
	}

	register(name, undoCallback) {
		this.undoFunctions[name] = undoCallback;
	}

	save(name, state) {
		// if undoing causes a state change
		// to get saved we need to ignore it
		if (!this.isUndoing) {
			const undo = this.undoFunctions[name];
			this.future = [];
			this.past.push({ state, undo });
		}
	}

	undo() {
		if (this.past.length > 0) {
			this.isUndoing = true;
			const temp = this.past.pop();
			temp.undo(temp.state);
			this.future.push(temp);
			this.isUndoing = false;
		}
	}
}
