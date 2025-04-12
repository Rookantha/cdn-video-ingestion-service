import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  s3Url: String,
  duration: String,
  resolution: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Video', videoSchema);
