import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token= req.cookies.jwt;
        if(!token) {
            return res.status(401).json({msg: 'No token, authorization denied'});
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decode) {
            return res.status(401).json({msg: 'Token is not valid'});
        }
        const user = await User.findById(decode.userId).select('-password');
        if(!user) {
            return res.status(401).json({msg: 'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware", error);
        return res.status(500).json({ msg: 'Server error in auth middleware' });
    }
}