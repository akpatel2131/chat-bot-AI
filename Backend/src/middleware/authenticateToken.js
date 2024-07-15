const JWT = require("jsonwebtoken");

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Extract authorization header from request
    const authHeaders = req.headers["authorization"];
    
    // Extract JWT token from authorization header
    const token = authHeaders && authHeaders.split(" ")[1];
        
    // If token is not present, send 401 Unauthorized status
    if (!token) {
        return res.sendStatus(401);
    }

    // Verify JWT token
    JWT.verify(token, process.env.JWT_SECRET, (error, user) => {
        // If token verification fails, send 403 Forbidden status
        if (error) return res.sendStatus(403);
        
        // If token verification succeeds, attach user object to request and call next middleware
        req.user = user;
        next();
    });
}



module.exports = authenticateToken;