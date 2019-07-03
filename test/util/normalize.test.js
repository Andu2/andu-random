var normalize = require("../../src/util/normalize");
var anduTest = require("../anduTest");
var assert = require("assert");

anduTest.runTest("Normalize", function() {
	var testData = {
		"peaches": 5,
		"cheesus": 10,
		"cram": 5
	}
	var expectedValue = {
		"peaches": 0.25,
		"cheesus": 0.5,
		"cram": 0.25
	}
	var testValue = normalize(testData);
	assert.deepEqual(testValue, expectedValue);
});

anduTest.runTest("Normalize when already normalized", function() {
	var testData = {
		"peaches": 0.5,
		"cheesus": 0.5,
	}
	var expectedValue = {
		"peaches": 0.5,
		"cheesus": 0.5,
	}
	var testValue = normalize(testData);
	assert.deepEqual(testValue, expectedValue);
});