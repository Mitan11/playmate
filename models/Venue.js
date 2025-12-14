import db from '../config/db.js';

class Venue {
    constructor(data) {
        this.venue_id = data.venue_id;
        this.venue_owners_id = data.venue_owners_id;
        this.venue_name = data.venue_name;
        this.address = data.address;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venues (
                venue_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_owners_id INT NOT NULL,
                venue_name VARCHAR(100) NOT NULL,
                address VARCHAR(150) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (venue_owners_id) REFERENCES venue_owners(venue_owners_id) ON DELETE CASCADE,
                INDEX idx_venue_owner_id (venue_owners_id),
                INDEX idx_venue_name (venue_name)
            )
        `;
        try {

            await db.execute(query);
            console.log('Venues table created or already exists');
        } catch (error) {
            console.error('Error creating venues table:', error);
            throw error;
        }
    }

    static async save(data, conn = db) {
        const { venue_owners_id, venue_name, address } = data;
        const [result] = await conn.execute(
            'INSERT INTO venues (venue_owners_id, venue_name, address) VALUES (?, ?, ?)',
            [venue_owners_id, venue_name, address]
        );
        return await Venue.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venues WHERE venue_id = ?', [id]);
        return rows.length ? new Venue(rows[0]) : null;
    }

    static async listByOwner(ownerId, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venues WHERE venue_owners_id = ?', [ownerId]);
        return rows.map(r => new Venue(r));
    }
}

export default Venue;
