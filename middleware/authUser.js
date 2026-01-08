import User from "../models/User.js";
import Venue from "../models/Venue.js";
import AuthHelpers from "../utils/AuthHelpers.js";
import Response from "../utils/Response.js";

const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        // Check if token is present and well-formed
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(
                Response.error(401, "Authorization token missing or malformed")
            );
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = AuthHelpers.verifyToken(token);

        if (!decoded || !decoded.id) {
            return res.status(401).json(
                Response.error(401, "Invalid or expired token")
            );
        }

        // find user by id
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json(
                Response.error(404, "User not found")
            );
        }

        delete user.user_password;

        // Attach user info to request object
        req.user = user;

        next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json(
            Response.error(500, "Token verification failed")
        );
    }
}

const venueVerifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        // Check if token is present and well-formed
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(
                Response.error(401, "Authorization token missing or malformed")
            );
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = AuthHelpers.verifyToken(token);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json(
                Response.error(401, "Invalid or expired token")
            );
        }

        // find user by id
        const venueOwner = await Venue.findById(decoded.id);

        if (!venueOwner) {
            return res.status(404).json(
                Response.error(404, "User not found")
            );
        }

        delete venueOwner.password;

        // Attach user info to request object
        req.user = venueOwner;

        next();

    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(500).json(
            Response.error(500, "Token verification failed")
        );
    }
}


export { verifyToken , venueVerifyToken };