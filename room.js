// room.js
var Util = require("./foundation/util.js");
var Config = require("./foundation/config.js");

var roomIDCounter = 0;
var rooms = {};

// create a room
module.exports.CreateRoom = function (room) {
    if (!isRoomValid(room)) {
        // room specs are not valid
        console.log("Failed to create room, room specs are invalid");
        return false;
    }

    // create room
    roomIDCounter++;

    var roomID = roomIDCounter.toString();
    room["id"] = roomID;
    room["people"] = {}; // initiate people object for storing connection ids

    console.log("Creating room with id " + roomID);
    rooms[roomID] = room;
    return roomID;
}

// delete a room
module.exports.DeleteRoom = function (roomID) {
    if (!rooms.hasOwnProperty(roomID)) {
        // room listing does not contain room id
        console.log("Failed to delete room " + roomID + ", room does not exist");
        return false;
    }

    var room = rooms[roomID];
    if (!Util.IsEmptyObject(room["people"])) {
        // room is not empty yet
        console.log("Cannot delete room " + roomID + ", room contains users");
        return false;
    }

    // delete room from listing
    console.log("Deleting room " + roomID + " from listing");
    delete rooms[roomID];
    return true;
}

// a connection joins a room
module.exports.JoinRoom = function (connection, roomID) {
    var connID = connection["id"];
    if (!rooms.hasOwnProperty(roomID)) {
        // room with specified id is not found
        console.log("Connection " + connID + " failed to join room " + roomID + ", room does not exist");
        return false;
    }

    var room = rooms[roomID];
    var people = room["people"];
    if (people.length >= room["max_p"]) {
        // already exceeded maximum amount of people allowed in the room
        console.log("Connection " + connID + " failed to join room " + roomID + ", already reached maximum limit");
        return false;
    }

    // the connection joins the room
    // set connection id as key and time as value
    connection["room_id"] = roomID;
    people[connID] = (new Date()).toString();
    return true;
}

// a connection leaves a room
module.exports.LeaveRoom = function (connection) {
    var connID = connection["id"];
    if (!connection.hasOwnProperty("room_id")) {
        // connection id is not in any room
        console.log("Leave room fail, connection " + connID + " is not in any room");
        return false;
    }

    // search the listing for the room id
    var roomID = connection["room_id"];
    if (!rooms.hasOwnProperty(roomID)) {
        // room with specified id is not found
        console.log("Leave room fail, room listing does not contain " + roomID);
        return false;
    }

    // get list of people in room
    var room = rooms[roomID];
    var people = room["people"];
    if (!people.hasOwnProperty(connID)) {
        // connection id is not found in room
        console.log("Leave room fail, connection" + connID + " is not in room " + roomID);
        return false;
    }

    // the connection leaves the room
    console.log("Removing " + connID + "from room " + roomID);
    delete people[connID];
    delete connection["room_id"];
    return true;
}

// is the room specs valid
function isRoomValid(room) {
    if (!room.hasOwnProperty("name")) {
        console.log("Invalid room, does not contain property name");
        return false;
    }

    if (!room.hasOwnProperty("type")) {
        console.log("Invalid room, does not contain property type");
        return false;
    }

    if (!room.hasOwnProperty("max_p")) {
        console.log("Invalid room, does not contain property max_p");
        return false;
    }

    var name = room["name"];
    Util.IsStringValidSize();
    var regExp = /^[A-Za-z0-9]+$/;

}

// inactive messenger cleanup service

// empty room cleanup service

// addendum
/* this is what room object looks like
{
    "4" : {
        "name": "myroom",
        "type": 1,
        "max_p": 5,
        "people": {},
    },
    "5": {
        "name": "omgholy",
        "type": 2,
        "pw": "jajaqq",
        "max_p: 20",
        "people": {
            "12" : "1979-6-12",
            "232" : "1980-7-14",
            "8498" : "2010-9-12",
            "783" : "2008-6-24",
        }
    },
    "6": {
        "name": "secret",
        "type": 2,
        "pw": "loljk",
        "max_p: 2",
        "people": {
            "13" : "2011-1-4",
            "250" : "2005-4-16",
        }
    }, ...
}
*/
