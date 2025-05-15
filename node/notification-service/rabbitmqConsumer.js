const amqp = require('amqplib');
const Notification = require('./models/Notification');

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'room.bookings';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    // Créer une queue temporaire pour écouter les événements liés à booking created et canceled
    const q = await channel.assertQueue('', { exclusive: true });

    // Bind pour écouter uniquement les événements spécifiques
    await channel.bindQueue(q.queue, exchange, 'room.booking.created');
    await channel.bindQueue(q.queue, exchange, 'room.booking.canceled');

    console.log('🐇 En attente des messages RabbitMQ...');

    channel.consume(q.queue, async (msg) => {
      if (msg !== null) {
        const routingKey = msg.fields.routingKey;
        const content = msg.content.toString();
        console.log(`🐇 Message reçu: ${routingKey} -> ${content}`);

        if (routingKey === 'room.booking.created') {
          // Ajouter notification création réservation
          await Notification.create({
            type: routingKey,
            message: `Nouvelle réservation : ${content}`
          });
        } else if (routingKey === 'room.booking.canceled') {
          // Ajouter notification annulation réservation
          await Notification.create({
            type: routingKey,
            message: `Réservation annulée : ${content}`
          });
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('❌ Erreur RabbitMQ:', error);
  }
}

module.exports = startConsumer;
