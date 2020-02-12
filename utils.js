// utils.js

nouns = [];
verbs = [];
adjs = [];

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports.importWords = function(nouns, verbs, adjs) {};

module.exports.generateUsername = function() {
  let name = "";
  for (key in data) {
    index = generateRandomNumber(0, data[key].length);
    name += data[key][index];
  }

  name += generateRandomNumber(0, 1000);
  return name;
};
