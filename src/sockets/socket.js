const socketIo = require("socket.io");
const {
  getSensorsByType,
  getSensorValues,
  getSensorValuesByDate,
} = require("../services/databaseService");

const { getConnectedSensors } = require("../services/mqttService");

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("get sensors", async (type, callback) => {
      const sensors = await getSensorsByType(type);
      callback(sensors);
    });

    socket.on("get sensor values", async (type, date, callback) => {
      const sensors = await getSensorValuesByDate(type, date);
      callback(sensors);
    });

    socket.on("get sensors connected", async (callback) => {
      const connectedSensorsList = getConnectedSensors();
      callback(connectedSensorsList);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;
