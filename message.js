// message.js
const Room = require("./Room.js");

// Broadcast to all open connections
function broadcast(data) {
    Object.keys(connections).forEach(function (key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}

// Send a message to a connection by its connectionID
function sendToConnectionId(connectionID, data) {
    var connection = connections[connectionID];
    if (connection && connection.connected) {
        connection.send(data);
    }
}

// send the target connection message
module.exports.SendClientMessage = function (connection, type, data) {
    var json = JSON.stringify(data);
    var str = type.toString() + ":" + json;
    connection.send(str);
}

module.exports.ProcessClientMessage = function (message, connection) {
    if (message.length <= 4) {
        console.log("Invalid message: " + message + ", too short");
        return;
    }

    var messageType = message.substring(0, 4);
    var json = message.substring(4);
    var obj = JSON.parse(json);

    switch (messageType) {
        case "200:":
            // create room
            console.log("Connection " + connection.id + "requests to create room with specs " + json);
            Rooms.CreateRoom(obj);
            break;

        case "201:":
            // join room
            console.log("Connection " + connection.id + "requests to join room " + obj.roomID);
            Rooms.JoinRoom(connection, obj.roomID);
            break;

        case "202:":
            // leave room
            console.log("Connection " + connection.id + "requests to leave room");
            Rooms.LeaveRoom(connection);
            break;

        case "300:":
            // send message
            console.log("Connection " + connection.id + "sends message " + obj.message);

        default:
            console.log("Process message error, impossible here.");
            break;
    }
}
