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
            await this.insertDefaultSports();
        } catch (error) {
            console.error('Error creating sports table:', error);
            throw error;
        }
    }

    // Insert default sports
    static async insertDefaultSports() {
        try {
            const [rows] = await db.execute('SELECT COUNT(*) as count FROM sports');
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
    static async getAllSports() {
        const selectQuery = `
            SELECT * FROM sports 
            ORDER BY sport_name ASC
        `;

        try {
            const [rows] = await db.execute(selectQuery);
            return rows.map(row => new Sport(row));
        } catch (error) {
            console.error('Error fetching all sports:', error);
            throw error;
        }
    }

    // Get sport by ID
    static async findById(sportId) {
        const selectQuery = `
            SELECT * FROM sports 
            WHERE sport_id = ?
        `;

        try {
            const [rows] = await db.execute(selectQuery, [sportId]);
            return rows.length > 0 ? new Sport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding sport by ID:', error);
            throw error;
        }
    }

    // Get sports by category
    static async getByCategory(category) {
        const selectQuery = `
            SELECT * FROM sports 
            WHERE sport_name LIKE ?
            ORDER BY sport_name ASC
        `;

        try {
            const [rows] = await db.execute(selectQuery, [`%${category}%`]);
            return rows.map(row => new Sport(row));
        } catch (error) {
            console.error('Error fetching sports by category:', error);
            throw error;
        }
    }

    // Add new sport
    static async addSport(sportName) {
        const insertQuery = `
            INSERT INTO sports (sport_name) 
            VALUES (?)
        `;

        try {
            const [result] = await db.execute(insertQuery, [sportName]);
            return result.insertId;
        } catch (error) {
            console.error('Error adding sport:', error);
            throw error;
        }
    }

    // Find sport by name
    static async findByName(sportName) {
        const selectQuery = `
            SELECT * FROM sports 
            WHERE sport_name = ?
        `;

        try {
            const [rows] = await db.execute(selectQuery, [sportName]);
            return rows.length > 0 ? new Sport(rows[0]) : null;
        } catch (error) {
            console.error('Error finding sport by name:', error);
            throw error;
        }
    }
}

export default Sport;