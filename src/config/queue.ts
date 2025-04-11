import Bull from 'bull';
import dotenv from 'dotenv';

dotenv.config();

// Redis connection configuration for Bull queue
export const videoUploadQueue = new Bull('video-upload-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
