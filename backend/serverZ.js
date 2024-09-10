import { WebSocketServer } from 'ws';
import Database from 'better-sqlite3';
import { nanoid } from 'nanoid';

const db = new Database('chat.db');
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Fetch and send all previous messages to the new client
    try {
        const selectQuery = db.prepare('SELECT * FROM messages');
        const previousMessages = selectQuery.all();

        // Send messages as an array or individually to the new client
        previousMessages.forEach((row) => {
            ws.send(row.message);
        });
    } catch (error) {
        console.error('Failed to retrieve messages:', error);
        ws.send('Error retrieving previous messages. Please try again later.');
    }

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        try {
            const createQuery = db.prepare('INSERT INTO messages (id, message) VALUES (?, ?)');
            createQuery.run(nanoid(), message);
        } catch (error) {
            console.log('Error, please try later.');
        }
    
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
