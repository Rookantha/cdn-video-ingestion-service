import { videoUploadQueue } from '../config/queue';
import { videoUploadProcessor } from '../services/videoUpload.processor';

export const registerJobProcessors = () => {
  videoUploadQueue.process(videoUploadProcessor);
};
