import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { NotAuthError } from './errors.js';

const KEY = 'supersecret';

export function createJSONToken(userId, username, isAdmin) {
    return jsonwebtoken.sign({ userId, username, isAdmin }, KEY, { expiresIn: '1h' });
}

export function validateJSONToken(token) {
    return jsonwebtoken.verify(token, KEY);
}

export function isValidPassword(password, storedPassword) {
    return bcryptjs.compare(password, storedPassword);
}

export function checkAuthMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (!req.headers.authorization) {
        console.log('NOT AUTH. AUTH HEADER MISSING.');
        return next(new NotAuthError('Not authenticated.'));
    }
    const authFragments = req.headers.authorization.split(' ');

    if (authFragments.length !== 2) {
        console.log('NOT AUTH. AUTH HEADER INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    const authToken = authFragments[1];
    try {
        const validatedToken = validateJSONToken(authToken);
        console.log('validatedToken', validatedToken);
        req.token = validatedToken;
    } catch (error) {
        console.log('NOT AUTH. TOKEN INVALID.');
        return next(new NotAuthError('Not authenticated.'));
    }
    next();
}
