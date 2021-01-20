
export const trySelectAll = async(elm, query) => {
	if (!elm) return null;
	let child =	elm.querySelectorAll(query);
	while (child.length === 0) {
		await new Promise(res => setTimeout(res, 20));
		child =	elm.querySelectorAll(query);
	}
	return child;
};

export const trySelect = async(elm, query) => {
	if (!elm) return null;
	let child =	elm.querySelector(query);
	while (!child) {
		await new Promise(res => setTimeout(res, 20));
		child =	elm.querySelector(query);
	}
	return child;
};
