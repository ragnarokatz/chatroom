// room.js
var rooms = {};
var people = {};
var roomIDCounter = 0;

module.exports.CreateRoom = function (room) {
    roomIDCounter++;
    room.id = roomIDCounter;
    room["people"] = [];

    rooms[room.id] = room;
    return roomID;
}

module.exports.DeleteRoom = function (roomID) {
    delete rooms[roomID];
}

module.exports.JoinRoom = function (connection, roomID) {
    var room = rooms[roomID];
    room["people"].push(connection.id);
    people[connection.id] = roomID;
}

module.exports.LeaveRoom = function (connection) {
    var roomID = people[connection.id];
    var index = room.connectionIDs.indexOf(connection.id);

    if (index == -1) {
        console.log("Failed to remove " + connection.id + " from room " + roomID)
        return false;
    } else {
        console.log("Removing " + connection.id + "from room " + roomID);
        array.splice(index, 1);
        return true;
    }

    delete people[connection.id];
}

