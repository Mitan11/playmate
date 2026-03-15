import mysql from 'mysql2/promise';
import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({ region: 'eu-north-1' });

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,

    waitForConnections: true,
    connectionLimit: 3, // keep below provider limit
    queueLimit: 0,

    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./global-bundle.pem')
    }
};

// Create connection pool
const db = mysql.createPool(dbConfig);

export default db;