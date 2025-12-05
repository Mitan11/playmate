import db from '../config/db.js';

class User {
    constructor(userData) {
        this.user_id = userData.user_id;
        this.user_email = userData.user_email;
        this.user_password = userData.user_password;
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.profile_image = userData.profile_image;
    }

    // Create users table if it doesn't exist
    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(100) NOT NULL UNIQUE,
                user_password VARCHAR(61) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NULL,
                profile_image VARCHAR(165) NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_email (user_email)
            )
        `;

        try {
            await db.execute(createTableQuery);
            console.log('Users table created or already exists');
        } catch (error) {
            console.error('Error creating users table:', error);
            throw error;
        }
    }

    // Check if user exists by email
    static async findByEmail(email, conn = db) {
        try {
            const query = 'SELECT * FROM users WHERE user_email = ?';
            const params = [email];

            const [rows] = await conn.execute(query, params);

            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Save new user to database
    static async save(userData, conn = db) {
        const { user_email, user_password, first_name, last_name, profile_image } = userData;

        try {
            const query = `INSERT INTO users (user_email, user_password, first_name, last_name, profile_image) VALUES (?, ?, ?, ?, ?)`;
            const params = [user_email, user_password, first_name, last_name, profile_image];

            // Insert user into database
            const [result] = await conn.execute(
                query,
                params
            );

            // Return the created user
            return await User.findById(result.insertId, conn);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findById(userId, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT user_id, user_email, first_name, last_name, profile_image FROM users WHERE user_id = ?',
                [userId]
            );
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

}

export default User;