const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5003 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // Broadcast code changes to all clients in the same room
    wss.clients.forEach((client) => {
      if (client.room === JSON.parse(message).roomId) {
        client.send(message);
      }
    });
  });
});
