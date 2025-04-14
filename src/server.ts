import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios'; // No need to import AxiosError
import videoRoutes from './routes/video.routes';
import { connectDB } from './config/mongo';
import { registerJobProcessors } from './jobs';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { videoUploadQueue } from './config/queue';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '8085', 10);

// Bull Board Setup
const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [new BullAdapter(videoUploadQueue)],
  serverAdapter,
});
serverAdapter.setBasePath('/admin/queues');

// Middleware
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.use('/admin/queues', serverAdapter.getRouter());

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();
registerJobProcessors();

// Health Check Endpoint for Consul
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start Server & Register with Consul
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs at http://localhost:${PORT}/api-docs`);

  const serviceId = 'video-processing-service';

  const serviceDefinition = {
    ID: serviceId,
    Name: 'video-ingestion-service',
    Address: 'host.docker.internal', // replace with container IP or host if needed
    Port: PORT,
    Check: {
      HTTP: `http://host.docker.internal:${PORT}/health`,
      Interval: '10s',
      Timeout: '1s',
      DeregisterCriticalServiceAfter: '1m'
    }
  };

  axios.put('http://localhost:8500/v1/agent/service/register', serviceDefinition)
    .then(() => console.log('✅ Registered with Consul'))
    .catch((err: unknown) => {
      if ((err as { isAxiosError: boolean }).isAxiosError) { // Type assertion for Axios error check
        console.error('❌ Consul registration failed:', (err as { message: string }).message);
      } else {
        console.error('❌ Unknown error during Consul registration:', err);
      }
    });

  // Deregister on shutdown
  process.on('SIGINT', async () => {
    try {
      await axios.put(`http://localhost:8500/v1/agent/service/deregister/${serviceId}`);
      console.log('🛑 Deregistered from Consul');
    } catch (err: unknown) {
      console.error('❌ Error during Consul deregistration:', err);
    } finally {
      process.exit();
    }
  });
});
