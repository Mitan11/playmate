import Response from "../utils/Response.js";
import User from "../models/User.js";

// Initialize database table
User.createTable().catch(console.error);

// User registration controller
const register = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json(Response.error(500, "Registration failed", error.message));
    }
};

// User login controller
const login = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json(Response.error(500, "Login failed", error.message));
    }
};



export { register, login };