const amqp = require('amqplib');
const { RABBITMQ_URL } = process.env;

let channel;

async function connect() {
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
}

exports.publish = async (event, data) => {
  if (!channel) await connect();
  const exchange = 'room.events';

  await channel.assertExchange(exchange, 'topic', { durable: false });
  channel.publish(exchange, event, Buffer.from(JSON.stringify(data)));
};
