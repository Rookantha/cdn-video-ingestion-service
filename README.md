# Video Upload and Processing Service

This service provides an API endpoint for uploading videos, which are then processed in the background using Bull queues, stored on AWS S3, and their metadata saved to MongoDB. It also publishes an event to Kafka upon successful upload. A web-based UI for monitoring the Bull queue is available, and API documentation is generated using Swagger.

## Features

* **Video Upload:** Accepts video files via a multipart form.
* **Background Processing:** Utilizes Bull queues to handle video uploads asynchronously.
* **AWS S3 Storage:** Stores uploaded videos securely on AWS S3.
* **MongoDB Integration:** Saves video metadata (title, description, S3 URL, etc.) in MongoDB.
* **Kafka Integration:** Publishes a `VIDEO_UPLOADED` event to a Kafka topic after successful processing.
* **Queue Monitoring:** Provides a web interface using Bull Board to monitor the status of video upload jobs.
* **API Documentation:** Generates interactive API documentation using Swagger.

## Technologies Used

* **Node.js:** JavaScript runtime environment.
* **Express:** Web application framework for Node.js.
* **dotenv:** Loads environment variables from a `.env` file.
* **Bull:** Robust queue system backed by Redis for handling background jobs.
* **@bull-board/express & @bull-board/api:** Provides a web UI for monitoring Bull queues.
* **mongoose:** Elegant MongoDB object modeling for Node.js.
* **aws-sdk:** AWS SDK for JavaScript to interact with S3.
* **kafkajs:** A modern Apache Kafka client for Node.js.
* **multer:** Middleware for handling `multipart/form-data`.
* **swagger-ui-express & swagger-ui:** Serves and generates Swagger UI for API documentation.
* **nodemon:** Utility that automatically restarts the node application when file changes are detected during development.

## Prerequisites

Before running the service, ensure you have the following installed and configured:

* **Node.js:** (version >= 16 recommended)
* **npm** or **yarn:** Package managers for Node.js.
* **MongoDB:** Running instance of MongoDB.
* **Redis:** Running instance of Redis (required by Bull).
* **AWS Account:** AWS account with configured credentials and an S3 bucket.
* **Kafka:** Running instance of Kafka.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the root directory and add the following environment variables:

    ```env
    PORT=8085
    MONGO_URI=<your-mongodb-connection-string>
    REDIS_HOST=<your-redis-host>
    REDIS_PORT=<your-redis-port>
    AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
    AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
    AWS_REGION=<your-aws-region>
    S3_BUCKET_NAME=<your-s3-bucket-name>
    KAFKA_BROKERS=<your-kafka-broker-list> (e.g., kafka1:9092,kafka2:9092)
    KAFKA_CLIENT_ID=<your-kafka-client-id>
    KAFKA_TOPIC=content-transcoded # Default topic, can be changed
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

## API Endpoints

### `POST /api/videos/upload`

* **Description:** Uploads a video file.
* **Request Body:** `multipart/form-data` containing the video file (`video` field) and optional metadata fields (`title`, `description`, `duration`, `resolution`).
* **Response:**
    * `202 Accepted`: Video upload job successfully enqueued.
    * `500 Internal Server Error`: Failed to enqueue video upload job.

    ```
    curl -X POST -F "video=@/path/to/your/video.mp4" -F "title=My Video" -F "description=A sample video" http://localhost:8085/api/videos/upload
    ```

## Queue Monitoring

A web-based UI for monitoring the Bull queue is available at `/admin/queues`. Navigate to `http://localhost:8085/admin/queues` in your browser to view the status of video upload jobs.

## API Documentation

Interactive API documentation is available using Swagger UI at `/api-docs`. Navigate to `http://localhost:8085/api-docs` in your browser to explore the API endpoints and schemas.

## Job Processing

The `videoUploadProcessor` function in `./jobs/video.processor.ts` handles the background processing of video uploads. It performs the following steps:

1.  Reads the video file from the temporary path.
2.  Uploads the video to AWS S3.
3.  Deletes the temporary local file.
4.  Saves the video metadata (including the S3 URL) to MongoDB.
5.  Publishes a `VIDEO_UPLOADED` event to the configured Kafka topic.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any bugs or feature requests.

## License

[MIT](LICENSE)
