import db from '../config/db.js';

class UserSport {
    constructor(userSportData) {
        this.user_sport_id = userSportData.user_sport_id;
        this.user_id = userSportData.user_id;
        this.sport_id = userSportData.sport_id;
        this.skill_level = userSportData.skill_level;
        this.created_at = userSportData.created_at;
    }

    // Create user_sports table if it doesn't exist
    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS user_sports (
                user_sport_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                sport_id INT NOT NULL,
                skill_level ENUM('Beginner', 'Intermediate', 'Pro') NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_sport (user_id, sport_id),
                INDEX idx_user_id (user_id),
                INDEX idx_sport_id (sport_id)
            )
        `;

        try {
            await db.execute(createTableQuery);
            console.log('User Sports table created or already exists');
        } catch (error) {
            console.error('Error creating user_sports table:', error);
            throw error;
        }
    }

    // Add sport to user
    static async addUserSport(userSportData) {
        const { user_id, sport_id, skill_level } = userSportData;
        
        const insertQuery = `
            INSERT INTO user_sports (user_id, sport_id, skill_level)
            VALUES (?, ?, ?)
        `;

        try {
            const [result] = await db.execute(insertQuery, [user_id, sport_id, skill_level]);
            return result.insertId;
        } catch (error) {
            console.error('Error adding user sport:', error);
            throw error;
        }
    }

    // Get user sports by user ID
    static async getUserSports(userId) {
        const selectQuery = `
            SELECT us.*, s.sport_name, s.description as sport_description
            FROM user_sports us
            LEFT JOIN sports s ON us.sport_id = s.sport_id
            WHERE us.user_id = ?
            ORDER BY us.created_at DESC
        `;

        try {
            const [rows] = await db.execute(selectQuery, [userId]);
            return rows.map(row => new UserSport(row));
        } catch (error) {
            console.error('Error fetching user sports:', error);
            throw error;
        }
    }

    // Get users by sport ID
    static async getUsersBySport(sportId, skillLevel = null) {
        let selectQuery = `
            SELECT us.*, u.first_name, u.last_name, u.user_email, u.profile_image
            FROM user_sports us
            LEFT JOIN users u ON us.user_id = u.user_id
            WHERE us.sport_id = ?
        `;
        
        const params = [sportId];
        
        if (skillLevel) {
            selectQuery += ` AND us.skill_level = ?`;
            params.push(skillLevel);
        }
        
        selectQuery += ` ORDER BY us.created_at DESC`;

        try {
            const [rows] = await db.execute(selectQuery, params);
            return rows;
        } catch (error) {
            console.error('Error fetching users by sport:', error);
            throw error;
        }
    }

    // Update user sport skill level
    static async updateSkillLevel(userSportId, skillLevel) {
        const updateQuery = `
            UPDATE user_sports 
            SET skill_level = ?
            WHERE user_sport_id = ?
        `;

        try {
            const [result] = await db.execute(updateQuery, [skillLevel, userSportId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating skill level:', error);
            throw error;
        }
    }

    // Remove user sport
    static async removeUserSport(userSportId) {
        const deleteQuery = `
            DELETE FROM user_sports 
            WHERE user_sport_id = ?
        `;

        try {
            const [result] = await db.execute(deleteQuery, [userSportId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error removing user sport:', error);
            throw error;
        }
    }

    // Find user sport by user ID and sport ID
    static async findByUserAndSport(userId, sportId) {
        const selectQuery = `
            SELECT * FROM user_sports 
            WHERE user_id = ? AND sport_id = ?
        `;

        try {
            const [rows] = await db.execute(selectQuery, [userId, sportId]);
            return rows.length > 0 ? new UserSport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user sport:', error);
            throw error;
        }
    }

    // Get sport statistics
    static async getSportStats(sportId) {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN skill_level = 'Beginner' THEN 1 END) as beginners,
                COUNT(CASE WHEN skill_level = 'Intermediate' THEN 1 END) as intermediate,
                COUNT(CASE WHEN skill_level = 'Pro' THEN 1 END) as pros
            FROM user_sports 
            WHERE sport_id = ?
        `;

        try {
            const [rows] = await db.execute(statsQuery, [sportId]);
            return rows[0];
        } catch (error) {
            console.error('Error getting sport statistics:', error);
            throw error;
        }
    }
}

export default UserSport;