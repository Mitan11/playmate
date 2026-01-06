import db from '../config/db.js';

class Venue {
    constructor(data) {
        this.venue_id = data.venue_id;
        this.email = data.email;
        this.password = data.password;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.phone = data.phone;
        this.profile_image = data.profile_image;
        this.venue_name = data.venue_name;
        this.address = data.address;
        this.created_at = data.created_at;
    }

    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS venues (
                venue_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(61) NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NULL,
                phone VARCHAR(20) NOT NULL,
                profile_image VARCHAR(160) DEFAULT 'https://res.cloudinary.com/dsw5tkkyr/image/upload/v1764845539/avatar_wcaknk.png',
                venue_name VARCHAR(100) NOT NULL,
                address VARCHAR(150) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_venue_email (email),
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
        const { email, password, first_name, last_name, phone, profile_image, venue_name, address } = data;
        const [result] = await conn.execute(
            'INSERT INTO venues (email, password, first_name, last_name, phone, profile_image, venue_name, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [email, password, first_name, last_name, phone, profile_image, venue_name, address]
        );
        return await Venue.findById(result.insertId, conn);
    }

    static async findById(id, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venues WHERE venue_id = ?', [id]);
        return rows.length ? new Venue(rows[0]) : null;
    }

    static async findByEmail(email, conn = db) {
        const [rows] = await conn.execute('SELECT * FROM venues WHERE email = ?', [email]);
        return rows.length ? new Venue(rows[0]) : null;
    }

    static async updateProfile(id, updates, conn = db) {
        const fields = [];
        const params = [];
        if (updates.first_name !== undefined) { fields.push('first_name = ?'); params.push(updates.first_name); }
        if (updates.last_name !== undefined) { fields.push('last_name = ?'); params.push(updates.last_name); }
        if (updates.phone !== undefined) { fields.push('phone = ?'); params.push(updates.phone); }
        if (updates.profile_image !== undefined) { fields.push('profile_image = ?'); params.push(updates.profile_image); }
        if (updates.venue_name !== undefined) { fields.push('venue_name = ?'); params.push(updates.venue_name); }
        if (updates.address !== undefined) { fields.push('address = ?'); params.push(updates.address); }
        if (!fields.length) return false;
        params.push(id);
        const [res] = await conn.execute(`UPDATE venues SET ${fields.join(', ')} WHERE venue_id = ?`, params);
        return res.affectedRows > 0;
    }
}

export default Venue;
