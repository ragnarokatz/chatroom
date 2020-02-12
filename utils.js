// utils.js

let nouns = null;
let verbs = null;
let adjs = null; // unused for now

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

module.exports.importWords = function(n, v, a) {
  nouns = n.map(doc => {
    return capitalizeFirstLetter(doc.word);
  });

  verbs = v.map(doc => {
    return capitalizeFirstLetter(doc.word);
  });

  adjs = a.map(doc => {
    return capitalizeFirstLetter(doc.word);
  });
};

module.exports.generateUsername = function() {
  let name = "";

  var index = generateRandomNumber(0, verbs.length);
  name += verbs[index];

  index = generateRandomNumber(0, nouns.length);
  name += nouns[index];

  name += generateRandomNumber(0, 1000);
  return name;
};
