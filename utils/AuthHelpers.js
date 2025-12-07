import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

class AuthHelpers {

    // handles password hashing using bcrypt
    async hashPassword(plainPassword) {
        try {
            // checks if there is password provided
            if (!plainPassword) {
                throw new Error("Error hashing password");
            }

            // generate salt and hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);

            return hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
            throw new Error("Error hashing password");
        }
    }

    // handles token generation
    async generateToken(payload) {
        try {
            // generate JWT token
            const token = JWT.sign({ id: payload.user_id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            });

            return token;
        } catch (error) {
            console.error('Error generating token:', error);
            throw new Error("Error generating token");
        }
    }

    // handles token verification
    verifyToken(token) {
        try {
            // verify JWT token
            const decoded = JWT.verify(token , process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error("Error verifying token");
        }
    }

    // handles check for a password validity by comparing the
    // hash with the provided plain password
    async isPasswordValid(hashedPass, plainPass) {
        try {
            // checking if the password is valid
            const isPasswordValid = await bcrypt.compare(plainPass, hashedPass);
            return isPasswordValid;
        } catch (error) {
            console.error('Error validating password:', error);
            throw new Error("Error validating password");
        }
    }

    // Generate OTP token
    generateOtp() {
        try {
            // generate 4 digit otp
            const otp = Math.floor(1000 + Math.random() * 9000).toString(); 

        return otp;
        } catch (error) {
            console.error('Error generating OTP token:', error);
            throw new Error("Error generating OTP token");
        }
    }
}

export default new AuthHelpers();