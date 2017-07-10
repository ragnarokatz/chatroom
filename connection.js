// connection.js
var connectionIDCounter = 0;
var connections = {};

// add a connection to pool
// auto generate connection id and return it
module.exports.AddConnection = function (connection) {
    connectionIDCounter++;

    var connID = connectionIDCounter.toString();
    connection["id"] = connID;
    console.log("Adding connection " + connID + " to pool");

    connections[connID] = connection;
    return connID;
}

// remove a connection from pool
module.exports.RemoveConnection = function (connection) {
    var connID = connection["id"];
    if (!connections.hasOwnProperty(connID)) {
        console.log("Failed to remove connection " + connID + " from pool");
        return false;
    } else {
        console.log("Removing connection " + connID + " from pool");
        delete connections[connID];
        return true;
    }
}

// get a connection by id
module.exports.GetConnection = function (connID) {
    if (!connections.hasOwnProperty(connID)) {
        console.log("Failed to get connection with id " + connID + " from pool");
        return false;
    } else {
        return connections[connID];
    }
}

// add a username to existing connection
module.exports.AddUsername = function (connection, name) {
    console.log("Adding username " + name + " to connection " + connection["id"]);
    connection["username"] = name;
}

// get name from connection
module.exports.GetUserName = function (connection) {
    if (!connection.hasOwnProperty("username")) {
        console.log("Failed to get username for connection " + connection["id"] + ", name not found");
        return false;
    } else {
        return connection["username"];
    }
}

module.exports.GetUserNameByID = function (connID) {
    var connection = GetConnection(connID);
    if (!connection)
        return false;

    return GetUserName(connection);
}