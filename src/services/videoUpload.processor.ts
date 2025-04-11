import { Job } from 'bull';
import fs from 'fs';
import { s3 } from '../config/aws';
import { producer } from '../config/kafka';
import Video from '../models/video.model';

interface VideoJobData {
  filePath: string;
  fileName: string;
  mimetype: string;
  metadata: {
    title: string;
    description: string;
    duration: string;
    resolution: string;
  };
}

export const videoUploadProcessor = async (job: Job<VideoJobData>) => {
  try {
    const { filePath, fileName, mimetype, metadata } = job.data;

    // Upload to S3
    const fileStream = fs.createReadStream(filePath);
    const uploadResult = await s3.upload({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${Date.now()}-${fileName}`,
      Body: fileStream,
      ContentType: mimetype,
    }).promise();

    fs.unlinkSync(filePath); // Remove temp file

    // Save video metadata to MongoDB
    const videoData = {
      ...metadata,
      s3Url: uploadResult.Location,
    };

    const video = new Video(videoData);
    await video.save();

    // Send Kafka event
    await producer.connect();
    await producer.send({
      topic: process.env.KAFKA_TOPIC || 'content-transcoded',
      messages: [
        {
          value: JSON.stringify({
            event: 'VIDEO_UPLOADED',
            videoId: video._id,
            title: video.title,
            s3Url: video.s3Url,
          }),
        },
      ],
    });

    console.log('✅ Job done:', video._id);
    return video;
  } catch (error) {
    console.error('❌ Job failed:', error);
    throw error;
  }
};
