import db from '../config/db.js';

class User {
    constructor(userData) {
        this.user_id = userData.user_id;
        this.user_email = userData.user_email;
        this.user_password = userData.user_password;
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.profile_image = userData.profile_image;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
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
                updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
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
}

export default User;