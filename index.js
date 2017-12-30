
'use strict';

// import express from 'express';
// import http from 'http';
// import WebSocketServer from 'uws';

const express = require('express');
const http = require('http');
const WebSocketServer = require('uws');

const PORT = process.env.PORT || 3000;

// Configure Express app
const app = express();

// Initialize a simple HTTP server
const server = http.createServer(app);

// Initialize a WebSocket server instance
const wss = new WebSocketServer.Server({ server });

wss.on('connection', (ws) => {

  // Connection is up, let's add a simple simple event
  ws.on('message', (message) => {

    // Log the received message and send it back to the client
    console.log('received: %s', message);

    const broadcastRegex = /^broadcast\:/;
    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, '');

      // Send back the message to the other clients
      wss.clients
        .forEach(client => {
          if (client != ws) {
            client.send(`Hello, broadcast message -> ${message}`);
          }
        });

    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });

  // Send immediately a feedback to the incoming connection
  ws.send('Hi folks, I am a WebSocket server');
});

server.listen(PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});