const { mqttClient } = require("../config/MqttConfig");
const { handleReadingMessage } = require("../controllers/readingController");

let connectedSensors = [];

mqttClient.on("connect", () => {
  console.log("Connected to Mosquitto");
  mqttClient.subscribe("readings");
  mqttClient.subscribe("sensor_connected");
  mqttClient.subscribe("sensor_disconnected");
});

mqttClient.on("error", (error) => {
  console.error("Error:", error);
});

async function handleMessages(io, topic, message) {
  const dataJSON = JSON.parse(message.toString());
  switch (topic) {
    case "readings":
      await handleReadingAndEmit(io, dataJSON);
      break;
    case "sensor_connected":
      updateConnectedSensors(dataJSON.sensor_id, true);
      emitSensorListUpdate(io);
      break;
    case "sensor_disconnected":
      updateConnectedSensors(dataJSON.sensor_id, false);
      emitSensorListUpdate(io);
      break;
    default:
      console.warn(`Unknown topic: ${topic}`);
  }
}

async function handleReadingAndEmit(io, dataJSON) {
  const newReading = await handleReadingMessage(io, dataJSON);
  io.emit(`new data ${newReading.sensor_id}`, newReading);
}

function updateConnectedSensors(sensorId, isConnected) {
  if (isConnected) {
    connectedSensors.push(sensorId);
  } else {
    connectedSensors = connectedSensors.filter((sensor) => sensor !== sensorId);
  }
}

function emitSensorListUpdate(io) {
  io.emit(`sensors list update`, connectedSensors);
}

function getConnectedSensors() {
  return connectedSensors;
}

module.exports = { handleMessages, getConnectedSensors };
