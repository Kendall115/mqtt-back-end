const express = require("express");
const http = require("http");
const setupSocket = require("./sockets/socket");
const { handleMessages } = require("./services/mqttService");
const { mqttClient } = require("./config/MqttConfig");

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

mqttClient.on("message", (topic, message) => {
  handleMessages(io, topic, message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
