import db from '../config/db.js';

class VenueSport {
    constructor(data) {
        this.venue_sport_id = data.venue_sport_id;
        this.venue_id = data.venue_id;
        this.sport_id = data.sport_id;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venue_sports (
                venue_sport_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_id INT NOT NULL,
                sport_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                CONSTRAINT fk_vs_venue
                    FOREIGN KEY (venue_id)
                    REFERENCES venues(venue_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                
                CONSTRAINT fk_vs_sport
                    FOREIGN KEY (sport_id)
                    REFERENCES sports(sport_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                
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
        const { venue_id, sport_id } = data;
        const [result] = await conn.execute(
            'INSERT INTO venue_sports (venue_id, sport_id) VALUES (?, ?)',
            [venue_id, sport_id]
        );
        return await VenueSport.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE venue_sport_id = ?', [id]);
        return rows.length ? new VenueSport(rows[0]) : null;
    }

    static async findBySportId(id, venueSportId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE sport_id = ? AND venue_sport_id != ?', [id, venueSportId]);
        return rows.length ? new VenueSport(rows[0]) : null;
    }

    static async existsForVenue(venueId, sportId, excludeVenueSportId, conn = db) {
        const [rows] = await conn.execute(
            'SELECT 1 FROM venue_sports WHERE venue_id = ? AND sport_id = ? AND venue_sport_id != ?',
            [venueId, sportId, excludeVenueSportId]
        );
        return rows.length > 0;
    }

    static async listByVenue(venueId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE venue_id = ?', [venueId]);
        return rows.map(r => new VenueSport(r));
    }

    static async getVenueSports(venueId, conn = db) {
        const [rows] = await conn.execute(
            `SELECT 
	            vs.venue_sport_id,
                s.sport_id,
                s.sport_name,
                vs.created_at
                FROM venue_sports vs
                JOIN sports s ON vs.sport_id = s.sport_id
                WHERE vs.venue_id = ?`, [venueId]);
        return rows;
    }

    static async listByVenue(venueId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sports WHERE venue_id = ?', [venueId]);
        return rows
    }

    static async deleteById(id, conn = db) {
        const [result] = await conn.execute('DELETE FROM venue_sports WHERE venue_sport_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async updateById(id, sport_id, conn = db) {
        const query = `UPDATE venue_sports SET sport_id = ? WHERE venue_sport_id = ?`;
        await conn.execute(query, [sport_id, id]);
        return await VenueSport.findById(id, conn);
    }

    static async exists(venueId, sportId, conn = db) {
        const [rows] = await conn.execute(
            'SELECT 1 FROM venue_sports WHERE venue_id = ? AND sport_id = ?',
            [venueId, sportId]
        );
        return rows.length > 0;
    }

}

export default VenueSport;
