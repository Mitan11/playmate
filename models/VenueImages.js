import db from '../config/db.js';

class VenueImages {
    constructor(data) {
        this.venue_image_id = data.venue_image_id;
        this.venue_id = data.venue_id;
        this.image_url = data.image_url;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venue_images (
                venue_image_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_id INT NOT NULL,
                image_url VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_venue_image_venue
                    FOREIGN KEY (venue_id)
                    REFERENCES venues(venue_id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE,
                INDEX idx_venue_image_venue_id (venue_id)
            )
        `;
        try {
            await db.execute(query);
            console.log('Venue Images table created or already exists');
        } catch (error) {
            console.error('Error creating venue_images table:', error);
            throw error;
        }
    }

    static async create(data, conn = db) {
        const { venue_id, image_url } = data;
        const [result] = await conn.execute(
            'INSERT INTO venue_images (venue_id, image_url) VALUES (?, ?)',
            [venue_id, image_url]
        );
        return await VenueImages.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute(
            'SELECT * FROM venue_images WHERE venue_image_id = ?',
            [id]
        );
        if (rows.length === 0) return null;
        return new VenueImages(rows[0]);
    }

    static async findByVenueId(venue_id, conn = db) {
        const [rows] = await conn.execute(
            'SELECT * FROM venue_images WHERE venue_id = ? ORDER BY created_at DESC',
            [venue_id]
        );
        return rows.map(row => new VenueImages(row));
    }

    static async getAll(conn = db) {
        const [rows] = await conn.execute(
            'SELECT * FROM venue_images ORDER BY venue_id, created_at DESC'
        );
        return rows.map(row => new VenueImages(row));
    }

    static async update(id, data, conn = db) {
        const fields = [];
        const params = [];
        
        if (data.image_url !== undefined) {
            fields.push('image_url = ?');
            params.push(data.image_url);
        }
        
        if (!fields.length) return false;
        
        params.push(id);
        const [res] = await conn.execute(
            `UPDATE venue_images SET ${fields.join(', ')} WHERE venue_image_id = ?`,
            params
        );
        return res.affectedRows > 0;
    }

    static async delete(id, conn = db) {
        const [res] = await conn.execute(
            'DELETE FROM venue_images WHERE venue_image_id = ?',
            [id]
        );
        return res.affectedRows > 0;
    }

}

export default VenueImages;
