// socket.js
var { generateUsername } = require("./utils.js");

// get message history from database and send it out to a socket
function sendMessageHistory(socket) {
  m.messageGetAll()
    .then(data => {
      socket.emit("history", data);
    })
    .catch(err => {
      console.log("Unable to get historical messages from database: \n" + err);
    });
}

// send username to a socket
function sendUsername(socket, username) {
  socket.username = username;
  socket.emit("username", username);
}

// generate a random username and send it to a socket
function generateAndSendUsername(socket) {
  var username = generateUsername();
  sendUsername(socket, username);
}

module.exports.initializeSocket = function(http) {
  var io = require("socket.io")(http);
  // Socket IO setup
  io.on("connection", function(socket) {
    console.log(`a user connected, assigned socket id ${socket.id}`);

    // Obtain fingerprint from client, get username if it is already
    // cached in database, else create new username and cache it
    // in database
    socket.on("fingerprintId", function(fingerprintId) {
      m.userGetByFingerprintId(fingerprintId)
        .then(obj => {
          var username = obj.username;
          sendUsername(socket, username);
          sendMessageHistory(socket);

          obj.lastActiveTime = new Date();
          m.userUpdate(obj).catch(err => {
            console.log("Unable to update user in database: \n" + err);
          });
        })
        .catch(err => {
          generateAndSendUsername(socket);
          sendMessageHistory(socket);

          var obj = {
            fingerprintId: fingerprintId,
            username: username,
            lastActiveTime: new Date()
          };
          m.userAdd(obj).catch(err => {
            console.log("Unable to add user to database: \n" + err);
          });
        });
    });

    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    // On receiving message from client,
    // broadcast to everyone except self socket
    // TODO: this needs to be changed when rooms are added in later
    socket.on("message", function(message) {
      console.log("message: " + message);

      if (!socket.username) {
        generateAndSendUsername(socket);
      }

      obj = { sender: socket.username, text: message, time: new Date() };
      m.messageAdd(obj).catch(err => {
        console.log("Unable to add message to database: \n" + err);
      });

      socket.broadcast.emit("message", obj);
    });
  });
};
