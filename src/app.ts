import express from 'express';
import dotenv from 'dotenv';
import videoRoutes from './routes/video.routes'

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/videos', videoRoutes);


export default app;
