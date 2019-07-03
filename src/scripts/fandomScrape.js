// Use on https://lotr.fandom.com/wiki/Category:Characters
[...document.querySelectorAll(".category-page__member")].reduce(function(aggr, next) {return aggr + next.innerText + ", "}, "")