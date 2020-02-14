// Setup
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Entity schema

var nounSchema = new Schema({
  word: { type: String, required: true }
});

var verbSchema = new Schema({
  word: { type: String, required: true }
});

var adjSchema = new Schema({
  word: { type: String, required: true }
});

// Make schema available to the application
module.exports = { nounSchema, verbSchema, adjSchema };
