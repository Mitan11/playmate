import db from '../config/db.js';

class Sport {
    constructor(sportData) {
        this.sport_id = sportData.sport_id;
        this.sport_name = sportData.sport_name;
        this.created_at = sportData.created_at;
    }

    // Create sports table if it doesn't exist
    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS sports (
                sport_id INT AUTO_INCREMENT PRIMARY KEY,
                sport_name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_sport_name (sport_name)
            )
        `;

        try {
            await db.execute(createTableQuery);
            console.log('Sports table created or already exists');

            // Insert some default sports if table is empty
            // await this.insertDefaultSports();
        } catch (error) {
            console.error('Error creating sports table:', error);
            throw error;
        }
    }

    // Insert default sports
    static async insertDefaultSports(conn = db) {
        try {
            const [rows] = await conn.execute('SELECT COUNT(*) as count FROM sports');
            if (rows[0].count === 0) {
                const defaultSports = [
                    ['Cricket'],
                    ['Pickleball'],
                ];

                const insertQuery = `
                    INSERT INTO sports (sport_name) 
                    VALUES ?
                `;

                await db.execute(insertQuery, [defaultSports]);
                console.log('Default sports inserted successfully');
            }
        } catch (error) {
            console.error('Error inserting default sports:', error);
        }
    }

    // Get all sports
    static async getAllSports(conn = db) {
        const selectQuery = `
            SELECT * FROM sports 
            ORDER BY sport_name ASC
        `;

        try {
            const [rows] = await conn.execute(selectQuery);
            return rows.map(row => new Sport(row));
        } catch (error) {
            console.error('Error fetching all sports:', error);
            throw error;
        }
    }


    // Add new sport
    static async addSport(sportName, conn = db) {
        const insertQuery = `
            INSERT INTO sports (sport_name) 
            VALUES (?)
        `;

        try {
            const [result] = await conn.execute(insertQuery, [sportName]);
            return await this.findById(result.insertId);
        } catch (error) {
            console.error('Error adding sport:', error);
            throw error;
        }
    }

    // Find sport by ID - FIXED: Made static
    static async findById(sportId, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT sport_id, sport_name, created_at FROM sports WHERE sport_id = ?',
                [sportId]
            );
            return rows.length > 0 ? new Sport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding sport by ID:', error);
            throw error;
        }
    }

    // Find sport by name
    static async findByName(sportName, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT sport_id, sport_name, created_at FROM sports WHERE sport_name = ?',
                [sportName]
            );
            return rows.length > 0 ? new Sport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding sport by name:', error);
            throw error;
        }
    }

    // Update sport
    static async updateSport(sportId, sportName, conn = db) {
        const updateQuery = `
            UPDATE sports 
            SET sport_name = ? 
            WHERE sport_id = ?
        `;

        try {
            const [result] = await conn.execute(updateQuery, [sportName, sportId]);

            if (result.affectedRows === 0) {
                return null; // Sport not found
            }

            return await this.findById(sportId, conn);
        } catch (error) {
            console.error('Error updating sport:', error);
            throw error;
        }
    }

    // Delete sport
    static async deleteSport(sportId, conn = db) {
        const deleteQuery = `
            DELETE FROM sports 
            WHERE sport_id = ?
        `;

        try {
            const [result] = await conn.execute(deleteQuery, [sportId]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting sport:', error);
            throw error;
        }
    }

    // Get sports count
    static async getSportsCount(conn = db) {
        try {
            const [rows] = await conn.execute('SELECT COUNT(*) as count FROM sports');
            return rows[0].count;
        } catch (error) {
            console.error('Error getting sports count:', error);
            throw error;
        }
    }
}

export default Sport;