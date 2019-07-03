const fs = require("fs");
const csv = require("csv");
const path = require("path");

const normalize = require("./util/normalize");
const log = require("./util/log");

const baseWordListPath = path.resolve(__dirname, "../data/wordlists");

// Expects array of wordlist filenames with weights
// [{
// 	"fileName": "usfemalefirst.csv",
// 	"weight": 1
// }]
// depth is number of previous characters to look at
module.exports = function(wordLists, depth = 3, allowListWords = false) {
	log("Calculating frequency table...");
	var wordListLoads = [];
	wordLists.forEach(function(wordList) {
		wordList.weight = wordList.weight || 1;
		var wordListFilePath = path.resolve(baseWordListPath, wordList.fileName);
		var wordListLoad = new Promise(function(resolve, reject) {
			var wordWeights = {};
			var wordsWithDefaultWeights = [];
			var totalWords = 0;
			var totalWeight = 0;
			fs.createReadStream(wordListFilePath)
				.pipe(csv.parse({relax_column_count: true}))
				.on("data", function(data) {
					// log(data);
					totalWords++;
					var word = processWord(data[0]);
					var weight = parseFloat(data[1]);

					if (isNaN(weight)) {
						weight = 0;
						wordsWithDefaultWeights.push(word);
					}
					else {
						totalWeight += weight;
					}
					
					if (wordWeights[word]) {
						log("Duplicate word: " + word + ". Adding weights together");
						wordWeights[word] += weight;
					}
					else {
						wordWeights[word] = weight;
					}
				})
				.on("end", function() {
					if (wordsWithDefaultWeights.length > 0) {
						var defaultWeight = totalWeight / (totalWords - wordsWithDefaultWeights.length);
						if (isNaN(defaultWeight) || defaultWeight === 0) {
							defaultWeight = 1;
						}
						wordsWithDefaultWeights.forEach(function(word) {
							if (wordWeights[word]) {
								log("Duplicate word: " + word + ". Adding weights together");
								wordWeights[word] += defaultWeight;
							}
							else {
								wordWeights[word] = defaultWeight;
							}
						});
					}

					var normalizedWordWeights = normalize(wordWeights, wordList.weight);
					log("Done reading wordList " + wordList.fileName);
					// for (var key in normalizedWordWeights) {
					// 	log(key + ": " + normalizedWordWeights[key]);
					// }
					resolve(normalizedWordWeights);
				});
		});
		wordListLoads.push(wordListLoad)
	});

	return Promise.all(wordListLoads).then(function(wordWeightArray) {
		var allWordWeights = {};
		wordWeightArray.forEach(function(wordWeights) {
			for (var word in wordWeights) {
				if (allWordWeights[word]) {
					log("Word in multiple lists: " + word + ". Adding weights together");
					allWordWeights[word] += wordWeights[word];
				}
				else {
					allWordWeights[word] = wordWeights[word];
				}
			}
		});

		log("Frequency list generated!");

		var frequencyData = {
			table: generateFrequencyFromWeights(allWordWeights, depth),
			depth,
			disallowedWords: []
		}
		if (!allowListWords) {
			frequencyData.disallowedWords = Object.keys(allWordWeights)
		}
		return frequencyData;
	});
}

function generateFrequencyFromWeights(wordWeights, depth = 3) {
	var charCountTable = {};

	var prevChars = [];

	function addCharCount(char, countTable, charWeight) {
		var tableLocation = getTableLocation(countTable, prevChars);
		if (typeof tableLocation[char] === "undefined") {
			tableLocation[char] = 0;
		}
		tableLocation[char] += charWeight;
		prevChars.push(char);
		prevChars = prevChars.slice(-depth);
	}

	for (var word in wordWeights) {
		prevChars = new Array(depth).fill("start");
		for (var i = 0; i < word.length; i++) {
			var char = word[i];
			addCharCount(char, charCountTable, wordWeights[word]);
		}
		addCharCount("end", charCountTable, wordWeights[word]);
	}

	var frequencyTable = normalizeCountTable(charCountTable, depth);
	return frequencyTable;
}

function getTableLocation(countTable, prevChars) {
	var currentTableLocation = countTable;
	prevChars.forEach(function(char) {
		if (typeof currentTableLocation[char] === "undefined") {
			currentTableLocation[char] = {};
		}
		currentTableLocation = currentTableLocation[char];
	});

	return currentTableLocation;
}

function processWord(word) {
	// Could remove special characters here
	return word.toUpperCase();
}

function normalizeCountTable(countTable, depth) {
	if (depth === 0) {
		return normalize(countTable);
	}
	else {
		var normalizedTable = {};
		for (var key in countTable) {
			normalizedTable[key] = normalizeCountTable(countTable[key], depth-1);
		}
		return normalizedTable;
	}
}