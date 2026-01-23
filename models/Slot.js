import db from '../config/db.js';

class Slot {
    constructor(slotData) {
        this.slot_id = slotData.slot_id;
        this.venue_sport_id = slotData.venue_sport_id;
        this.start_time = slotData.start_time;
        this.end_time = slotData.end_time;
        this.price_per_slot = slotData.price_per_slot;
        this.created_at = slotData.created_at;
    }

    // Create slots table if it doesn't exist
    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS slots (
                slot_id INT AUTO_INCREMENT PRIMARY KEY,
                venue_sport_id INT NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                price_per_slot DECIMAL(10,2) CHECK (price_per_slot >= 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_slot_vs FOREIGN KEY (venue_sport_id)
                    REFERENCES venue_sports(venue_sport_id)
                    ON DELETE CASCADE ON UPDATE CASCADE
            )
        `;

        try {
            await db.execute(createTableQuery);
            console.log('Slots table created or already exists');
        } catch (error) {
            console.error('Error creating slots table:', error);
            throw error;
        }
    }

    // Save new slot to database
    static async save(slotData, conn = db) {
        const { venue_sport_id, start_time, end_time, price_per_slot } = slotData;

        try {
            const query = `INSERT INTO slots (venue_sport_id, start_time, end_time, price_per_slot) VALUES (?, ?, ?, ?)`;
            const params = [venue_sport_id, start_time, end_time, price_per_slot];

            const [result] = await conn.execute(query, params);

            return await Slot.findById(result.insertId, conn);
        } catch (error) {
            console.error('Error creating slot:', error);
            throw error;
        }
    }

    // Find slot by ID
    static async findById(slotId, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT * FROM slots WHERE slot_id = ?',
                [slotId]
            );
            return rows.length > 0 ? new Slot(rows[0]) : null;
        } catch (error) {
            console.error('Error finding slot by ID:', error);
            throw error;
        }
    }

    // Get all slots
    static async getAllSlots(conn = db) {
        try {
            const [rows] = await conn.execute('SELECT * FROM slots ORDER BY start_time ASC');
            return rows.map(row => new Slot(row));
        } catch (error) {
            console.error('Error fetching all slots:', error);
            throw error;
        }
    }

    // Get slots by venue_sport_id
    static async getSlotsByVenueSportId(venueSportId, conn = db) {
        try {
            const [rows] = await conn.execute(
                'SELECT * FROM slots WHERE venue_sport_id = ? ORDER BY start_time ASC',
                [venueSportId]
            );
            return rows.map(row => new Slot(row));
        } catch (error) {
            console.error('Error fetching slots by venue sport ID:', error);
            throw error;
        }
    }

    // Update slot
    static async updateSlot(slotId, updates, conn = db) {
        try {
            if (!updates || typeof updates !== 'object') {
                return false;
            }

            const fields = [];
            const params = [];

            if (updates.venue_sport_id !== undefined) { fields.push('venue_sport_id = ?'); params.push(updates.venue_sport_id); }
            if (updates.start_time !== undefined) { fields.push('start_time = ?'); params.push(updates.start_time); }
            if (updates.end_time !== undefined) { fields.push('end_time = ?'); params.push(updates.end_time); }
            if (updates.price_per_slot !== undefined) { fields.push('price_per_slot = ?'); params.push(updates.price_per_slot); }

            if (!fields.length) return false;

            params.push(slotId);

            const [result] = await conn.execute(
                `UPDATE slots SET ${fields.join(', ')} WHERE slot_id = ?`,
                params
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating slot:', error);
            throw error;
        }
    }

    // Delete slot by ID
    static async deleteById(slotId, conn = db) {
        try {
            const [result] = await conn.execute(
                'DELETE FROM slots WHERE slot_id = ?',
                [slotId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting slot:', error);
            throw error;
        }
    }

    static async getSlotsByVenueId(venueId, conn = db) {
        try {
            const [rows] = await conn.execute(
                `
                SELECT 
                    s.slot_id,
                    s.start_time,
                    s.end_time,
                    s.price_per_slot,
                    s.created_at AS slot_created_at,
                    vs.venue_sport_id,

                    sp.sport_id,
                    sp.sport_name
                FROM slots s
                JOIN venue_sports vs ON s.venue_sport_id = vs.venue_sport_id
                JOIN venues v ON vs.venue_id = v.venue_id
                JOIN sports sp ON vs.sport_id = sp.sport_id
                WHERE v.venue_id = ?;
                `,
                [venueId]
            );
            return rows;
        } catch (error) {
            console.error('Error fetching slots by slot ID and venue sport ID:', error);
            throw error;
        }
    }

}

export default Slot;
