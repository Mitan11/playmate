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
const routes = ['./app.js', './routes/authRouter.js', './routes/sportRouter.js', './routes/userRouter.js', './routes/venueRouter.js'];

swaggerAutogen()(outputFile, routes, doc);
