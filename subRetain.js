import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("SUB RETAIN: conectado");

  // Assina o tópico onde há mensagens com retain
  client.subscribe("aula/retain", { qos: 0 });
});

client.on("message", (topic, msg, packet) => {
  const mensagem = msg.toString();

  console.log("SUB RETAIN recebeu:", mensagem);

  // Verifica se a mensagem veio do retain
  if (packet.retain) {
    console.log("📌 Mensagem recebida do RETAIN (armazenada no broker)");
  } else {
    console.log("📡 Mensagem recebida em tempo real");
  }
});