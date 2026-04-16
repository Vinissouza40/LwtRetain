🎯 Objetivo
O objetivo deste trabalho é compreender e demonstrar na prática o funcionamento dos dois conceitos importantes no protocolo MQTT:
1. Last Will and Testament (LWT) 
2. Retain Flag

Além disso, o trabalho se concentrará em quando usar cada um e os impactos no sistema IoT real.

---

🔎 Explicações

1. Last Will and Testament (LWT)

O que é?  
O Last Will and Testament (LWT) é uma funcionalidade do MQTT que permite ao cliente registrar uma mensagem que será enviada automaticamente pelo broker caso o cliente desconecte de forma inesperada. Essa mensagem de "testamento" é configurada pelo cliente no momento de sua conexão, e se o cliente perder a conexão sem desconectar corretamente (ou seja, se ele ficar offline de forma inesperada), o broker envia essa mensagem em nome do cliente para o tópico especificado.

Quando usar?  
- Usar LWT quando precisar de um mecanismo para notificar outros dispositivos ou serviços sobre a desconexão inesperada de um cliente.
- Pode ser útil em sistemas críticos, onde é importante saber quando um dispositivo falha ou perde a conexão.

Exemplo de uso em IoT:
- Em um sistema de monitoramento remoto de dispositivos, o LWT pode ser usado para notificar se um dispositivo IoT como um sensor de temperatura ou dispositivo de segurança perde a conexão, permitindo a equipe técnica saber que o dispositivo precisa de atenção.

Impactos no Sistema IoT Real:  
- Segurança e monitoramento: O LWT permite uma comunicação mais robusta e garante que as falhas de comunicação não passem despercebidas.
- Desempenho: A configuração de LWT pode aumentar a carga no broker MQTT, pois ele precisa manter o estado de conexão de cada cliente e enviar mensagens de "last will" quando apropriado. No entanto, o impacto geralmente é mínimo para sistemas com baixo número de dispositivos.

2. Retain Flag

O que é?  
O Retain Flag (ou flag de retenção) é uma funcionalidade do MQTT que permite que uma mensagem publicada em um tópico seja retida pelo broker para que, quando um novo cliente se inscrever nesse tópico, ele receba a última mensagem publicada, mesmo que essa mensagem tenha sido publicada antes da inscrição do cliente.

Quando usar?  
- Usar Retain Flag quando for necessário garantir que novos clientes recebam o último estado de um tópico imediatamente após se inscreverem.
- Ideal para tópicos que representam estados que não mudam com frequência, como o status de um dispositivo (ligado/desligado), níveis de bateria ou dados de configuração.

Exemplo de uso em IoT:
- Em um sistema de automação residencial, você pode usar o Retain Flag para garantir que um dispositivo que acabou de se conectar ao broker MQTT saiba o estado atual de uma luz (se ela está ligada ou desligada), sem ter que esperar por uma nova mensagem.

Impactos no Sistema IoT Real:  
- Eficiência de comunicação: O Retain Flag economiza tempo, pois novos clientes não precisam esperar por uma nova atualização para saber o estado atual de um dispositivo ou serviço.
- Armazenamento no broker: Pode aumentar o uso de memória e armazenamento do broker, pois ele mantém a última mensagem publicada para cada tópico com o Retain Flag ativado.
- Consistência dos dados: Pode ser uma vantagem em sistemas onde o estado atual dos dispositivos é crucial, mas, em sistemas de tempo real que precisam de dados frescos, o Retain Flag pode ser indesejável.

---

🧑‍💻 Código de Demonstração

Exemplo com Last Will and Testament (LWT):

Aqui está um exemplo simples de código em Python utilizando a biblioteca paho-mqtt para demonstrar o uso do LWT:

```python
import paho.mqtt.client as mqtt

# Definindo as variáveis
broker = "broker.hivemq.com"
port = 1883
topic = "sensor/status"
lwt_message = "Dispositivo desconectado inesperadamente!"

# Função chamada quando o cliente conecta
def on_connect(client, userdata, flags, rc):
    print("Conectado com código: " + str(rc))
    client.subscribe("sensor/status")  # Se inscreve no tópico de status

# Função chamada quando uma mensagem é recebida
def on_message(client, userdata, msg):
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")

# Criando o cliente MQTT e configurando as opções
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Configurando o Last Will and Testament (LWT)
client.will_set(topic, lwt_message, qos=1, retain=True)

# Conectando ao broker
client.connect(broker, port, 60)

# Iniciando o loop do cliente MQTT
client.loop_start()
```

Exemplo com Retain Flag:

Agora, vamos demonstrar o uso do Retain Flag com o código abaixo:

```python
import paho.mqtt.client as mqtt

# Definindo as variáveis
broker = "broker.hivemq.com"
port = 1883
topic = "sensor/status"
message = "Status do sensor: Ativo"

# Função chamada quando o cliente conecta
def on_connect(client, userdata, flags, rc):
    print("Conectado com código: " + str(rc))
    client.subscribe(topic)  # Se inscreve no tópico de status

# Função chamada quando uma mensagem é recebida
def on_message(client, userdata, msg):
    print(f"Mensagem recebida no tópico {msg.topic}: {msg.payload.decode()}")

# Criando o cliente MQTT e configurando as opções
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Conectando ao broker
client.connect(broker, port, 60)

# Publicando uma mensagem com o Retain Flag
client.publish(topic, message, qos=1, retain=True)

# Iniciando o loop do cliente MQTT
client.loop_start()
```

---

📄 Conclusão e Impactos

**Last Will and Testament (LWT):**  
- Quando usar: Para notificar falhas de dispositivos em sistemas críticos.
- Impactos: Facilita a detecção de falhas inesperadas, mas pode aumentar a carga no broker e na rede.

**Retain Flag:**  
- Quando usar: Para garantir que os novos clientes recebam a última mensagem publicada sobre o estado de um tópico.
- Impactos: Aumenta a eficiência e reduz a sobrecarga de comunicação, mas pode aumentar o uso de armazenamento no broker e não é recomendado em sistemas com dados que precisam ser sempre atualizados.
