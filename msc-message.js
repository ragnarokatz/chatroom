// Setup
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Entity schema

var messageSchema = new Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, required: true }
});

// Make schema available to the application
module.exports = messageSchema;
