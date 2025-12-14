import db from '../config/db.js';

class VenueOwner {
    constructor(data) {
        this.venue_owners_id = data.venue_owners_id;
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.phone = data.phone;
        this.profile_image = data.profile_image;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venue_owners (
                venue_owners_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(61) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NULL,
                phone VARCHAR(20) NOT NULL,
                profile_image VARCHAR(160) DEFAULT 'https://xyz.com/avatar.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_venue_owner_email (email)
            )
        `;
        try {
            await db.execute(query);
            console.log('Venue owners table created or already exists');
        } catch (error) {
            console.error('Error creating venue owners table:', error);
            throw error;
        }
    }

    static async findByEmail(email, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_owners WHERE email = ?', [email]);
        return rows.length ? new VenueOwner(rows[0]) : null;
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venue_owners WHERE venue_owners_id = ?', [id]);
        return rows.length ? new VenueOwner(rows[0]) : null;
    }

    static async save(data, conn = db) {
        const { email, password, first_name, last_name, phone, profile_image } = data;
        const [result] = await conn.execute(
            'INSERT INTO venue_owners (email, password, first_name, last_name, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, phone, profile_image]
        );
        return await VenueOwner.findById(result.insertId, conn);
    }

    static async updateProfile(id, updates, conn = db) {
        const fields = [];
        const params = [];
        if (updates.first_name !== undefined) { fields.push('first_name = ?'); params.push(updates.first_name); }
        if (updates.last_name !== undefined) { fields.push('last_name = ?'); params.push(updates.last_name); }
        if (updates.phone !== undefined) { fields.push('phone = ?'); params.push(updates.phone); }
        if (updates.profile_image !== undefined) { fields.push('profile_image = ?'); params.push(updates.profile_image); }
        if (!fields.length) return false;
        params.push(id);
        const [res] = await conn.execute(`UPDATE venue_owners SET ${fields.join(', ')} WHERE venue_owners_id = ?`, params);
        return res.affectedRows > 0;
    }
}

export default VenueOwner;
