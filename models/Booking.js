import db from '../config/db.js';

class Booking {
	constructor(data) {
		this.booking_id = data.booking_id;
		this.slot_id = data.slot_id;
		this.venue_id = data.venue_id;
		this.venue_sport_id = data.venue_sport_id;
		this.user_id = data.user_id;
		this.game_id = data.game_id;
		this.start_datetime = data.start_datetime;
		this.end_datetime = data.end_datetime;
		this.total_price = data.total_price;
		this.created_at = data.created_at;
	}

	static async createTable() {
		const query = `
			CREATE TABLE IF NOT EXISTS bookings (
				booking_id INT AUTO_INCREMENT PRIMARY KEY,
				slot_id INT NULL,
				venue_id INT NOT NULL,
				venue_sport_id INT NOT NULL,
				user_id INT NOT NULL,
				game_id INT NOT NULL,
				start_datetime DATETIME NOT NULL,
				end_datetime DATETIME NOT NULL,
				total_price DECIMAL(10,2) CHECK (total_price >= 0),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				payment ENUM('unpaid', 'paid') DEFAULT 'unpaid',
				INDEX idx_booking_venue (venue_id),
				INDEX idx_booking_user (user_id),
				INDEX idx_booking_game (game_id),
				CONSTRAINT fk_booking_slot FOREIGN KEY (slot_id)
					REFERENCES slots(slot_id)
					ON DELETE SET NULL ON UPDATE CASCADE,
				CONSTRAINT fk_booking_venue FOREIGN KEY (venue_id)
					REFERENCES venues(venue_id)
					ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT fk_booking_vs FOREIGN KEY (venue_sport_id)
					REFERENCES venue_sports(venue_sport_id)
					ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT fk_booking_user FOREIGN KEY (user_id)
					REFERENCES users(user_id)
					ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT fk_booking_game FOREIGN KEY (game_id)
					REFERENCES games(game_id)
					ON DELETE CASCADE ON UPDATE CASCADE
			)
		`;
		try {
			await db.execute(query);
			console.log('Bookings table created or already exists');
		} catch (error) {
			console.error('Error creating bookings table:', error);
			throw error;
		}
	}

	static async save(data, conn = db) {
		const {
			slot_id = null,
			venue_id,
			venue_sport_id,
			user_id,
			game_id,
			start_datetime,
			end_datetime,
			total_price = null
		} = data;

		const [result] = await conn.execute(
			`INSERT INTO bookings (slot_id, venue_id, venue_sport_id, user_id, game_id, start_datetime, end_datetime, total_price)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[slot_id, venue_id, venue_sport_id, user_id, game_id, start_datetime, end_datetime, total_price]
		);
		return await Booking.findById(result.insertId, conn);
	}	

	static async findById(id, conn = db) {
		const [rows] = await conn.execute('SELECT * FROM bookings WHERE booking_id = ?', [id]);
		return rows.length ? new Booking(rows[0]) : null;
	}

	static async deleteById(id, conn = db) {
		const [result] = await conn.execute('DELETE FROM bookings WHERE booking_id = ?', [id]);
		return result.affectedRows > 0;
	}

	static async listByVenue(venueId, conn = db, status = 'active') {
		// Normalize status in case caller passed connection as second arg
		if (typeof status !== 'string') {
			status = 'active';
		}
		// Using fully qualified names as seen elsewhere in the codebase
		const [rows] = await conn.execute(
			`SELECT
				b.booking_id,
				b.start_datetime AS booking_start,
				b.end_datetime AS booking_end,
				b.total_price,
				b.created_at AS booking_created_at,
				b.payment,

				u.user_id,
				u.first_name AS user_first_name,
				u.last_name AS user_last_name,
				u.user_email,
				u.phone_number,

				s.sport_id,
				s.sport_name,

				sl.slot_id,
				sl.price_per_slot,

				g.game_id,
				g.status AS game_status
			FROM bookings b
			JOIN users u ON b.user_id = u.user_id
			JOIN venues v ON b.venue_id = v.venue_id
			JOIN venue_sports vs ON b.venue_sport_id = vs.venue_sport_id
			JOIN sports s ON vs.sport_id = s.sport_id
			LEFT JOIN slots sl ON b.slot_id = sl.slot_id
			JOIN games g ON b.game_id = g.game_id
			JOIN users hu ON g.host_user_id = hu.user_id
			WHERE b.venue_id = ? AND g.status = ?
			ORDER BY b.start_datetime DESC`,
			[venueId, status]
		);
		return rows;
	}

	static async updatePaymentStatus(bookingId, conn = db) {
		const [result] = await conn.execute(
			`UPDATE bookings SET payment = 'paid' WHERE booking_id = ?`,
			[bookingId]
		);
		return result.affectedRows > 0;
	}

	static async findOne(criteria, conn = db) {
		const { slot_id, venue_id, start_datetime, end_datetime } = criteria;
		const [rows] = await conn.execute(
			`SELECT * FROM bookings WHERE slot_id = ? AND venue_id = ? AND start_datetime < ? AND end_datetime > ?`,
			[slot_id, venue_id, end_datetime, start_datetime]
		);
		return rows.length ? new Booking(rows[0]) : null;
	}

}

export default Booking;

