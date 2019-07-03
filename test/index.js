// I created my own little testing report because Jest was HUGE (over 100 MB!!!) and I didn't like tape
// Maybe turn into andu-test module?

var anduTest = require("./anduTest");
anduTest.testFiles("**/*.test.js");