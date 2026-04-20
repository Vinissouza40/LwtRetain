import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("PUB RETAIN: conectado");

  let i = 0;

  const t = setInterval(() => {
    const mensagem = `msg ${i} (QoS0 - retain)`;

    client.publish("aula/retain", mensagem, { qos: 0, retain: true });

    console.log("PUB RETAIN enviou:", mensagem);
    i++;

    if (i === 10) {
      clearInterval(t);
      client.end();
    }
  }, 500);
});