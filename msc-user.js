// Setup
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Entity schema

var userSchema = new Schema({
  fingerprintId: { type: String, required: true },
  username: { type: String, required: true },
  lastActiveTime: { type: Date, required: true }
});

// Make schema available to the application
module.exports = userSchema;
