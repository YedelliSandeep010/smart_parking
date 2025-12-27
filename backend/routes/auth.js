// D:\Smart_parking\server\routes\auth.js (Middleware/Auth Logic)

const jwt = require('jsonwebtoken');
const userModel = require('../models/User'); // Path to your User model

// --- MIDDLEWARE FUNCTION ---
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Attach user information to the request object (req.user)
            req.user = await userModel.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// --- AUTH LOGIC (Optional, but shows correct structure) ---

// Your original registerUser (if you want to keep it here, it needs its own imports/logic)
/*
const registerUser = async (req, res) => {
    // ... your register logic here
};
*/


// EXPORTS (Exports the protect function used in index.js line 76)
// Add other functions if they exist in this file (like register or login)
module.exports = { 
    protect,
    // registerUser,
    // loginUser,
};