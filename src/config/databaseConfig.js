const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("mydatabase.db");

db.run(`
  CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_id TEXT NOT NULL,
    value REAL NOT NULL,
    reading_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS sensors (
    sensor_id TEXT PRIMARY KEY,
    sensor_type TEXT NOT NULL CHECK (sensor_type IN ('temperature', 'pressure', 'humidity'))
  )
`);

module.exports = {
  db,
};
