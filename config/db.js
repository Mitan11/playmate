import mysql from 'mysql2/promise';

const connectionLimit = process.env.VERCEL ? 1 : 3;

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    // Provider cap is 5 concurrent connections; keep pool below that to avoid ER_USER_LIMIT_REACHED
    connectionLimit,
    queueLimit: 0,
};

// Reuse pool across serverless invocations when possible
const globalForDb = globalThis;
const db = globalForDb._dbPool ?? mysql.createPool(dbConfig);

if (!globalForDb._dbPool) {
    globalForDb._dbPool = db;
}

export default db;