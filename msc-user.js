// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var userSchema = new Schema({
  name: String,
  creationTime: Date,
  lastActiveTime: Date,
});

// Make schema available to the application
module.exports = userSchema;
