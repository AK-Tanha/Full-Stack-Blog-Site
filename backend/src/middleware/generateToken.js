const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET_KEY is not defined in environment variables");
            throw new Error("JWT configuration missing");
        }

        // Use .toString() on user._id to ensure it's a string in the payload
        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        return token;

    } catch (error) {
        console.error("Error generating token:", error.message);
        throw error;
    }
}

module.exports = generateToken;