import db from '../config/db.js';

class GamePlayer {
	constructor(data) {
		this.game_player_id = data.game_player_id;
		this.game_id = data.game_id;
		this.user_id = data.user_id;
		this.status = data.status;
		this.joined_at = data.joined_at;
	}

	static async createTable() {
		const query = `
			CREATE TABLE IF NOT EXISTS game_players (
				game_player_id INT NOT NULL AUTO_INCREMENT,
				game_id INT NOT NULL,
				user_id INT NOT NULL,
				status ENUM('Pending','Approved','Rejected') NULL,
				joined_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
				PRIMARY KEY (game_player_id),
				UNIQUE KEY uniq_game_player (game_id, user_id),
				KEY game_id (game_id),
				KEY user_id (user_id),
				CONSTRAINT game_players_ibfk_1 FOREIGN KEY (game_id)
					REFERENCES games (game_id)
					ON DELETE CASCADE ON UPDATE CASCADE,
				CONSTRAINT game_players_ibfk_2 FOREIGN KEY (user_id)
					REFERENCES users (user_id)
					ON DELETE CASCADE ON UPDATE CASCADE
			)
		`;

		try {
			await db.execute(query);
			console.log('Game players table created or already exists');
		} catch (error) {
			console.error('Error creating game players table:', error);
			throw error;
		}
	}

	static async save(data, conn = db) {
		const { game_id, user_id, status = 'Pending' } = data;

		const [result] = await conn.execute(
			`INSERT INTO game_players (game_id, user_id, status) VALUES (?, ?, ?)`,
			[game_id, user_id, status]
		);
		return await GamePlayer.findById(result.insertId, conn);
	}

	static async findById(id, conn = db) {
		const [rows] = await conn.execute(
			'SELECT * FROM game_players WHERE game_player_id = ?',
			[id]
		);
		return rows.length ? new GamePlayer(rows[0]) : null;
	}

	static async findByGameAndUser(gameId, userId, conn = db) {
		const [rows] = await conn.execute(
			'SELECT * FROM game_players WHERE game_id = ? AND user_id = ? LIMIT 1',
			[gameId, userId]
		);
		return rows.length ? new GamePlayer(rows[0]) : null;
	}

	static async listByGame(gameId, conn = db) {
		const [rows] = await conn.execute(
			'SELECT * FROM game_players WHERE game_id = ? ORDER BY joined_at DESC',
			[gameId]
		);
		return rows.map(row => new GamePlayer(row));
	}

	static async listByGameWithUsers(gameId, conn = db) {
		const [rows] = await conn.execute(
			`SELECT
				gp.game_player_id,
				gp.game_id,
				gp.user_id,
				gp.status,
				gp.joined_at,
				u.first_name,
				u.last_name,
				u.profile_image,
				u.user_email,
				u.phone_number
			FROM game_players gp
			JOIN users u ON gp.user_id = u.user_id
			WHERE gp.game_id = ?
			ORDER BY gp.joined_at DESC`,
			[gameId]
		);
		return rows;
	}

	static async listGamesByUser(userId, conn = db) {
		const [rows] = await conn.execute(
			`SELECT
				gp.game_player_id,
				gp.status AS player_status,
				gp.joined_at,

				g.game_id,
				g.start_datetime,
				g.end_datetime,
				g.price_per_hour,
				g.status AS game_status,
				g.created_at,

				s.sport_id,
				s.sport_name,

				v.venue_id,
				v.venue_name,
				v.address AS venue_location
			FROM game_players gp
			JOIN games g ON gp.game_id = g.game_id
			JOIN sports s ON g.sport_id = s.sport_id
			JOIN venues v ON g.venue_id = v.venue_id
			WHERE gp.user_id = ?
			ORDER BY g.start_datetime DESC`,
			[userId]
		);
		return rows;
	}

	static async updateStatus(gamePlayerId, status, conn = db) {
		const [result] = await conn.execute(
			'UPDATE game_players SET status = ? WHERE game_player_id = ?',
			[status, gamePlayerId]
		);
		return result.affectedRows > 0;
	}

	static async updateStatusByGameAndUser(gameId, userId, status, conn = db) {
		const [result] = await conn.execute(
			'UPDATE game_players SET status = ? WHERE game_id = ? AND user_id = ?',
			[status, gameId, userId]
		);
		return result.affectedRows > 0;
	}

	static async deleteById(id, conn = db) {
		const [result] = await conn.execute(
			'DELETE FROM game_players WHERE game_player_id = ?',
			[id]
		);
		return result.affectedRows > 0;
	}
}

export default GamePlayer;