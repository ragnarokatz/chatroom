// room.js
var Util = require("./foundation/util.js");
var Config = require("./foundation/config.js");
var Connection = require("./connection.js");

var roomIDCounter = 0;
var rooms = {};

// create a room
module.exports.CreateRoom = function (room) {
    return new Promise((resolve, reject) => {

    });
    if (!isRoomValid(room)) {
        // room specs are not valid
        console.log("Failed to create room, room specs are invalid");
        return false;
    }

    // create room
    roomIDCounter++;

    var roomID = roomIDCounter.toString();
    room["id"] = roomID;
    room["date"] = new Date().toString();
    room["people"] = {}; // initiate people object for storing connection ids

    console.log("Creating room with id " + roomID);
    rooms[roomID] = room;
    return roomID;
}

// a connection joins a room
module.exports.JoinRoom = function (connection, roomID, pw) {
    var connID = connection["id"];
    if (!rooms.hasOwnProperty(roomID)) {
        // room with specified id is not found
        console.log("Connection " + connID + " failed to join room " + roomID + ", room does not exist");
        return 2100;
    }

    var room = rooms[roomID];
    var people = room["people"];
    if (people.length >= room["max_p"]) {
        // already exceeded maximum amount of people allowed in the room
        console.log("Connection " + connID + " failed to join room " + roomID +
            ", room limit = " + room["max_p"] + ", people count = " + people.length);
        return 2101;
    }

    if (room["type"] == 2 && pw !== room["pw"]) {
        // check password for private rooms
        console.log("Connection " + connID + " failed to join room " + roomID +
            ", correct password = " + room["pw"] + ", received password = " + pw);
        return 2102;
    }

    // the connection joins the room
    // set connection id as key and time as value
    connection["room_id"] = roomID;
    people[connID] = new Date().toString();
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

// requests room listing
module.exports.GetRecentRoomList = function () {
    var ret = {};
    var config = Config.GetConfig();
    var count = config["rlist_count"];
    var roomIDs = Object.keys(rooms);
    if (roomIDs.length <= 0)
        return {};

    var end = 0;
    if (roomIDs.length > count)
        end = roomIDs.length - count;

    for (var i = roomIDs.length - 1; i >= end; i--) {
        var roomID = roomIDs[i];
        var room = rooms[roomID];

        var retRoom = {};
        ret[roomID] = retRoom;
        retRoom["name"] = room["name"];
        retRoom["type"] = room["type"];
        retRoom["max_p"] = room["max_p"];

        // count how many people are in this room at the moment
        var people = room["people"];
        var connIDs = Object.keys(people);
        var count = connIDs.length;
        retRoom["size_p"] = count;
    }

    return ret;
}

// get specific room's info
module.exports.GetRoomInfo = function (roomID) {
    if (!rooms.hasOwnProperty(roomID)) {
        console.log("Failed to get room info, room listing does not contain " + roomID);
        return false;
    }

    var room = rooms[roomID];
    var retRoom = {};
    retRoom["name"] = room["name"];
    retRoom["type"] = room["type"];
    retRoom["max_p"] = room["max_p"];

    // count how many people are in this room at the moment
    var people = room["people"];
    var retPeople = {};
    retRoom["people"] = retPeople;

    var connIDs = Object.keys(people);
    for (var i = 0; i < connIDs.length; i++) {
        var connID = connIDs[i];
        var username = Connection.GetUserNameByID(connID);
        retPeople[connID] = username;
    }

    return retRoom;
}

// get room's members
module.exports.GetRoomMembers = function (roomID) {
    if (!rooms.hasOwnProperty(roomID)) {
        console.log("Failed to get room members, listing does not contain " + roomID);
        return false;
    }

    var room = rooms[roomID];
    return room["people"];
}

// is the room specs valid
function isRoomValid(room) {
    // check if property is missing
    if (!room.hasOwnProperty("name")) {
        console.log("Invalid room, does not contain property name");
        return false;
    }

    if (!room.hasOwnProperty("type")) {
        console.log("Invalid room, does not contain property type");
        return false;
    }

    if (!room.hasOwnProperty("max_p")) {
        console.log("Invalid room, does not contain property maximum number of people");
        return false;
    }

    // check room type
    var type = room["type"];
    if (type !== 1 && type !== 2) {
        console.log("Invalid room, type must be 1 or 2, got " + type);
        return false;
    }

    // check if private room has password set
    if (type === 2 && !room.hasOwnProperty("pw")) {
        console.log("Invalid room, private room must contain property password");
        return false;
    }

    // check property name
    var config = Config.GetConfig();
    var name = room["name"];
    var minSize = config["rname_size_min"];
    var maxSize = config["rname_size_max"];

    if (!Util.IsStringValidSize(name, minSize, maxSize)) {
        console.log("Invalid room, name size does not fit between " + minSize +
            " and " + maxSize + ", got " + name.length);
        return false;
    }

    var regExp = /^[A-Za-z0-9]+$/;
    if (!Util.IsStringValidExp(name, regExp)) {
        console.log("Invalid room, name must be alphanumeric, got " + name);
        return false;
    }

    // check max people property
    var maxPeople = room["max_p"];
    var arr = config["max_p"];
    if (!Util.IsInArray(maxPeople, arr)) {
        console.log("Invalid room, failed to find maximum people in allowed list, got " + maxPeople);
        return false;
    }

    if (!room.hasOwnProperty("pw"))
        // check complete for public rooms
        return true;

    // check password
    var password = room["pw"];
    minSize = config["pw_size_min"];
    maxSize = config["pw_size_max"];
    if (!Util.IsStringValidSize(password, minSize, maxSize)) {
        console.log("Invalid room, password size does not fit between " + minSize +
            " and " + maxSize + ", got " + password.length);
        return false;
    }

    if (!Util.IsStringValidExp(password, regExp)) {
        console.log("Invalid room, password must be alphanumeric, got " + password);
        return false;
    }

    // check complete for private rooms
    return true;
}

// Inactive client in room cleanup service, every 30 minutes
// checks for people that have joined the room more than 12 hours ago
setInterval(function () {
    console.log("Inactive client in room cleanup service");

    var dateNow = new Date();
    var dateMax = new Date(1970, 1, 1, 12, 0, 0);
    var roomIDs = Object.keys(rooms);

    for (var i = 0; i < roomIDs.length; i++) {
        var roomID = roomIDs[i];
        var room = rooms[roomID];
        var people = room["people"];
        var connIDs = Object.keys(people);

        for (var j = 0; j < connIDs.length; j++) {
            var connID = connIDs[j];
            var dateStr = people[connID];
            var date = Date.parse(dateStr);
            if ((dateNow - date) < dateMax)
                // less than 12 hours connected
                continue;

            // more than 12 hours connected, clean up id from room
            delete people[connID];
        }
    }
}, 30 * 60 * 1000);

// empty room cleanup service, removes room that no longer have any people
// activates every half an hour, also ignores rooms that have been created in the last 5 minutes
setInterval(function () {
    console.log("Empty room cleanup service");

    var dateNow = new Date();
    var dateMax = new Date(1970, 1, 1, 0, 5, 0);
    var roomIDs = Object.keys(rooms);

    for (var i = 0; i < roomIDs.length; i++) {
        var roomID = roomIDs[i];
        var room = rooms[roomID];
        var people = room["people"];
        if (!Util.IsEmptyObject(people))
            // room is not empty yet
            continue;

        var dateStr = room["date"];
        var date = Date.parse(dateStr);
        if ((dateNow - date) < dateMax)
            // room life is less than 5 minutes
            continue;

        // removes empty room
        delete rooms[roomID];
    }
}, 30 * 60 * 1000);

// appendix
/* this is what room object looks like
{
    "4" : {
        "name": "myroom",
        "type": 1,
        "max_p": 5,
        "people": {},
        "date": "2010-9-12"
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
            "783" : "2008-6-24"
        },
        "date": "2008-6-14"
    },
    "6": {
        "name": "secret",
        "type": 2,
        "pw": "loljk",
        "max_p: 2",
        "people": {
            "13" : "2011-1-4",
            "250" : "2005-4-16"
        },
        "date": "1998-9-15"
    }, ...
}
*/
