# Random Word Generator

Takes a list of sample words, generates a frequency table for the next letter given the previous n characters, and makes words based on that frequency table.

## Usage

Create a new generator object. Pass either a preset name or a custom settings object into the constructor.

Then, use the `generateWord` function.

Example using preset:

```
const AnduRandom = require("andu-random");
var generator = new AnduRandom("fantasyName");
generator.generateWord();
```

Example using custom settings object:

```
const AnduRandom = require("andu-random");
var generatorOptions = {
	"wordLists": [{
		"fileName": "usmalefirst",
		"weight": 1
	}, {
		"fileName": "usfemalefirst",
		"weight": 2
	}],
	"depth": 2,
	"lengthSoftFloor": 4,
	"lengthSoftCap": 5,
	"maxLength": 15,
	"allowListWords": false
};
var generator = new AnduRandom(generatorOptions);
generator.generateWord();
```

## Presets

* dictionary
* firstName
* maleName
* femaleName
* lastName
* fantasyName

## Options

* `wordLists` Array of word data files to use, with optional weighting. See below for included word data files. 
* `depth` Number of previous characters to look at to determine odds of next character. Lower numbers make it more random, higher numbers generate large chunks of existing words. A depth of 3 seems to be best, maybe 2 if the word list is short.
* `minLength` Minimum word length. Default is 1.
* `maxLength` Maxmimum word length. Default is 1000.
* `lengthSoftFloor` Decreases the chance of getting words shorter than this length. Effect increases as the word length gets closer to `minLength`.
* `lengthSoftCap` Decrease the chance of getting words longer than this length. Effect increases as the word length gets closer to `maxLength`. You need to set a reasonable `maxLength` if you want this to work properly.
* `allowListWords` Whether to allow words on the word data files to be randomly generated.

## Word data files

* `bnc` British National Corpus, downloaded from http://number27.org/assets/misc/words.txt
* `usmalefirst` Male first names from 1990 US census
* `usfemalefirst` Female first names from 1990 US census
* `uslast` Last names from 1990 US census
* `lotr` LOTR character list from https://lotr.fandom.com/wiki/Category:Characters, last names and first names combined
* `dnd` Names from various DnD 5e books as listed in race descriptions