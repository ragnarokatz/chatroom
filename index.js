// Environment variables setup
require("dotenv").config();

// Web service setup
var express = require("express");
var app = express();
var http = require("http").createServer(app);
var { initializeSocket } = require("./socket.js");
var { initializeUtils } = require("./utils.js");
var { initializeCleaner } = require("./cleaner.js");

// Data model and persistent store setup
const manager = require("./manager.js");
const m = manager();

// Deliver the app's home page to browser clients
app.use(express.static(__dirname + "/public"));

// Request handlers
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send("Resource not found");
});

// Attempt to connect to the database, and
// tell the app to start listening for requests
m.connect()
  .then(() => {
    const nounGetAll = m.nounGetAll();
    const verbGetAll = m.verbGetAll();
    const adjGetAll = m.adjGetAll();

    Promise.all([nounGetAll, verbGetAll, adjGetAll])
      .then(values => {
        // Utils module setup
        initializeUtils(values[0], values[1], values[2]);
        initializeSocket(http, m);
        initializeCleaner(m);

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
