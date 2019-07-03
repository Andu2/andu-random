// Use on https://tetra-cube.github.io/dnd/dnd-char-gen.html
// (this website already has the data from the books, so I don't have to do it manually!)
var nameList = [];

function addToNameList(names) {
	for (var race in names) {
		if (Array.isArray(names[race])) {
			nameList = nameList.concat(names[race]);
		}
		else {
			addToNameList(names[race]);
		}
	}
}

addToNameList(names);
console.log(nameList.join("\n"));
