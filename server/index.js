import express from "express";
import expressWs from "express-ws";
import ConnectionController from "./controllers/connection.controller.js";
import MessageController from "./controllers/message.controller.js";

const PORT = process.env.PORT || 5172;
const app = express();
const { getWss, app: wsApp } = expressWs(app);
const aWss = getWss();

app.use(express.static("dist"));

wsApp.ws("/", (ws, res) => {
  ws.isAlive = true;
  ws.on("message", (msg) => {
    if (msg === "ping") {
      ws.isAlive = true;
      ws.send("pong");
      return;
    }
    switch (JSON.parse(msg).type) {
      case "connection":
        ConnectionController.handleMessage(aWss, ws, msg);
        break;
      case "msg":
        MessageController.handleMessage(aWss, ws, msg);
        break;

      default:
        break;
    }
  });
  ws.on("close", () => {
    ConnectionController.deleteConnection(aWss, ws, { user: { id: ws.id } });
  });
});

setInterval(() => {
  aWss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ConnectionController.deleteConnection(aWss, ws, { user: { id: ws.id } });
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
