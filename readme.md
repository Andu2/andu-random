# Random Word Generator

Takes a list of sample words, generates a frequency table for the next letter given the previous n characters, and makes words based on that frequency table.

## Usage

```
const AnduRandom = require("andu-random");
var generator = new AnduRandom("fantasyName");
generator.loadFrequencyData().then(function() {
	generator.generateWord();
});
```

## Presets

* dictionary
* firstName
* maleName
* femaleName
* lastName
* fantasyName

## Word data

* Male first names from 1990 US census
* Female first names from 1990 US census
* Last names from 1990 US census
* British National Corpus, from http://number27.org/assets/misc/words.txt
* LOTR character list from https://lotr.fandom.com/wiki/Category:Characters, last names and first names combined
* DnD names from XGtE and other books with races