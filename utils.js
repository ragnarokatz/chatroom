// utils.js

data = {};

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports.importReferenceData = function(data) {
  this.data = data;
};

module.exports.generateName = function() {
  let name = "";
  for (key in data) {
    index = generateRandomNumber(0, data[key].length);
    name += data[key][index];
  }

  name += generateRandomNumber(0, 1000);
  return name;
};
