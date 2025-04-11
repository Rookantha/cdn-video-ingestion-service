import express from 'express';
import dotenv from 'dotenv';
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
const PORT = process.env.PORT || 8085;

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

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
