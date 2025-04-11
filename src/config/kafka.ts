import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

export const kafka = new Kafka({
  clientId: 'video-service',
  brokers: [process.env.KAFKA_BROKER!],
});

export const producer = kafka.producer();
