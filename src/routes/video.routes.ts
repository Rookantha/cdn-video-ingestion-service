import express from 'express';
import multer from 'multer';
import { uploadVideo } from '../controllers/video.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video upload and management
 */

/**
 * @swagger
 * /api/videos/upload:
 *   post:
 *     summary: Upload a video
 *     tags: [Videos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('video'), uploadVideo);

export default router;
