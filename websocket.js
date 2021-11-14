const websocket = require("ws");
const { processMessage } = require("./utils/message.utiles");
const http = require("http");
const jwt = require("jsonwebtoken");
const {
    broadcastMessage,
    clients,
    retreiveAndSendMessage,
} = require("./utils/ws.utils");

const wss = new websocket.Server({
    noServer: true,
});

wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
        clients.filter(
            (generalSocket) => generalSocket.connectionID !== ws.connectionID
        );
    });

    ws.on("message", (payload) => {
        var message = processMessage(payload);
        if (!message) {
            return;
        }
        if (message.intent === "chat") {
            broadcastMessage(message, ws);
        } else if (message.intent === "old-message") {
            const count = message.count;
            if (!count) return;
            retreiveAndSendMessage(ws, count);
        }
    });
});
const setwebsocketServer = (app) => {
    const port = process.env.PORT || 3000;
    let server = http
        .createServer(app)
        .listen(port, console.log.bind(console, "server started"));

    server.on("upgrade", (request, socket, head) => {
        const token = request.url.slice(1);
        var payload;
        try {
            payload = jwt.verify(token, process.env.SECRET_TOKEN);
        } catch (err) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function done(ws) {
            ws.connectionID = payload.email;
            wss.emit("connection", ws, request);
        });
    });
};

module.exports = setwebsocketServer;
