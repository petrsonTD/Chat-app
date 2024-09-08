import Database from 'better-sqlite3';

const queryCreateMessages = `
  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL
  )
`;
const dataMessages = [
    {
        id: 'MfL40l4gIfyuXXBJXZu6l',
        message: 'First message.'
    }
];

const db = new Database('messages.db');

// dopping tables in database
db.exec(`
    DROP TABLE IF EXISTS messages;
`);
console.log('Tables deleted successfully.');

// creating tables in database
db.transaction(() => {
    db.prepare(queryCreateMessages).run();
})();
console.log('Tables created successfully.');

// inserting data to database
const insertMessages = db.prepare('INSERT INTO messages (id, message) VALUES (?, ?)');

db.transaction(() => {
    dataMessages.forEach(message => insertMessages.run(
        message.id,
        message.message
    ));
})();
console.log('Data inserted successfully.');

db.close();
