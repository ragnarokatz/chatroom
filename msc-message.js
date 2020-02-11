// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var messageSchema = new Schema({
  sender: String,
  text: String,
  time: Date
});

// Make schema available to the application
module.exports = messageSchema;
