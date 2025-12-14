import db from '../config/db.js';

class VenueSport {
    constructor(data) {
        this.venue_sport_id = data.venue_sport_id;
        this.venue_id = data.venue_id;
        this.sport_id = data.sport_id;
        this.price_per_hour = data.price_per_hour;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venue_sports (
                venue_sport_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_id INT NOT NULL,
                sport_id INT NOT NULL,
                price_per_hour DECIMAL(10,2) NOT NULL CHECK (price_per_hour >= 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE,
                FOREIGN KEY (sport_id) REFERENCES sports(sport_id) ON DELETE CASCADE,
                UNIQUE KEY unique_venue_sport (venue_id, sport_id),
                INDEX idx_venue_id (venue_id),
                INDEX idx_sport_id (sport_id)
            )
        `;
        try {
            await db.execute(query);
            console.log('Venue sports table created or already exists');
        } catch (error) {
            console.error('Error creating venue sports table:', error);
            throw error;
        }
    }

    static async save(data, conn = db) {
        const { venue_id, sport_id, price_per_hour } = data;
        const [result] = await conn.execute(
            'INSERT INTO venue_sports (venue_id, sport_id, price_per_hour) VALUES (?, ?, ?)',
            [venue_id, sport_id, price_per_hour]
        );
        return await VenueSport.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE venue_sport_id = ?', [id]);
        return rows.length ? new VenueSport(rows[0]) : null;
    }

    static async listByVenue(venueId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE venue_id = ?', [venueId]);
        return rows.map(r => new VenueSport(r));
    }
}

export default VenueSport;
