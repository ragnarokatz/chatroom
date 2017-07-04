const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(function (req, res) {
    console.log("Route visited on webpage")
    res.send({ msg: "hello" });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function heartbeat() {
    console.log("Heartbeat detected")
    this.isAlive = true;
}

wss.on('connection', function connection(ws, req) {
    const ip = req.connection.remoteAddress;
    const location = url.parse(req.url, true);
    console.log("ip = " + ip);
    console.log("location = " + location.path);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        // ws.send("echo: " + message);
    });

    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('close', () => console.log('Client disconnected'));
    ws.send('something');
});

server.listen(PORT, function listening() {
    console.log('Server started, listening on %d', server.address().port);
});

const interval = setInterval(function ping() {
    console.log("Check for heartbeat");
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log("Socket no longer alive, terminating");
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping('', false, true);
    });
}, 30000);