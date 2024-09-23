const { saveReading } = require("../services/databaseService");

const handleReadingMessage = async (io, dataJSON) => {
  return saveReading(
    io,
    dataJSON.sensor_id,
    dataJSON.value,
    dataJSON.sensor_type
  );
};

module.exports = { handleReadingMessage };
