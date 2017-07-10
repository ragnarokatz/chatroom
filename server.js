const Config = require("./foundation/config.js");
const Connection = require("./connection.js");
const Message = require("./message.js");
const Room = require("./room.js");

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

app.use(function (req, res) {
    console.log("Homepage visited via browser");
    res.send("Homepage");
});

// check to see if this origin is allowed
function isOriginAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}

// heartbeat callback response
function heartbeat() {
    console.log("Heartbeat callback response");
    this.isAlive = true;
}

// on request connection
wsServer.on('request', function (request) {
    if (!isOriginAllowed(request.origin)) {
        // reject connection
        request.reject();
        console.log((new Date()) + ': Connection from origin ' + request.origin + ' rejected');
        return;
    }

    // allow connection
    var connection = request.accept(null, request.origin);

    // add to connection map
    Connections.AddConnection(connection);
    console.log((new Date()) + ': Connection ID ' + connection.id + ' accepted from origin ' + request.origin);

    // on connection close
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ': Connection ' + connection.remoteAddress +
            ' disconnected. Connection ID: ' + connection.id);
        Room.LeaveRoom(connection);
        Connection.RemoveConnection(connection);
    });

    // on connection message
    connection.on('message', function (message) {
        console.log("Received message from " + connection.id + ", message = " + message);
        Message.ProcessMessage(message, connection);
    });

    // on connection test ping
    connection.isAlive = true;
    connection.on('pong', heartbeat);

    // message client that connection is successful
    Message.SendClientMessage(connection, 100, { "r": 1 })
});

// read in config, then start the server
Config.InitConfig()
    .then(function () {
        server.listen(PORT, function () {
            console.log("Server started, listening on " + server.address().port);
        });
    })
    .catch(function (error) {
        console.log(error);
        process.exit(1);
    });

// check for dead connections, every 30 seconds
setInterval(function () {
    console.log("Check for heartbeat service");
    var length = wsServer.clients.length;
    for (var i = 0; i < length; i++) {
        var connection = wsServer.clients[i];
        if (connection.isAlive === false) {
            // no pong response back from client
            console.log("Connection is no longer alive, terminating");
            connection.terminate();
        } else {
            // ping client for response
            connection.isAlive = false;
            connection.ping('', false, true);
        }
    }
}, 30 * 1000);
