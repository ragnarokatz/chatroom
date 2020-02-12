// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var nounSchema = new Schema({
  word: String
});

// Make schema available to the application
module.exports = messageSchema;
