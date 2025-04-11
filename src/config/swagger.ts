import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Upload API',
      version: '1.0.0',
      description: 'API for uploading videos to S3 and storing metadata',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Adjust to your folder structure
};

export const swaggerSpec = swaggerJSDoc(options);
