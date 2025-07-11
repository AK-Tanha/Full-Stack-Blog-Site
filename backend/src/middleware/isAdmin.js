const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next)=>{
    if (req.role !== 'admin') {
        return res.status(403).send({ success: false, message:"only an admin can perform this action"})
    }
    next();
}

module.exports = isAdmin;
