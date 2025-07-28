
import jwt from 'jsonwebtoken';

export const getClientIP = (req) => {
    return req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-forwarded'] || 
        req.headers['x-client-ip'] ||
        req.headers['forwarded-for'] ||
        req.headers['forwarded'] ||
        req.socket?.remoteAddress ||
        req.ip;
};



export const tokenGeneratorForAdmin = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_FOR_ADMIN, {
        expiresIn: process.env.JWT_EXPIRES_IN_ADMIN
    });
};