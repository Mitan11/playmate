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
    queueLimit: 0,
};
// Use a cached pool instance in serverless environments like Vercel
// so we don't create a new pool (and exhaust connections) on every cold start.
let cachedPool = globalThis._playmateDbPool;

if (!cachedPool) {
    cachedPool = mysql.createPool(dbConfig);
    globalThis._playmateDbPool = cachedPool;
}

// Convenience helper that returns only the rows for simple read/write queries.
// Usage:
//   const users = await query('SELECT * FROM users WHERE email = ?', [email]);
export async function query(sql, params = []) {
    const [rows] = await cachedPool.query(sql, params);
    return rows;
}

// Helper to get a dedicated connection for transactions.
// This keeps compatibility with existing `const connection = await db.getConnection();`
// patterns in your controllers.
export function getConnection() {
    return cachedPool.getConnection();
}

// Default export remains the pool for backward compatibility:
// - db.query(...)
// - db.execute(...)
// - db.getConnection()
export default cachedPool;