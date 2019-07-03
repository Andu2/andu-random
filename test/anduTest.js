const assert = require("assert");
const chalk = require("chalk");
const glob = require("glob");

const END_STACK_AT_LINE = "    at Object.runTest ";

var anduTest = {
	pass: 0,
	fail: 0,
	showPass: true,
	testFiles: function(globString) {
		glob(globString, function(error, files) {
			files.forEach(function(fileName) {
				console.log(chalk.bold(fileName));
				require(fileName.replace("test/", "./")); // Todo: make this not look stupid
			});

			console.log("Tests complete. " + anduTest.pass + " pass, " + anduTest.fail + " fail");
		});
	},
	runTest: function(testName, testFunction) {
		try {
			testFunction();
			anduTest.pass++;
			if (anduTest.showPass) {
				console.log(chalk.green("  " + testName + ": Passed"));
			}
		} catch (error) {
			anduTest.fail++;
			if (error instanceof assert.AssertionError) {
				console.log(chalk.red("  " + testName + ": Failed. Expected " + error.expected + ", got " + error.actual));
			}
			else {
				var shortStack = shortenStack(error.stack);
				console.log(chalk.red("  " + testName + ": Failed with error.", shortStack));
			}
		}
	}
};

function shortenStack(stack) {
	var stackSplit = stack.split("\n");
	var endStackLine = stackSplit.length;
	for (var i = 0; i < stackSplit.length; i++) {
		if (stackSplit[i].indexOf(END_STACK_AT_LINE) === 0) {
			endStackLine = i;
			break;
		}
	}
	var shortStack = stackSplit.slice(0, endStackLine).join("\n");
	return shortStack;
}

module.exports = anduTest;