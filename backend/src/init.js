import Database from 'better-sqlite3';

const queryCreateUsers = `
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rank TEXT
  )
`;

const queryCreateMessages = `
  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    userId TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
  )
`;

const dataUsers = [
    {
        id: 'gyI9yLoCqORuaTNKQGbOB',
        username: 'admin',
        password: '$2a$12$.DITuqJ5CIjnUhhQ0y0xYOlGIaxmYy32Vjoh8MUGgkYq5pxd.WzbW', //Heslo0
        rank: 'admin',
    },
    {
        id: 'T8GR9k-4z4ii0kQYRLWK8',
        username: 'user1',
        password: '$2a$12$a74M6nj0tCIiEQYzEIptJ.r6ByimUL815uTRdOV6lgEq1X3GZuWXq', //Heslo1
        rank: 'user',
    }
];

const dataMessages = [
    {
        id: 'MfL40l4gIfyuXXBJXZu6l',
        message: 'First message.',
        userId: 'gyI9yLoCqORuaTNKQGbOB'
    }
];

const db = new Database('chat.db');

// dopping tables in database
db.exec(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS messages;
`);
console.log('Tables deleted successfully.');

// creating tables in database
db.transaction(() => {
    db.prepare(queryCreateUsers).run();
    db.prepare(queryCreateMessages).run();
})();
console.log('Tables created successfully.');

// inserting data to database
const insertUser = db.prepare('INSERT INTO users (id, username, password, rank) VALUES (?, ?, ?, ?)');
const insertMessages = db.prepare('INSERT INTO messages (id, message, userId) VALUES (?, ?, ?)');

db.transaction(() => {
    dataUsers.forEach(user => insertUser.run(
        user.id,
        user.username,
        user.password,
        user.rank
    ));
    dataMessages.forEach(message => insertMessages.run(
        message.id,
        message.message,
        message.userId
    ));
})();
console.log('Data inserted successfully.');

db.close();
