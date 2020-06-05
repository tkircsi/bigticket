import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('bigticket', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log(`Publisher #${clientId} connected to NATS.`);

  stan.on('close', () => {
    console.log(`Publisher #${clientId} NATS connection closed`);
    process.exit();
  });

  const data = JSON.stringify({
    id: '123',
    title: 'Big Concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published.');
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
