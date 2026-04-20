import mqtt from "mqtt";

const options = {
  clientId: "subscriber_status_01",
  clean: false
};

const client = mqtt.connect("mqtt://localhost:1883", options);

client.on("connect", (connack) => {
  console.log(`SUB LWT: conectado (Sessão recuperada: ${connack.sessionPresent})`);

  // Escuta o tópico onde o LWT será publicado
  client.subscribe("aula/status", { qos: 1 });
});

client.on("message", (topic, msg) => {
  const mensagem = msg.toString();

  console.log(`STATUS recebido: ${mensagem}`);

  if (mensagem === "online") {
    console.log("🟢 Dispositivo ONLINE");
  } else if (mensagem === "offline") {
    console.log("🔴 Dispositivo OFFLINE (LWT acionado)");
  }
});