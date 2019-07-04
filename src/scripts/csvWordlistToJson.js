const fs = require("fs");
const csv = require("csv");
const path = require("path");
const glob = require("glob");

const baseWordListPath = path.resolve(__dirname, "../../data/wordlists");

var wordListLoads = [];
var moduleNames = [];

glob(baseWordListPath + "/*.csv", function(error, files) {
	files.forEach(function(fileName) {
		console.log("Parsing " + fileName);
		var moduleName = fileName.split("/").slice(-1)[0].slice(0, -4);
		if (moduleName.slice(0, 8) !== "testlist") {
			moduleNames.push(moduleName);
		}
		var wordListLoad = new Promise(function(resolve, reject) {
			var wordListArray = [];
			fs.createReadStream(fileName)
				.pipe(csv.parse({relax_column_count: true}))
				.on("data", function(data) {
					if (data[0]) {
						var wordData = {
							"word": data[0]
						};
						if (data[1]) {
							wordData.weight = data[1];
						}

						wordListArray.push(wordData);
					}
				})
				.on("end", function() {
					console.log("Done reading wordList " + fileName + " (" + wordListArray.length + " words)");
					var jsonFile = fileName.slice(0, -4) + ".json";
					fs.writeFileSync(jsonFile, JSON.stringify(wordListArray, null, "\t"))
					console.log("Done writing wordList " + jsonFile);
					resolve(true);
				});
		});
		wordListLoads.push(wordListLoad)
	});

	Promise.all(wordListLoads).then(function() {
		console.log("Done turning csv word lists into json");

		var indexOutput = "";
		moduleNames.forEach(function(moduleName) {
			indexOutput += "var " + moduleName + " = require(\"./" + moduleName + ".json\");\n";
		});

		indexOutput += "\nmodule.exports = {\n";
		moduleNames.forEach(function(moduleName) {
			indexOutput += "\t" + moduleName + ",\n";
		});
		indexOutput = indexOutput.slice(0, -2);
		indexOutput += "\n}";

		var indexFilePath = path.resolve(baseWordListPath, "index.js");
		fs.writeFileSync(indexFilePath, indexOutput);
		console.log("Done writing index.js");
	});
});



