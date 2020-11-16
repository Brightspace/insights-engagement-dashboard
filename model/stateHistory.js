// TODO: expand to support redo
export default class StateHistory {

	past = [];
	isUndoing = false;

	save(state, undo) {
		// if undoing causes a state change
		// to get saved we need to ignore it
		if (!this.isUndoing) {
			this.past.push({ state, undo });
		}
	}

	undo() {
		if (this.past.length > 0) {
			this.isUndoing = true;
			const temp = this.past.pop();
			temp.undo(temp.state);
			this.isUndoing = false;
		}
	}
}
