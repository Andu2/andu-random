const anduRandom = require("./index");

global.ANDU_RANDOM_DEBUG = true;
var generator = new anduRandom("fantasyName");
for (var i = 0; i < 100; i++) {
	console.log(generator.generateWord());
}