// utils.js

const nouns;
const verbs;
const adjs;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports.importWords = function(n, v, a) {
    nouns = n;
    verbs = v;
    adjs = a;
};

module.exports.generateUsername = function() {
  let name = "";

  for (key in data) {
    index = generateRandomNumber(0, data[key].length);
    name += data[key][index];
  }

  name += generateRandomNumber(0, 1000);
  return name;
};
