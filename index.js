const generateFrequencyData = require("./src/generateFrequencyData");
const generateRandomWord = require("./src/generateRandomWord");
const presets = require("./data/presets.json");

class anduRandom {
	constructor(options) {
		if (typeof options === "string") {
			if (presets[options]) {
				options = presets[options];
				this.usingPreset = true;
			}
			else {
				throw new Error("Andu random generator: Preset '" + options + "' not found.");
			}
		}
		this.frequencyDataOptions = {
			wordLists: options.wordLists,
			depth: options.depth,
			allowListWords: options.allowListWords
		};
		this.wordOptions = {
			minLength: options.minLength,
			maxLength: options.maxLength,
			lengthSoftFloor: options.lengthSoftFloor,
			lengthSoftCap: options.lengthSoftCap,
		};

		this.wordsGenerated = [];
		this.frequencyData = generateFrequencyData(this.frequencyDataOptions.wordLists, this.frequencyDataOptions.depth, this.frequencyDataOptions.allowListWords)
		this.frequencyLoaded = true;
	}

	generateWord() {
		if (!this.frequencyLoaded) {
			throw new Error("Andu random generator: Cannot generate random word, no frequency data has been successfully loaded.");
		}

		var word = generateRandomWord(this.frequencyData, this.wordOptions);
		this.frequencyData.disallowedWords.push(word);
		this.wordsGenerated.push(word);
		return word;
	}
}

module.exports = anduRandom;