import UserSport from "../models/UserSport.js";
import Response from "../utils/Response.js";
import db from "../config/db.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary'
import Post from "../models/Post.js";
import GamePlayer from "../models/game_player.js";
import Games from "../models/Games.js";
import Booking from "../models/Booking.js";
import crypto from "crypto";
import Venue from "../models/Venue.js";
import Sport from "../models/Sport.js";
import { bookingReceiptTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/Mail.js";

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
    const { RAZORPAY_KEY_SECRET } = process.env;
    const body = `${orderId}|${paymentId}`;
    const expected = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expected === signature;
};

const updateUserDetails = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_email, first_name, last_name, phone_number } = req.body;
        let profile_image = null;

        // upload image to cloudinary only if file is provided
        if (req.file) {
            try {
                const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
                profile_image = imageUpload.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // If upload fails, use default image
                profile_image = defaultProfileImage;
            }
        }

        // Validate required fields
        if (!user_email || !first_name) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Email and first name are required"));
        }

        // Check if user exists
        const existingUser = await User.findByEmail(user_email, connection);
        if (!existingUser) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Build user object with only fields to update
        const user = {
            user_email,
            first_name,
            last_name: last_name || existingUser.last_name,
            phone_number: phone_number || existingUser.phone_number,
            profile_image: profile_image || existingUser.profile_image
        };

        // Update user details
        await User.updateUserDetails(user, connection);

        // Fetch updated user data
        const updatedUser = await User.findByEmail(user_email, connection);

        await connection.commit();

        res.status(200).json(Response.success(
            200,
            "User details updated successfully",
            {
                user: {
                    user_id: updatedUser.user_id,
                    user_email: updatedUser.user_email,
                    first_name: updatedUser.first_name,
                    last_name: updatedUser.last_name,
                    phone_number: updatedUser.phone_number,
                    profile_image: updatedUser.profile_image
                }
            }
        ));

    } catch (error) {
        await connection.rollback();
        console.error("Error updating user details:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const addUserSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_id, sport_id, skill_level } = req.body;

        if (!user_id || isNaN(user_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!sport_id || isNaN(sport_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        const existingUserSport = await UserSport.findByUserAndSport(user_id, sport_id, connection);
        if (existingUserSport) {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "User sport already exists"));
        }

        const userSportData = { user_id, sport_id, skill_level };
        const newUserSportId = await UserSport.addUserSport(userSportData, connection);

        await connection.commit();
        res.status(201).json(Response.success(201, "User sport added successfully", { user_sport_id: newUserSportId }));
    } catch (error) {
        await connection.rollback();
        console.error("Error adding user sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const userProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.params;
        if (!userId || isNaN(userId)) {
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        const user = await User.findById(userId, connection);

        res.status(200).json(Response.success(200, "User retrieved successfully", user));

    } catch (error) {
        await connection.rollback();
        console.error("Error fetching user sports:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const deleteUserSport = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { user_id, sport_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!sport_id || isNaN(sport_id)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid sport ID"));
        }

        const existingUserSport = await UserSport.findByUserAndSport(user_id, sport_id, connection);
        if (!existingUserSport) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User sport not found"));
        }

        await UserSport.removeUserSport(user_id, sport_id, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "User sport deleted successfully"));
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting user sport:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const userPosts = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.params;

        const exist = await User.findById(userId, connection);
        if (!exist) {
            return res.status(404).json(Response.error(404, "User not found"));
        }

        if (!userId || isNaN(userId)) {
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }
        const posts = await Post.getPostsByUserId(userId, connection);
        const isLiked = await Promise.all(posts.map(async (post) => {
            const liked = await Post.isPostLikedByUser(post.post_id, userId, connection);
            return {
                ...post,
                is_liked_by_user: liked
            };
        }));
        res.status(200).json(Response.success(200, "User posts retrieved successfully", { posts: isLiked }));
    } catch (error) {
        await connection.rollback();
        console.error("Error fetching user posts:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const createPost = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const user_id = req.params.userId;
        const { text_content } = req.body;
        const file = req.file;
        let secure_url = null;

        const exist = await User.findById(user_id, connection);
        if (!exist) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // xss protection for text content
        const sanitizedTextContent = text_content ? text_content.replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;

        // Upload file to Cloudinary if provided
        if (file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    resource_type: "image"
                });
                secure_url = uploadResult.secure_url;

            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                await connection.rollback();
                return res.status(500).json(Response.error(500, "Failed to upload media"));
            }
        }

        // Validate that at least text or media is provided
        if (!sanitizedTextContent && !secure_url) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Post must contain text or media"));
        }

        const postData = {
            user_id,
            text_content: sanitizedTextContent || null,
            media_url: secure_url || null
        };

        await Post.save(postData, connection);
        await connection.commit();

        res.status(201).json(Response.success(201, "Post created successfully", { post: postData }));
    } catch (error) {
        await connection.rollback();
        console.error("Error creating post:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const deletePost = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { postId, userId } = req.params;

        const existingPost = await Post.findById(postId, connection);
        if (!existingPost) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Post not found"));
        }

        // Check if the post belongs to the user
        if (existingPost.user_id !== parseInt(userId)) {
            await connection.rollback();
            return res.status(403).json(Response.error(403, "You are not authorized to delete this post"));
        }

        await Post.deleteById(postId, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "Post deleted successfully"));
    } catch (error) {
        await connection.rollback();
        console.error("Error deleting post:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const toggleLike = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { postId, userId } = req.params;

        // Validate IDs
        if (!postId || isNaN(postId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid post ID"));
        }

        if (!userId || isNaN(userId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        // Check if post exists
        const existingPost = await Post.findById(postId, connection);
        if (!existingPost) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Post not found"));
        }

        // Check if user already liked the post
        const isLiked = await Post.isPostLikedByUser(postId, userId, connection);

        let message;
        if (isLiked) {
            // Unlike the post
            await Post.unlikePost(postId, userId, connection);
            message = "Post unliked successfully";
        } else {
            // Like the post
            await Post.likePost(postId, userId, connection);
            message = "Post liked successfully";
        }

        // Get updated like count
        const likeCount = await Post.getLikeCount(postId, connection);
        await connection.commit();
        res.status(200).json(Response.success(200, message, {
            like_count: likeCount,
            is_liked: !isLiked
        }));
    } catch (error) {
        await connection.rollback();
        console.error("Error toggling like:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const getPostLikes = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { postId } = req.params;
        // Validate post ID
        if (!postId || isNaN(postId)) {
            return res.status(400).json(Response.error(400, "Invalid post ID"));
        }

        // Check if post exists
        const existingPost = await Post.findById(postId, connection);
        if (!existingPost) {
            return res.status(404).json(Response.error(404, "Post not found"));
        }

        // Get users who liked the post
        const likers = await Post.getPostLikers(postId, connection);

        res.status(200).json(Response.success(200, "Post likes retrieved successfully", {
            post_id: postId,
            like_count: likers.length,
            likers
        }));
    } catch (error) {
        console.error("Error fetching post likes:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const recentActivity = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        // Validate user ID
        if (!userId || isNaN(userId)) {
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        // Validate pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
            return res.status(400).json(Response.error(400, "Invalid pagination parameters"));
        }

        // Check if user exists
        const userExists = await User.findById(userId, connection);
        if (!userExists) {
            return res.status(404).json(Response.error(404, "User not found"));
        }

        // Get recent posts with pagination
        const posts = await Post.getPostsWithPagination(pageNum, limitNum, connection);

        // For each post, check if the current user has liked it
        const postsWithLikeStatus = await Promise.all(posts.map(async (post) => {
            const isLiked = await Post.isPostLikedByUser(post.post_id, userId, connection);
            return {
                post_id: post.post_id,
                user_id: post.user_id,
                first_name: post.first_name,
                last_name: post.last_name,
                profile_image: post.profile_image,
                text_content: post.text_content,
                media_url: post.media_url,
                created_at: post.created_at,
                like_count: post.like_count,
                is_liked_by_user: isLiked
            };
        }));

        // Get total count for pagination metadata
        const totalPosts = await Post.getTotalPostsCount(connection);
        const totalPages = Math.ceil(totalPosts / limitNum);

        res.status(200).json(Response.success(200, "Recent activity retrieved successfully", {
            posts: postsWithLikeStatus,
            pagination: {
                current_page: pageNum,
                total_pages: totalPages,
                total_posts: totalPosts,
                posts_per_page: limitNum,
                has_next: pageNum < totalPages,
                has_previous: pageNum > 1
            }
        }));
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        connection.release();
    }
}

const joinGame = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { userId, gameId } = req.params;

        // Validate IDs
        if (!userId || isNaN(userId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!gameId || isNaN(gameId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid game ID"));
        }

        // Check if game exists
        const existingGame = await Games.findById(gameId, connection);
        if (!existingGame) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Game not found"));
        }

        // Check if user already joined the game
        const alreadyJoined = await GamePlayer.findByGameAndUser(gameId, userId, connection);

        if (alreadyJoined) {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "User already joined this game"));
        }

        // Add user to the game
        await GamePlayer.save({ game_id: gameId, user_id: userId }, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "Joined game successfully"));

    } catch (error) {
        if (error?.code === "ER_DUP_ENTRY") {
            await connection.rollback();
            return res.status(409).json(Response.error(409, "User already joined this game"));
        }
        await connection.rollback();
        console.error("Error joining game:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        await connection.release();
    }
}

const leaveGame = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { userId, gameId } = req.params;
        // Validate IDs
        if (!userId || isNaN(userId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid user ID"));
        }

        if (!gameId || isNaN(gameId)) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid game ID"));
        }

        // Check if game exists
        const existingGame = await Games.findById(gameId, connection);


        if (!existingGame) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Game not found"));
        }

        // Check if user is in the game
        const existingPlayer = await GamePlayer.findByGameAndUser(gameId, userId, connection);
        if (!existingPlayer) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "User is not in this game"));
        }

        // Remove user from the game
        await GamePlayer.deleteByGameAndUser(gameId, userId, connection);

        await connection.commit();
        res.status(200).json(Response.success(200, "Left game successfully"));

    } catch (error) {
        await connection.rollback();
        console.error("Error leaving game:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        await connection.release();
    }
}

const makePayment = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user?.[0]?.user_id || req.body.user_id || req.params.userId;
        const gameId = req.body.game_id || req.params.gameId;
        const payment = req.body.payment || req.body;

        const paymentOrderId = payment?.razorpay_order_id;
        const paymentId = payment?.razorpay_payment_id;
        const paymentSignature = payment?.razorpay_signature;
        const amount = Number(payment?.amount);

        if (!userId || !gameId) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "user_id and game_id are required"));
        }

        if (!paymentOrderId || !paymentId || !paymentSignature || !Number.isFinite(amount) || amount <= 0) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Valid payment details are required"));
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            await connection.rollback();
            return res.status(500).json(Response.error(500, "Payment gateway is not configured"));
        }

        const isPaymentValid = verifyRazorpaySignature(paymentOrderId, paymentId, paymentSignature);
        if (!isPaymentValid) {
            await connection.rollback();
            return res.status(400).json(Response.error(400, "Invalid payment signature"));
        }

        const booking = await Booking.findByUserAndGame(userId, gameId, connection);

        if (!booking) {
            await connection.rollback();
            return res.status(404).json(Response.error(404, "Booking not found"));
        }

        if (booking.payment === "paid") {
            await connection.rollback();
            return res.status(200).json(Response.success(200, "Payment already completed", {
                booking_id: booking.booking_id,
                payment: booking.payment
            }));
        }

        await Booking.updatePaymentStatus(booking.booking_id, connection);
        await connection.commit();

        try {
            const userRows = await User.findById(userId, connection);
            const user = userRows?.[0];
            const venue = await Venue.findById(booking.venue_id, connection);
            const game = await Games.findById(booking.game_id, connection);
            const sport = game ? await Sport.findById(game.sport_id, connection) : null;
            const totalPrice = Number.isFinite(Number(amount))
                ? Number(amount).toFixed(2)
                : Number.isFinite(Number(booking?.total_price))
                    ? Number(booking.total_price).toFixed(2)
                    : booking?.total_price;

            if (user?.user_email) {
                const subject = `Playmate Receipt - Booking #${booking.booking_id}`;
                const html = bookingReceiptTemplate({
                    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Player",
                    bookingId: booking.booking_id,
                    venueName: venue?.venue_name || "Venue",
                    venueAddress: venue?.address || "-",
                    sportName: sport?.sport_name || "-",
                    startDateTime: booking.start_datetime,
                    endDateTime: booking.end_datetime,
                    totalPrice,
                    paymentStatus: "paid",
                    orderId: paymentOrderId,
                    paymentId: paymentId
                });
                await sendEmail(user.user_email, subject, html);
            }
        } catch (emailError) {
            console.error("Receipt email failed:", emailError);
        }

        return res.status(200).json(Response.success(200, "Payment updated successfully", {
            booking_id: booking.booking_id,
            payment: "paid"
        }));
    } catch (error) {
        await connection.rollback();
        console.error("Error updating payment status:", error);
        return res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        await connection.release();
    }
}

const playerJoinedList = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { gameId } = req.params;
        const userId = req.user?.[0]?.user_id || req.body.user_id || req.params.userId;
        if (!gameId || isNaN(gameId)) {
            return res.status(400).json(Response.error(400, "Invalid game ID"));
        }
        const game = await Games.findById(gameId, connection);
        if (!game) {
            return res.status(404).json(Response.error(404, "Game not found"));
        }
        const players = await GamePlayer.getPlayersByGameId(gameId, userId, connection);
        res.status(200).json(Response.success(200, "Players retrieved successfully", { players }));
    } catch (error) {
        console.error("Error fetching players for game:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        await connection.release();
    }
}

const requestedPlayersList = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { gameId } = req.params;
        const userId = req.user?.[0]?.user_id || req.body.user_id || req.params.userId;
        if (!gameId || isNaN(gameId)) {
            return res.status(400).json(Response.error(400, "Invalid game ID"));
        }
        const game = await Games.findById(gameId, connection);
        if (!game) {
            return res.status(404).json(Response.error(404, "Game not found"));
        }
        const players = await GamePlayer.getRequestedPlayersByGameId(gameId, userId, connection);
        res.status(200).json(Response.success(200, "Requested players retrieved successfully", { players }));
    } catch (error) {
        console.error("Error fetching requested players for game:", error);
        res.status(500).json(Response.error(500, "Internal Server Error"));
    } finally {
        await connection.release();
    }
}

const updateGamePlayerStatus = async (req, res) => {
    try {
        const { game_player_id, user_id, status } = req.body;
        
        // ENUM validation
        const allowedStatus = ["Pending", "Approved", "Rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: Pending, Approved, Rejected",
            });
        }

        const result = await GamePlayer.updateStatus(game_player_id, user_id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No matching record found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Status updated successfully to ${status}`,
        });

    } catch (error) {
        console.error("updateGamePlayerStatus Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export { addUserSport, updateUserDetails, userProfile, deleteUserSport, userPosts, createPost, deletePost, toggleLike, getPostLikes, recentActivity, joinGame, leaveGame, makePayment, playerJoinedList, requestedPlayersList, updateGamePlayerStatus };