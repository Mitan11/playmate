/* eslint-disable class-methods-use-this */
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");

class AuthHelpers {

    // handles password hashing using bcrypt
    async hashPassword(plainPassword) {
        // checks if there is password provided
        if (!plainPassword) {
            throw new Error("Error hashing password");
        }

        // generate salt and hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        return hashedPassword;
    }

    // handles token generation
    async generateToken(payload) {
        const token = JWT.sign({ id: payload._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });

        return token;
    }

    // handles check for a password validity by comparing the
    // hash with the provided plain password
    async isPasswordValid(hashedPass, plainPass) {
        // checking if the password is valid
        const isPasswordValid = await bcrypt.compare(plainPass, hashedPass);
        return isPasswordValid;
    }

    // handles user's authorization
    mustBeLoggedIn(req, res, next) {
        try {
        } catch (error) {
            throw new Unauthorized("You must be logged in to access this resource");
        }
    }
}

module.exports = new AuthHelpers();