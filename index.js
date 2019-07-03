const generateFrequencyData = require("./src/generateFrequencyData");
const generateRandomWord = require("./src/generateRandomWord");
const presets = require("./data/presets");

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
	}

	loadFrequencyData() {
		var anduRandomInstance = this;
		return generateFrequencyData(this.frequencyDataOptions.wordLists, this.frequencyDataOptions.depth, this.frequencyDataOptions.allowListWords).then(function(frequencyData) {
			anduRandomInstance.frequencyData = frequencyData;
			anduRandomInstance.frequencyLoaded = true;
		});
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

if (require.main === module) {
	global.ANDU_RANDOM_DEBUG = true;
	var generator = new anduRandom("fantasyName");
	generator.loadFrequencyData().then(function() {
		for (var i = 0; i < 100; i++) {
			console.log(generator.generateWord());
		}
	});
}