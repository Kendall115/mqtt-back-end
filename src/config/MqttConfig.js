const mqtt = require("mqtt");

const mqttClient = mqtt.connect({
  host: "localhost",
  port: 1883,
});

module.exports = { mqttClient };
