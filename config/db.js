import mysql from 'mysql2/promise';
import AWS from 'aws-sdk';

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

    ssl: process.env.DB_SSL_CA ? {
        rejectUnauthorized: false,
        ca: Buffer.from(process.env.DB_SSL_CA, 'utf-8')
    } : undefined
};

// Create connection pool
const db = mysql.createPool(dbConfig);

export default db;