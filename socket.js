// socket.js
var { generateUsername } = require("./utils.js");
let m;

// get message history from database and send it out to a socket
function getAndSendMessageHistory(socket) {
  m.messageGetAll()
    .then(data => {
      socket.emit("history", data);
    })
    .catch(err => {
      console.log("Unable to get historical messages from database: \n" + err);
    });
}

// send username to a socket
function setAndSendUsername(socket, username) {
  socket.username = username;
  socket.emit("username", username);
}

module.exports.initializeSocket = function(http, manager) {
  m = manager;

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
          console.log(`found user with fingerprint: ${fingerprintId}`);

          var username = obj.username;
          setAndSendUsername(socket, username);
          getAndSendMessageHistory(socket);

          obj.lastActiveTime = new Date();
          m.userUpdate(obj).catch(err => {
            console.log("Unable to update user in database: \n" + err);
          });
        })
        .catch(err => {
          console.log(`unable to find user with fingerprint: ${fingerprintId}`);

          var username = generateUsername();
          setAndSendUsername(socket, username);
          getAndSendMessageHistory(socket);

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
        var username = generateUsername();
        setAndSendUsername(socket, username);
      }

      obj = { sender: socket.username, text: message, time: new Date() };
      m.messageAdd(obj).catch(err => {
        console.log("Unable to add message to database: \n" + err);
      });

      socket.broadcast.emit("message", obj);
    });
  });
};
