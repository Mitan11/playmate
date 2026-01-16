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
                
                CONSTRAINT fk_user_sports_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                
                CONSTRAINT fk_user_sports_sport
                    FOREIGN KEY (sport_id)
                    REFERENCES sports(sport_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                
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
    static async addUserSport(userSportData, conn = db) {
        const { user_id, sport_id, skill_level } = userSportData;

        const insertQuery = `
            INSERT INTO user_sports (user_id, sport_id, skill_level)
            VALUES (?, ?, ?)
        `;

        try {
            const [result] = await conn.execute(insertQuery, [user_id, sport_id, skill_level]);
            return result.insertId;
        } catch (error) {
            console.error('Error adding user sport:', error);
            throw error;
        }
    }

    static async getUserSports(userId, conn = db) {
        const selectQuery = `
        SELECT 
            u.user_id,
            u.first_name,
            u.last_name,
            u.user_email,
            u.profile_image,
            s.sport_id,
            s.sport_name,
            us.skill_level
        FROM user_sports us
        JOIN users u ON us.user_id = u.user_id
        JOIN sports s ON us.sport_id = s.sport_id
        WHERE us.user_id = ?;
    `;

        try {
            const [rows] = await conn.execute(selectQuery, [userId]);

            if (rows.length === 0) return null;

            // Prepare response
            return {
                user_id: rows[0].user_id,
                first_name: rows[0].first_name,
                last_name: rows[0].last_name,
                user_email: rows[0].user_email,
                profile_image: rows[0].profile_image,
                sports: rows.map(r => ({
                    sport_id: r.sport_id,
                    sport_name: r.sport_name,
                    skill_level: r.skill_level,
                }))
            };

        } catch (error) {
            console.error("Error fetching user sports:", error);
            throw error;
        }
    }


    // Get users by sport ID
    static async getUsersBySport(sportId, skillLevel = null, conn = db) {
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
            const [rows] = await conn.execute(selectQuery, params);
            return rows;
        } catch (error) {
            console.error('Error fetching users by sport:', error);
            throw error;
        }
    }

    // Update user sport skill level
    static async updateSkillLevel(userSportId, skillLevel, conn = db) {
        const updateQuery = `
            UPDATE user_sports 
            SET skill_level = ?
            WHERE user_sport_id = ?
        `;

        try {
            const [result] = await conn.execute(updateQuery, [skillLevel, userSportId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating skill level:', error);
            throw error;
        }
    }

    // Remove user sport
    static async removeUserSport(userId, sportId, conn = db) {
        const deleteQuery = `
            DELETE FROM user_sports 
            WHERE user_id = ? AND sport_id = ?
        `;

        try {
            const [result] = await conn.execute(deleteQuery, [userId, sportId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error removing user sport:', error);
            throw error;
        }
    }

    // Find user sport by user ID and sport ID
    static async findByUserAndSport(userId, sportId, conn = db) {
        const selectQuery = `
            SELECT * FROM user_sports 
            WHERE user_id = ? AND sport_id = ?
        `;

        try {
            const [rows] = await conn.execute(selectQuery, [userId, sportId]);
            return rows.length > 0 ? new UserSport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user sport:', error);
            throw error;
        }
    }

    // Get sport statistics
    static async getSportStats(sportId, conn = db) {
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
            const [rows] = await conn.execute(statsQuery, [sportId]);
            return rows[0];
        } catch (error) {
            console.error('Error getting sport statistics:', error);
            throw error;
        }
    }
}

export default UserSport;