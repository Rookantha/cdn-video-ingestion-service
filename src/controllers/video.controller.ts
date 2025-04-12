import { Request, Response } from 'express';
import { videoUploadQueue } from '../config/queue';

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const file = req.file!;
    const { title, duration, resolution } = req.body;

    // Add video upload to the Bull queue
    await videoUploadQueue.add({
      filePath: file.path,
      fileName: file.originalname,
      mimetype: file.mimetype,
      metadata: {
        title,
        duration,
        resolution,
      },
    });

    res.status(202).json({ message: 'Video upload job enqueued!' });
  } catch (err) {
    console.error('Queue error:', err);
    res.status(500).json({ error: 'Failed to enqueue video upload job' });
  }
};
