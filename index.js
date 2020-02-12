// ################################################################################
// Web service setup

require("dotenv").config();

var { importWords, generateUsername } = require("./utils.js");
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

function getMessageHistory(socket) {
  m.messageGetAll()
    .then(data => {
      socket.emit("history", data);
    })
    .catch(err => {
      console.log("Unable to get historical messages from database: \n" + err);
    });
}

// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect()
  .then(() => {
    const nounGetAll = m.nounGetAll();
    const verbGetAll = m.verbGetAll();
    const adjGetAll = m.adjGetAll();

    Promise.all([nounGetAll, verbGetAll, adjGetAll])
      .then(values => {
        // ################################################################################
        // Utils module setup
        importWords(values[0], values[1], values[2]);

        // ################################################################################
        // Socket IO setup
        io.on("connection", function(socket) {
          console.log(`a user connected, assigned socket id ${socket.id}`);

          socket.on("disconnect", function() {
            console.log("user disconnected");
          });

          socket.on("message", function(message) {
            console.log("message: " + message);

            obj = { sender: socket.username, text: message, time: new Date() };
            m.messageAdd(obj);
            socket.broadcast.emit("message", obj);
          });

          socket.on("reconnect", function(attemptNum) {
            console.log(
              `socket ${socket} has reconnected, assigned new id ${socket.id}`
            );

            getMessageHistory(socket);
          });

          var username = generateUsername();
          socket.username = username;
          socket.emit("username", username);
          console.log(
            `assigning username ${username} to socket id ${socket.id}`
          );

          getMessageHistory(socket);
        });

        http.listen(process.env.PORT, function() {
          console.log(
            `Chatroom server is listening on port ${process.env.PORT}`
          );
        });
      })
      .catch(err => {
        console.log("Unable to retrieve words from database:\n" + err);
        process.exit();
      });
  })
  .catch(err => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
