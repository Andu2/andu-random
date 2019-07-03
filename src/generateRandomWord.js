const generateFrequencyData = require("./generateFrequencyData");
const normalize = require("./util/normalize");
const log = require("./util/log");

const MAX_REDOS = 20;

module.exports = function(frequencyData, options) {
	options.maxLength = options.maxLength || 1000; // Just in case there is no "end" frequency
	options.minLength = options.minLength || 1;
	var redos = 0;
	var word = "";
	do {
		var word = getWord(frequencyData, options);
		var redoWord = false;
		if (frequencyData.disallowedWords.indexOf(word) > -1) {
			if (redos >= MAX_REDOS) {
				log("Max redos hit. Using word '" + word + "' even though it is already in list");
			}
			else {
				redos++;
				redoWord = true;
			}
		}
	}
	while (redoWord);

	return word;
}

function getWord(frequencyData, options) {
	var currentWord = "";
	var prevChars = new Array(frequencyData.depth).fill("start");
	var softCapEffect = 1;
	var softFloorEffect = 1;

	do {
		if (options.lengthSoftCap) {
			softCapEffect = Math.max(Math.pow(100, (currentWord.length - options.lengthSoftCap) / (options.maxLength - options.lengthSoftCap)), 1);
		}
		if (options.lengthSoftFloor) {
			softFloorEffect = Math.min(1 / Math.pow(100, (options.lengthSoftFloor - currentWord.length) / (options.lengthSoftCap - options.minLength)), 1);
		}
		var chanceToEndMult = softCapEffect * softFloorEffect;
		var nextLetter = chooseNextLetter(prevChars, frequencyData.table, chanceToEndMult);
		if (nextLetter === "end") {
			break;
		}
		else {
			currentWord += nextLetter;
			prevChars.push(nextLetter);
			prevChars = prevChars.slice(-frequencyData.depth);
		}
	} while (currentWord.length < options.maxLength);

	return currentWord;
}

function chooseNextLetter(prevChars, frequencyTable, chanceToEndMult = 1) {
	try {
		var charChoices = getTableLocation(frequencyTable, prevChars);
		if (charChoices.end) {
			charChoices.end *= chanceToEndMult;
			charChoices = normalize(charChoices);
		}
		var random = Math.random();
		var cumulative = 0;
		for (var char in charChoices) {
			cumulative += charChoices[char];
			if (random < cumulative) {
				return char;
			}
		}
	}
	catch (error) {
		log("Error choosing next letter...", error)
	}
	throw new Error("Could not choose letter");
	return "[ERROR]";
}

function getTableLocation(table, prevChars) {
	var currentTableLocation = table;
	prevChars.forEach(function(char) {
		if (typeof currentTableLocation[char] === "undefined") {
			throw new Error("Frequency not found for prev chars " + prevChars.join(", "));
		}
		currentTableLocation = currentTableLocation[char];
	});

	return currentTableLocation;
}