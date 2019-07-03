module.exports = function(frequencyObject, sum = 1) {
	var total = 0;
	for (var key in frequencyObject) {
		total += frequencyObject[key];
	}
	var modifier = sum / total;
	if (isNaN(modifier)) {
		throw new Error("Normalization error: NaN");
	}
	var normalizedObject = {};
	for (var key in frequencyObject) {
		normalizedObject[key] = frequencyObject[key] * modifier;
	}
	return normalizedObject;
}