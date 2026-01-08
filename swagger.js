import swaggerAutogen from 'swagger-autogen';

const isProduction = process.env.NODE_ENV === 'production';

const doc = {
    info: {
        title: 'PlayMate API',
        description: 'API documentation for PlayMate application'
    },
    host: isProduction ? 'playmate-taupe.vercel.app' : 'localhost:3000',
    schemes: isProduction ? ['https'] : ['http'],
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
