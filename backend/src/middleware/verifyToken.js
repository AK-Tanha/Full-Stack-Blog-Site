const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ message: "No Authorization header provided" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }

        const JWT_SECRET = process.env.JWT_SECRET_KEY;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET_KEY is not defined in environment variables");
            return res.status(500).send({ message: "Internal server error: JWT configuration missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).send({ message: "Invalid token: User ID missing" });
        }

        req.userId = decoded.userId;
        req.role = decoded.role;

        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: "Token has expired" });
        }
        res.status(401).send({ message: "Invalid token" });
    }
}

module.exports = verifyToken;