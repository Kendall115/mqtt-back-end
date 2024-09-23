# MQTT Sensors Dashboard Backend

This project is a real-time dashboard built with React, NodeJS and Python that visualizes data from MQTT sensors. It simulates various sensor readings.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Kendall115/mqtt-back-end.git
```

2. Navigate to the project directory:

```bash
cd mqtt-backend
```

3. Install dependencies:

```bash
npm install
```

## Configuration

Before running the application make sure mqtt broker is running and is using port 1883 or modify src/config/MqttConfig.js file according to your broker configuration.

```javascript
const mqtt = require("mqtt");

const mqttClient = mqtt.connect({
  host: "localhost",
  port: 1883,
});

module.exports = { mqttClient };
```
