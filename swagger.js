import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'PlayMate API',
        description: 'API documentation for PlayMate application'
    },
    host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js', './routes/authRouter.js', './routes/sportRouter.js', './routes/userRouter.js'];

swaggerAutogen()(outputFile, routes, doc);
