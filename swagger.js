import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'PlayMate API',
        description: 'API documentation for PlayMate application'
    },
    host: 'localhost:4000',
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Enter your bearer token in the format: Bearer <token>'
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen()(outputFile, routes, doc);
