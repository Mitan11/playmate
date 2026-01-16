import db from '../config/db.js';

class VenueSportCourt {
    constructor(data) {
        this.court_id = data.court_id;
        this.venue_sport_id = data.venue_sport_id;
        this.court_name = data.court_name;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venue_sport_courts (
                court_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_sport_id INT NOT NULL,
                court_name VARCHAR(50) NOT NULL,
                
                CONSTRAINT fk_vsc_venue_sport
                    FOREIGN KEY (venue_sport_id)
                    REFERENCES venue_sports(venue_sport_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                
                UNIQUE KEY unique_court (venue_sport_id, court_name),
                INDEX idx_venue_sport_id (venue_sport_id)
            ) 
        `;
        try {

            await db.execute(query);
            console.log('Venue sport courts table created or already exists');
        }
        catch (error) {
            console.error('Error creating venue sport courts table:', error);
            throw error;
        }
    }

    static async save(data, conn = db) {
        const { venue_sport_id, court_name } = data;
        const [result] = await conn.execute(
            'INSERT INTO venue_sport_courts (venue_sport_id, court_name) VALUES (?, ?)',
            [venue_sport_id, court_name]
        );
        return await VenueSportCourt.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sport_courts WHERE court_id = ?', [id]);
        return rows.length ? new VenueSportCourt(rows[0]) : null;
    }

    static async listByVenueSport(venueSportId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_sport_courts WHERE venue_sport_id = ?', [venueSportId]);
        return rows.map(r => new VenueSportCourt(r));
    }
}

export default VenueSportCourt;
