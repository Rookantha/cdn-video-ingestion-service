import { s3 } from '../config/aws';
import fs from 'fs';

export const uploadToS3 = async (file: Express.Multer.File) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadResult = await s3.upload({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${Date.now()}-${file.originalname}`,
    Body: fileStream,
    ContentType: file.mimetype,
  }).promise();

  fs.unlinkSync(file.path); // remove temp file
  return uploadResult.Location;
};
