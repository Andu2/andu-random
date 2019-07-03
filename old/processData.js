const fs = require("fs");
const csv = require("csv");

var ngramReads = [];
const ngramMax = 4;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const maxPositional = 9;
const inputFilePrefix = "data/raw/ngrams";
const outputFile = "data/processed/frequency.json";

for (var i = 1; i <= ngramMax; i++) {
	ngramReads.push(new Promise(function(resolve, reject) {
		var n = i;
		var ngramData = [];
		fs.createReadStream(inputFilePrefix + n + ".csv")
			.pipe(csv.parse({columns: true}))
			.on("data", function(data) {
				ngramData.push(data);
			})
			.on("end", function(data) {
				console.log("Done reading ngram" + n);
				resolve(ngramData);
			});
	}));	
}

Promise.all(ngramReads)
	.then(function(data) {
		var frequency = {};
		for (var i = 0; i < data.length; i++) {
			var n = i + 1;
			var gramColumn = n + "-gram";
			console.log("Parsing " + gramColumn + "s");

			for (var row = 0; row < data[i].length; row++) {
				var gram = data[i][row][gramColumn];
				var count = parseInt(data[i][row]["*/*"]);
				var endCount = parseInt(data[i][row]["*/" + (-n) + ":-1"]);

				// positional
				var positionalArray = [];
				for (var position = 1; position <= maxPositional - n + 1; position++) {
					positionalArray.push(parseInt(data[i][row]["*/" + position + ":" + (position + n - 1)]));
				}

				var startCount = positionalArray[0];

				frequency[gram] = {
					count: count,
					positionalCount: positionalArray,
					startCount: startCount,
					endCount: endCount
				};
			}

			console.log("Done parsing " + gramColumn + "s");
		}

		fs.writeFile(outputFile, JSON.stringify(frequency), function(error) {
			if (error) {
				console.log(error);
			}
			else {
				console.log("Frequency data written to " + outputFile);
			}
		});
	});

// function getFrequencyDrilldown(levels, currentLevel = 0) {
// 	var frequencyDrilldown = getEmptyDrilldownLevel(currentLevel);
	
// 	if (levels >= 1) {
// 		for (var i = 0; i < alphabet.length; i++) {
// 			frequencyDrilldown[alphabet[i]] = getFrequencyDrilldown(levels - 1, currentLevel + 1);
// 		}
// 	}

// 	return frequencyDrilldown;
// }

// function getEmptyDrilldownLevel(currentLevel) {
// 	var positionalArray = [];
// 	for (var i = 0; i < maxPositional - currentLevel; i++) {
// 		positionalArray.push(0);
// 	}
// 	return {
// 		"count": 0,
// 		"positionalCount": positionalArray
// 	};
// }

// First idea: Output something like:
// {
// 	"a": {
// 		"count": 500,
// 		"positionalCount": [100, 50, 50, 50, 50, 50, 50, 50, 50],
// 		"a": {
// 			"count": 200,
// 			...
// 		},
// 		"b": {
// 			"count": 300,
// 			...
// 		}
// 	},
// 	"b": {
// 		"count": 400,
// 		"positionalCount": [0, 100, 50, 50, 0, 50, 50, 50, 50],
// 		"a": {
// 			"count": 300,
// 			...
// 		},
// 		"b": {
// 			"count": 100,
// 			...
// 		}
// 	}
// }

// Second idea: Output something like
// {
// 	"a": {
// 		"count": 500,
// 		"positionalCount": [100, 50, 50, 50, 50, 50, 50, 50, 50]
// 	},
// 	"b": {
// 		"count": 400,
// 		"positionalCount": [0, 100, 50, 50, 0, 50, 50, 50, 50]
// 	},
// 	"aa": {
// 		"count": 200,
// 		...
// 	},
// 	"ab": {
// 		"count": 300,
// 		...
// 	},
// 	"ba": {
// 		"count": 300,
// 		...
// 	},
// 	"bb": {
// 		"count": 100,
// 		...
// 	}
// }
