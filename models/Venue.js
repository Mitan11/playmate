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
        // Check if updates object is valid
        if (!updates || typeof updates !== 'object') {
            return false;
        }

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

    static async getAllVenues(conn = db) {
        const [rows] = await conn.execute(`SELECT 
    v.venue_id,
    v.email,
    v.first_name,
    v.last_name,
    v.phone,
    v.venue_name,
    v.address,
    v.profile_image,
    v.created_at AS venue_created_at,
    s.sport_id,
    s.sport_name,
    vs.created_at AS sport_added_at
FROM venues v
LEFT JOIN venue_sports vs 
    ON v.venue_id = vs.venue_id
LEFT JOIN sports s 
    ON vs.sport_id = s.sport_id
ORDER BY v.venue_id, s.sport_name;
`);

        // Group venues by venue_id and aggregate sports
        const venuesMap = new Map();

        rows.forEach(row => {
            const venueId = row.venue_id;

            if (!venuesMap.has(venueId)) {
                venuesMap.set(venueId, {
                    venue_id: row.venue_id,
                    email: row.email,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: row.phone,
                    venue_name: row.venue_name,
                    address: row.address,
                    profile_image: row.profile_image,
                    created_at: row.venue_created_at,
                    sports: []
                });
            }

            // Add sport information if it exists
            if (row.sport_name) {
                venuesMap.get(venueId).sports.push({
                    sport_name: row.sport_name,
                    price_per_hour: row.sport_price,
                    sport_added_at: row.sport_added_at
                });
            }
        });

        return Array.from(venuesMap.values());
    }

    static async listAll(conn = db) {
        const query = `
        SELECT 
    v.venue_id,
    v.email,
    v.venue_name,
    v.address,
    vi.image_url,
    s.sport_name,
    s.sport_id,
    MIN(sl.price_per_slot) AS min_price
FROM venues v
LEFT JOIN venue_sports vs 
    ON v.venue_id = vs.venue_id
LEFT JOIN sports s 
    ON vs.sport_id = s.sport_id
LEFT JOIN venue_images vi
    ON vi.venue_id = v.venue_id
LEFT JOIN slots sl 
    ON vs.venue_sport_id = sl.venue_sport_id
GROUP BY
    v.venue_id,
    v.email,
    v.venue_name,
    v.address,
    vi.image_url,
    s.sport_name
ORDER BY 
    v.venue_id,
    s.sport_name;

        `

        const [rows] = await conn.execute(query);

        const venuesMap = new Map();

        rows.forEach(row => {
            const venueId = row.venue_id;

            if (!venuesMap.has(venueId)) {
                venuesMap.set(venueId, {
                    venue_id: row.venue_id,
                    email: row.email,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    phone: row.phone,
                    venue_name: row.venue_name,
                    address: row.address,
                    profile_image: row.profile_image,
                    created_at: row.venue_created_at,
                    min_price: null,
                    sports: [],
                    images: []
            });
            }

            if (row.sport_name && row.sport_id !== null && row.sport_id !== undefined) {
                const sports = venuesMap.get(venueId).sports;
                if (!sports.some(s => s.sport_id === row.sport_id)) {
                    sports.push({
                        sport_id: row.sport_id,
                        sport_name: row.sport_name,
                        price_per_hour: row.sport_price,
                        sport_added_at: row.sport_added_at
                    });
                }
            }

            if (row.image_url) {
                const images = venuesMap.get(venueId).images;
                if (!images.includes(row.image_url)) {
                    images.push(row.image_url);
                }
            }

            if (row.min_price && (venuesMap.get(venueId).min_price === null || row.min_price < venuesMap.get(venueId).min_price)) {
                venuesMap.get(venueId).min_price = row.min_price;
            }

        });

            return Array.from(venuesMap.values());
        }

    static async deleteById(id, conn = db) {
            const [res] = await conn.execute('DELETE FROM venues WHERE venue_id = ?', [id]);
            return res.affectedRows > 0;
        }
}

export default Venue;
