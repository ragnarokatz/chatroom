// ################################################################################
// Web service setup

require("dotenv").config();

var { importWords, generateUsername } = require("utils.js");
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");
const m = manager();

// ################################################################################
// Deliver the app's home page to browser clients

app.use(express.static(__dirname + "/public"));

// ################################################################################
// Request handlers

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// ################################################################################
// Resource not found (this should be at the end)

app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect()
  .then(() => {
    // ################################################################################
    // Socket IO Setup
    io.on("connection", function(socket) {
      console.log(`a user connected, assigned socket id ${socket.id}`);

      socket.on("disconnect", function() {
        console.log("user disconnected");
      });

      socket.on("message", function(message) {
        console.log("message: " + message);
        socket.broadcast.emit("message", message);
      });

      socket.on("reconnect", function(attemptNum) {
        console.log(
          `socket ${socket} has reconnected, assigned new id ${socket.id}`
        );
      });

      socket.username = generateUsername();
      socket.emit("name", username);
    });

    http.listen(process.env.PORT, function() {
      console.log(`Chatroom server is listening on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
