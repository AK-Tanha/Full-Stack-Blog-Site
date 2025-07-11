const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verfyToken = (req, res, next)=>{
    try {
        //const token = req.cookies.token;
        const token = req.headers.authorization?.split(' ')[1] ; //barrier token
        if (!token) {
            return res.status(401).send({message: "no token provided"});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            res.status(401).send({message: "invalid token provided"});
        }
        req.userId = decoded.userId;
        //req.role = decoded.role;
        req.role = decoded.role;

        next();

    } catch (error) {
        console.error("error varify token", error),
        res.status(401).send({message: "invalid token"});
    }
} 

module.exports = verfyToken ;