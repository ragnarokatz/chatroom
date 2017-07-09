// connection.js
var connectionIDCounter = 0;
var connections = {};

module.exports.AddConnection = function (connection) {
    connectionIDCounter++;
    connection.id = connectionIDCounter;
    console.log("Adding connection " + connection.id);

    connections[connection.id] = connection;
    return connection.id;
}

module.exports.RemoveConnection = function (connection) {
    console.log("Removing connection " + connection.id);
    delete connections[connection.id];
}

module.exports.GetConnection = function (connectionID) {
    if (!connections.hasOwnProperty(connectionID)) {
        console.log("Failed to get connection")
    } else {
        return
    }
}