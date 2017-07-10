// message.js
const Connection = require("./connection.js");
const Room = require("./room.js");

// send the target connection message
module.exports.SendClientMessage = function (connection, type, data) {
    if (!connection.connected) {
        console.log("Failed to send to " + connection["id"] + ", not connected");
        return;
    }

    var json = JSON.stringify(data);
    var str = type.toString() + ":" + json;
    connection.send(str);
}

module.exports.ProcessClientMessage = function (message, connection) {
    if (message.length <= 4) {
        console.log("Invalid message from connection " + connection["id"] + ": " + message + ", too short");
        SendClientMessage(connection, 400, { "err": 1000 });
        return;
    }

    // get message type, and attached json
    var messageType = message.substring(0, 3);
    var json = message.substring(4);
    var obj = JSON.parse(json);
    console.log("Message from connection " + connection["id"] + ", type = " + messageType + ", obj = " + json);

    switch (messageType) {
        case "201":
            // set login username
            console.log("Connection " + connection["id"] + " requests to set username " + json);

            Connection.AddUsername(connection, obj["name"]);
            SendClientMessage(connection, 101, { "ret": 1 });
            break;

        case "210":
            // create room
            console.log("Connection " + connection["id"] + " requests to create room with specs " + json);

            var roomID = Room.CreateRoom(obj);
            if (roomID === false)
                // fail to create room
                SendClientMessage(connection, 400, { "err": 2000 });
            else
                // successfully created room
                SendClientMessage(connection, 110, { "ret": 1, "room_id": roomID });
            break;

        case "211":
            // join room
            console.log("Connection " + connection["id"] + " requests to join room " + obj["room_id"]
                + ", password = " + obj["pw"]);

            var ret = Room.JoinRoom(connection, obj["room_id"], obj["pw"]);
            if (ret === true) {
                // join room success
                SendClientMessage(connection, 111, { "ret": 1 });

                // broadcast to other members that you have joined the room
                var username = Connection.GetUserName(connection);
                var people = Room.GetRoomMembers(obj["room_id"]);
                var connIDs = Object.keys(people);
                broadcastToMembers(connIDs, 120, { "id": connection["id"], "name": username }, connection);

            } else {
                // fail to join room
                SendClientMessage(connection, 400, { "err": ret });
            }
            break;

        case "212":
            // leave room
            console.log("Connection " + connection["id"] + " requests to leave room ");
            var roomID = connection["room_id"];

            if (!Room.LeaveRoom(connection)) {
                SendClientMessage(connection, 400, { "err": 2200 });
            } else {
                SendClientMessage(connection, 112, { "ret": 1 });

                // broadcast to other members that you have left the room
                var people = Room.GetRoomMembers(roomID);
                var connIDs = Object.keys(people);
                broadcastToMembers(connIDs, 121, { "id": connection["id"] }, connection);
            }
            break;

        case "213":
            // request room listing
            console.log("Connection " + connection["id"] + " requests room listing");

            SendClientMessage(connection, 113, Room.GetRecentRoomList());
            break;

        case "214":
            // request specific room's info
            console.log("Connection " + connection["id"] + " requests info for room " + obj["room_id"]);
            var room = Room.GetRoomInfo(obj["room_id"]);

            if (!room) {
                SendClientMessage(connection, 400, { "err": 2300 });
            } else {
                var roomInfo = Room.GetRoomInfo(obj["room_id"]);
                SendClientMessage(connection, 114, roomInfo);
            }
            break;

        case "230":
            // send message to client
            console.log("Connection " + connection["id"] + " sends message " + obj["msg"]);
            if (!connection.hasOwnProperty["room_id"]) {
                SendClientMessage(connection, 400, { "err": 2400 });
            } else {
                SendClientMessage(connection, 130, { "ret": 1 })

                // broadcast to room members
                var roomID = connection["room_id"];
                var people = Room.GetRoomMembers(roomID);
                var connIDs = Object.keys(people);
                broadcastToMembers(connIDs, 131, { "id": connection["id"], "msg": obj["msg"] }, connection);
            }

            break;

        default:
            console.log("Process client message error, impossible here.");
            SendClientMessage(connection, 400, { "err": 1000 });
            break;
    }
}

// Broadcast to all open connections
function broadcastToMembers(connIDs, type, data, excludeConn) {
    for (var i = 0; i < connIDs.length; i++) {
        var connID = connIDs[i];
        if (connID == excludeConn["id"])
            // do not broadcast the message to self
            continue;

        var connection = Connection.GetConnection(connID);
        if (!connection)
            // invalid connection
            continue;

        if (!connection.connected)
            // connection not connected
            continue;

        SendClientMessage(connection, type, data)
    }
}