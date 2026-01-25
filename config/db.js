import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    // Provider cap is 5 concurrent connections; keep pool below that to avoid ER_USER_LIMIT_REACHED
    connectionLimit: 3,
    queueLimit: 0
};

// Create connection pool
const db = mysql.createPool(dbConfig);

export default db;