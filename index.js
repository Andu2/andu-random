const frequency = require("./data/processed/frequency.json");
const words = require("./data/processed/words.json");
const suffixes = require("./data/processed/suffixes.json");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const vowels = "AEIOUY";
const maxConditionalLetters = 3; // based on max string length in frequency.json minus one
const maxTries = 10;

function generateRandomWord(maxLength = 20, tries = 0) {
	var currentWord = "";
	
	while (currentWord.length < maxLength) {
		var nextLetter = getNextLetter(currentWord);
		if (nextLetter === "") {
			if (isValidWord(currentWord)) {
				return currentWord;
			}
			else {
				tries++;
				if (tries === maxTries) {
					//console.log("Generated \"" + currentWord + "\", but it sucks. Giving up and using it.");
					return currentWord;
				}
				else {
					//console.log("Generated \"" + currentWord + "\", but it sucks. Trying again.");
					return generateRandomWord(maxLength, tries);
				}
			}	
		}
		else {
			currentWord += nextLetter;
		}
	}
}

function getNextLetter(currentWord) {
	var totalSamples = 0;
	var sampleToUse = "count";
	var conditionalLetters = currentWord.slice(-maxConditionalLetters);

	// check end word
	if (conditionalLetters.length >= 2) {
		var randomNum1 = Math.random();
		if (randomNum1 < frequency[conditionalLetters].endCount / frequency[conditionalLetters].count) {
			return "";
		}
	}
	// special logic for start of word
	else if (conditionalLetters.length <= maxConditionalLetters) {
		sampleToUse = "startCount";
	}

	for (var letterIndex = 0; letterIndex < alphabet.length; letterIndex++) {
		if (frequency[conditionalLetters + alphabet[letterIndex]]) {
			totalSamples += frequency[conditionalLetters + alphabet[letterIndex]][sampleToUse];
		}
		else {
			// console.log("Note: " + conditionalLetters + alphabet[letterIndex] + " does not exist in data");
		}	
	}

	var randomNum2 = Math.random();

	for (var letterIndex = 0; letterIndex < alphabet.length; letterIndex++) {
		if (frequency[conditionalLetters + alphabet[letterIndex]]) {
			var sampleFraction = frequency[conditionalLetters + alphabet[letterIndex]][sampleToUse] / totalSamples;
			if (randomNum2 < sampleFraction) {
				return alphabet[letterIndex];
			}
			else {
				randomNum2 -= sampleFraction;
			}
		}
		else {

		}
	}

	return alphabet[alphabet.length - 1];
}

function isValidWord(word) {
	// Test 1: vowel test
	var hasVowels = false;
	for (var wordIndex = 0; wordIndex < word.length; wordIndex++) {
		for (var vowelIndex = 0; vowelIndex < vowels.length; vowelIndex++) {
			if (word[wordIndex] === vowels[vowelIndex]) {
				hasVowels = true;
				break;
			}
		}
	}
	if (!hasVowels) {
		//console.log(word + " doesn't have vowels.");
		return false;
	}

	// Test 2: word isn't just a suffix and nothing else
	for (var i = 0; i < suffixes.length; i++) {
		if (word === suffixes[i]) {
			//console.log(word + " is just a suffix");
			return false;
		}
	}

	// Test 3: real word test
	for (var i = 0; i < words.length; i++) {
		if (word === words[i]) {
			//console.log(word + " is a real word!");
			return false;
		}
	}

	return true;
}

if (require.main === module) {
	for (var i = 0; i < 1000; i++) {
		console.log(generateRandomWord());
	}
}

module.exports = generateRandomWord;