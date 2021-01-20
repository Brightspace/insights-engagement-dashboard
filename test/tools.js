
export const trySelectAll = async(elm, query, attempts = 50) => {
	if (!elm) return null;
	let child =	elm.querySelectorAll(query);
	let i = 0;
	while (child.length === 0 && i < attempts) {
		await new Promise(res => setTimeout(res, 20));
		child =	elm.querySelectorAll(query);
		i++;
	}
	return child;
};

export const trySelect = async(elm, query, attempts = 50) => {
	if (!elm) return null;
	let child =	elm.querySelector(query);
	let i = 0;
	while (!child && i < attempts) {
		await new Promise(res => setTimeout(res, 20));
		child =	elm.querySelector(query);
		i++;
	}
	return child;
};
