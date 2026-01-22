import db from '../config/db.js';

class Games {
    constructor(gameData) {
        this.game_id = gameData.game_id;
        this.sport_id = gameData.sport_id;
        this.venue_id = gameData.venue_id;
        this.start_datetime = gameData.start_datetime;
        this.end_datetime = gameData.end_datetime;
        this.host_user_id = gameData.host_user_id;
        this.price_per_hour = gameData.price_per_hour;
        this.status = gameData.status;
        this.created_at = gameData.created_at;
    }

    // Create games table if it doesn't exist
    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS games (
                game_id INT AUTO_INCREMENT PRIMARY KEY,
                sport_id INT NOT NULL,
                venue_id INT NOT NULL,
                start_datetime DATETIME NOT NULL,
                end_datetime DATETIME NOT NULL,
                host_user_id INT NOT NULL,
                price_per_hour DECIMAL(10,2) NOT NULL,
                status VARCHAR(45) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_game_sport FOREIGN KEY (sport_id)
                    REFERENCES sports(sport_id)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT fk_game_venue FOREIGN KEY (venue_id)
                    REFERENCES venues(venue_id)
                    ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT fk_game_host FOREIGN KEY (host_user_id)
                    REFERENCES users(user_id)
                    ON DELETE CASCADE ON UPDATE CASCADE
            )
        `;

        try {
            await db.execute(createTableQuery);
            console.log('Games table created or already exists');
        } catch (error) {
            console.error('Error creating games table:', error);
            throw error;
        }
    }

    // Save new game to database
    static async save(gameData, conn = db) {
        const { sport_id, venue_id, start_datetime, end_datetime, host_user_id, price_per_hour } = gameData;

        try {
            const query = `INSERT INTO games (sport_id, venue_id, start_datetime, end_datetime, host_user_id, price_per_hour) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [sport_id, venue_id, start_datetime, end_datetime, host_user_id, price_per_hour];

            const [result] = await conn.execute(query, params);

            return await Games.findById(result.insertId, conn);
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    }

    // Find game by ID
    static async findById(gameId, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT * FROM games WHERE game_id = ?',
                [gameId]
            );
            return rows.length > 0 ? new Games(rows[0]) : null;
        } catch (error) {
            console.error('Error finding game by ID:', error);
            throw error;
        }
    }

    // Deactivate game by ID
    static async deactivateById(id, conn = db) {
        try {
            const [result] = await conn.execute(
                `UPDATE games SET status = 'inactive' WHERE game_id = ?`,
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deactivating game:', error);
            throw error;
        }
    }

}

export default Games;
