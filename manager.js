// Data service operations setup
const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Load the schemas...

// Data entities; the standard format is:
const { nounSchema, verbSchema, adjSchema } = require("./msc-words.js");
const messageSchema = require("./msc-message.js");
const userSchema = require("./msc-user.js");

// Define the functions that can be called by server.js
module.exports = function() {
  // Collection properties, which get their values upon connecting to the database
  let Messages;
  let Users;
  let Nouns;
  let Verbs;
  let Adjs;

  return {
    // Connect to the database
    connect: function() {
      return new Promise(function(resolve, reject) {
        // Create connection to the database
        console.log("Attempting to connect to the database...");

        // The following works for localhost...
        // Replace the database name with your own value
        mongoose.connect(process.env.DB_CONNECTION_STRING, {
          connectTimeoutMS: 5000,
          useUnifiedTopology: true
        });

        // This one works for MongoDB Atlas...
        // (coming soon)

        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect().
        // You can access the default connection using mongoose.connection.
        var db = mongoose.connection;

        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on("error", error => {
          console.log("Connection error:", error.message);
          reject(error);
        });

        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once("open", () => {
          console.log("Connection to the database was successful");
          Messages = db.model("messages", messageSchema, "messages");
          Users = db.model("users", userSchema, "users");
          Nouns = db.model("nouns", nounSchema, "nouns");
          Verbs = db.model("verbs", verbSchema, "verbs");
          Adjs = db.model("adjs", adjSchema, "adjs");
          // Add others here...

          resolve();
        });
      });
    },

    // User requests
    userGetByFingerprintId: function(fingerprintId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        Users.findOne({ fingerprintId: fingerprintId }, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },

    userAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Users.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    userUpdate: function(newItem) {
      return new Promise(function(resolve, reject) {
        Users.findByIdAndUpdate(
          newItem._id,
          newItem,
          { new: true },
          (error, item) => {
            if (error) {
              // Cannot edit item
              return reject(error.message);
            }
            // Check for an item
            if (item) {
              // Edited object will be returned
              return resolve(item);
            } else {
              return reject("Not found");
            }
          }
        );
      });
    },

    // Message requests
    messageGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        Messages.find()
          .limit(100)
          .sort({ time: "desc" })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    messageAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        Messages.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    messageDeleteOld: function() {
      return new Promise(function(resolve, reject) {
        var cutoff = new Date();
        cutoff.setYear(cutoff.getYear() - 1);
        Messages.find({ time: { $lt: cutoff } })
          .remove()
          .exec(error => {
            if (error) {
              // Cannot delete item
              return reject(error.message);
            }
            // Return success, but don't leak info
            return resolve();
          });
      });
    },

    // Word requests
    nounGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        Nouns.find().exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
      });
    },

    verbGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        Verbs.find().exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
      });
    },

    adjGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        Adjs.find().exec((error, items) => {
          if (error) {
            // Query error
            return reject(error.message);
          }
          // Found, a collection will be returned
          return resolve(items);
        });
      });
    }
  }; // return statement that encloses all the function members
}; // module.exports
