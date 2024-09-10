import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';
import bcryptjs from 'bcryptjs';
import { createJSONToken, isValidPassword } from '../utils/auth.js';

const db = new Database('chat.db');

// login
export const login = async (req, res) => {
    const { username, password } = req.body;

    const getQuery = db.prepare('SELECT * FROM users where username = ?');
    const user = getQuery.get(username);

    if (!user) {
        return res.status(400).json({ error: 'Bad username or password!' });
    }

    const pwIsValid = await isValidPassword(password, user.password);

    if (!pwIsValid) {
        return res.status(400).json({ error: 'Bad username or password!' });
    }

    const token = createJSONToken(user.id, user.rank === 'admin'); //TODO add to TOKEN isAdmin

    res.status(200).json({
        username: username,
        isAdmin: user.rank === 'admin',
        token: token
    });
};

// signup
export const signup = async (req, res) => {
    const { username, password } = req.body;
    let errors = {};

    const getQuery = db.prepare('SELECT * FROM users where username = ?'); //TODO create function that will chceck it
    const user = getQuery.get(username);

    if (user) {
        errors.username = 'Username already exists.';
    }

    if (password.length < 6) {
        errors.password = 'Ivalid password. Must be at least 6 characters long.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            message: 'User signup failed due to validation errors.',
            errors,
        });
    }

    const newUserId = nanoid();
    const hashedPw = await bcryptjs.hash(password, 12);

    const createQuery = db.prepare('INSERT INTO users (id, username, password, rank) VALUES (?, ?, ?, ?)'); //TODO create function that will do it all
    const newUser = createQuery.run(newUserId, username, hashedPw, 'user');
    const token = createJSONToken(newUserId, false);
    res.status(201).json({
        username: username,
        isAdmin: false,
        token: token
    });
};
