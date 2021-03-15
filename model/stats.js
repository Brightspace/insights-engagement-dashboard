export function median(array) {
	if (array.length === 0) return undefined;
	return array[Math.floor((array.length - 1) / 2)];
}

export function Q1(array) {
	return median(
		[...array].splice(
			0,
			Math.round(array.length / 2) - 1
		)
	);
}

export function Q3(array) {
	return median(
		[...array].splice(
			Math.round(array.length / 2),
			array.length
		)
	);
}

export function IQRWhisker(array) {
	const IQR = Q3(array) - Q1(array);
	return IQR * 1.5;
}

function getUpperBound(array) {
	const whisker = IQRWhisker(array);
	return Q3(array) + whisker;
}

export function removeOutliers(array) {
	if (array.length < 5) return array;
	const upperBound = getUpperBound(array);
	return array.filter(value => value < upperBound);
}

export function getOutliers(array) {
	if (array.length < 5) return [];
	const upperBound = getUpperBound(array);
	return array.filter(value => value >= upperBound);
}
