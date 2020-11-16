export default class StateHistory {

	past = [];
	isUndoing = false;

	save(state, undo) {
		if (!this.isUndoing) {
			console.log(state, undo);
			this.past.push({ state, undo });
		}

	}

	undo() {
		if (this.past.length > 0) {
			this.isUndoing = true;
			const temp = this.past.pop();
			console.log(temp);
			temp.undo(temp.state);
			this.isUndoing = false;
		}
	}
}
