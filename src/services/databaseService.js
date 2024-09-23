const { db } = require("../config/databaseConfig");

async function insertSensor(db, sensorId, sensorType) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO sensors (sensor_id, sensor_type) VALUES (?, ?)`,
      [sensorId, sensorType],
      function (err) {
        if (err) {
          console.error(err.message);
          return reject(err);
        }
        resolve(this.changes > 0);
      }
    );
  });
}

async function saveReading(io, sensorId, value, sensorType) {
  try {
    const isNewSensor = await insertSensor(db, sensorId, sensorType);
    if (isNewSensor) {
      io.emit(`new sensor ${sensorType}`, { sensor_id: sensorId, value });
      console.log("Sensor added successfully.");
    } else {
      console.log("Sensor already exists.");
    }
    const now = new Date();

    const isoString = now.toISOString().slice(0, 16) + "Z";

    await db.run(
      `INSERT INTO sensor_data (sensor_id, value, reading_time) VALUES (?, ?, ?)`,
      [sensorId, value, isoString]
    );

    console.log("Value reading saved successfully.");

    return {
      sensor_id: sensorId,
      value,
      reading_time: isoString,
    };
  } catch (err) {
    console.error(err.message);
  }
}

async function getSensorsByType(type) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM sensors WHERE sensor_type = ?`,
      [type],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

async function getSensorValues(sensorId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM sensor_data WHERE sensor_id = ?`,
      [sensorId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

async function getSensorValuesByDate(sensorId, date) {
  const inputDate = new Date(date);
  const year = inputDate.getUTCFullYear();
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getUTCDate()).padStart(2, "0");

  const startDate = `${year}-${month}-${day}T00:00:00Z`;
  const endDate = `${year}-${month}-${day}T23:59:59Z`;

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM sensor_data WHERE sensor_id = ? AND reading_time >= ? AND reading_time <= ?`,
      [sensorId, startDate, endDate],
      (err, rows) => {
        if (err) {
          console.log("en82u388098oo");
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

module.exports = {
  saveReading,
  getSensorsByType,
  getSensorValues,
  getSensorValuesByDate,
};
