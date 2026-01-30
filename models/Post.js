import db from '../config/db.js';

class Post {
    constructor(data) {
        this.post_id = data.post_id;
        this.user_id = data.user_id;
        this.text_content = data.text_content;
        this.media_url = data.media_url;
        this.created_at = data.created_at;
        // Additional fields for joined data
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.profile_image = data.profile_image;
        this.like_count = data.like_count;
    }

    static async createTable() {
        // Create posts table
        const postsQuery = `
            CREATE TABLE IF NOT EXISTS posts (
                post_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                text_content TEXT NOT NULL,
                media_url VARCHAR(255) DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at),
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `;

        // Create post_likes table
        const postLikesQuery = `
            CREATE TABLE IF NOT EXISTS post_likes (
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (post_id, user_id),
                INDEX idx_post_id (post_id),
                INDEX idx_user_id (user_id),
                FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
            )
        `;

        try {
            await db.execute(postsQuery);
            console.log('Posts table created or already exists');
            await db.execute(postLikesQuery);
            console.log('Post likes table created or already exists');
        } catch (error) {
            console.error('Error creating posts/post_likes tables:', error);
            throw error;
        }
    }

    // Create a new post
    static async save(data, conn = db) {
        const { user_id, text_content, media_url = '' } = data;
        const [result] = await conn.execute(
            'INSERT INTO posts (user_id, text_content, media_url) VALUES (?, ?, ?)',
            [user_id, text_content, media_url]
        );
        return await Post.findById(result.insertId, conn);
    }

    // Get post by ID
    static async findById(id, conn = db) {
        const [rows] = await conn.execute(`
            SELECT 
                p.post_id,
                p.user_id,
                p.text_content,
                p.media_url,
                p.created_at,
                u.first_name,
                u.last_name,
                u.profile_image,
                COUNT(pl.user_id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            WHERE p.post_id = ?
            GROUP BY p.post_id
        `, [id]);
        return rows.length ? new Post(rows[0]) : null;
    }

    // Get all posts with user info and like counts
    static async getAllPosts(conn = db) {
        const [rows] = await conn.execute(`
            SELECT 
                p.post_id,
                p.user_id,
                p.text_content,
                p.media_url,
                p.created_at,
                u.first_name,
                u.last_name,
                u.profile_image,
                COUNT(pl.user_id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            GROUP BY p.post_id
            ORDER BY p.created_at DESC
        `);
        return rows.map(row => new Post(row));
    }

    // Get posts by user ID
    static async getPostsByUserId(userId, conn = db) {
        const [rows] = await conn.execute(`
            SELECT 
                p.post_id,
                p.user_id,
                p.text_content,
                p.media_url,
                p.created_at,
                u.first_name,
                u.last_name,
                u.profile_image,
                COUNT(pl.user_id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            WHERE p.user_id = ?
            GROUP BY p.post_id
            ORDER BY p.created_at DESC
        `, [userId]);
        return rows.map(row => new Post(row));
    }

    // Update post content
    static async updatePost(postId, updates, conn = db) {
        const fields = [];
        const params = [];

        if (updates.text_content !== undefined) {
            fields.push('text_content = ?');
            params.push(updates.text_content);
        }
        if (updates.media_url !== undefined) {
            fields.push('media_url = ?');
            params.push(updates.media_url);
        }

        if (!fields.length) return false;

        params.push(postId);
        const [result] = await conn.execute(
            `UPDATE posts SET ${fields.join(', ')} WHERE post_id = ?`,
            params
        );
        return result.affectedRows > 0;
    }

    // Delete post (cascade will handle post_likes)
    static async deleteById(postId, conn = db) {
        const [result] = await conn.execute('DELETE FROM posts WHERE post_id = ?', [postId]);
        return result.affectedRows > 0;
    }

    // Delete posts by user ID (cascade will handle post_likes)
    static async deleteByUserId(userId, conn = db) {
        const [result] = await conn.execute('DELETE FROM posts WHERE user_id = ?', [userId]);
        return result.affectedRows > 0;
    }

    // Like a post
    static async likePost(postId, userId, conn = db) {
        try {
            const [result] = await conn.execute(
                'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
                [postId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            // Handle duplicate entry (user already liked the post)
            if (error.code === 'ER_DUP_ENTRY') {
                return false;
            }
            throw error;
        }
    }

    // Unlike a post
    static async unlikePost(postId, userId, conn = db) {
        const [result] = await conn.execute(
            'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );
        return result.affectedRows > 0;
    }

    // Check if user liked a post
    static async isPostLikedByUser(postId, userId, conn = db) {
        const [rows] = await conn.execute(
            'SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ? LIMIT 1',
            [postId, userId]
        );
        return rows.length > 0;
    }

    // Get users who liked a post
    static async getPostLikers(postId, conn = db) {
        const [rows] = await conn.execute(`
            SELECT 
                u.user_id,
                u.first_name,
                u.last_name,
                u.profile_image,
                pl.liked_at
            FROM post_likes pl
            JOIN users u ON pl.user_id = u.user_id
            WHERE pl.post_id = ?
            ORDER BY pl.liked_at DESC
        `, [postId]);
        return rows;
    }

    // Get like count for a specific post
    static async getLikeCount(postId, conn = db) {
        const [rows] = await conn.execute(
            'SELECT COUNT(*) as like_count FROM post_likes WHERE post_id = ?',
            [postId]
        );
        return rows[0].like_count;
    }

    // Get posts with pagination
    static async getPostsWithPagination(page = 1, limit = 10, conn = db) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        console.log('Pagination params:', { pageNum, limitNum, offset, types: { limitNum: typeof limitNum, offset: typeof offset } });

        // limitNum  = 10   // posts per page
        // offset    = 20   // skip first 20 posts

        const [rows] = await conn.query(`
            SELECT 
                p.post_id,
                p.user_id,
                p.text_content,
                p.media_url,
                p.created_at,
                u.first_name,
                u.last_name,
                u.profile_image,
                COUNT(pl.user_id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            GROUP BY p.post_id, p.user_id, p.text_content, p.media_url, p.created_at, u.first_name, u.last_name, u.profile_image
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `, [limitNum, offset]);

        return rows.map(row => new Post(row));
    }

    // Get total posts count for pagination
    static async getTotalPostsCount(conn = db) {
        const [rows] = await conn.execute('SELECT COUNT(*) as total FROM posts');
        return rows[0].total;
    }

    // Search posts by text content
    static async searchPosts(searchTerm, conn = db) {
        const [rows] = await conn.execute(`
            SELECT 
                p.post_id,
                p.user_id,
                p.text_content,
                p.media_url,
                p.created_at,
                u.first_name,
                u.last_name,
                u.profile_image,
                COUNT(pl.user_id) AS like_count
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            LEFT JOIN post_likes pl ON p.post_id = pl.post_id
            WHERE p.text_content LIKE ?
            GROUP BY p.post_id
            ORDER BY p.created_at DESC
        `, [`%${searchTerm}%`]);

        return rows.map(row => new Post(row));
    }

    static async getUserPosts(userId, conn = db) {
        try {
            const [rows] = await conn.execute(
                `SELECT 
                    p.post_id,
                    p.text_content,
                    p.media_url,
                    p.created_at
                FROM posts p
                WHERE p.user_id = ? ORDER BY p.created_at DESC`,
                [userId]
            );

            const posts = {
                user_id: userId,
                posts: rows
            }

            return posts;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    }

}

export default Post;
