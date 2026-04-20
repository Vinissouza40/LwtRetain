import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883", {
  will: {
    topic: "aula/status",
    payload: "offline",
    qos: 1,
    retain: true
  }
});

client.on("connect", () => {
  console.log("PUB LWT: conectado");

  client.publish("aula/status", "online", { qos: 1, retain: true });

  let i = 0;

  const t = setInterval(() => {
    client.publish("aula/qos", `msg ${i} (QoS1)`, { qos: 1 });
    console.log("PUB enviou:", i);
    i++;

    if (i === 10) {
      clearInterval(t);

      client.end();
    }
  }, 500);
});