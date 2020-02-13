// Setup
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Entity schema

var userSchema = new Schema({
  fingerprintId: String,
  username: String,
  lastActiveTime: Date
});

// Make schema available to the application
module.exports = userSchema;
