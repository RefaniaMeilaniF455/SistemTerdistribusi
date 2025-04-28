// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws) {
  console.log('A client connected.');

  // Broadcast a notification about a new connection
  broadcast({ system: true, message: 'A new user has joined the chat!' });

  ws.on('message', function incoming(message) {
    // Broadcast user messages to all clients
    broadcast(JSON.parse(message));
  });

  ws.on('close', function close() {
    console.log('A client disconnected.');
    broadcast({ system: true, message: 'A user has left the chat.' });
  });
});

function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Server listen on port 3000 and bind to 0.0.0.0 for external access
server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://chat.naufal:3000');
});
