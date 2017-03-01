'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { DB_URL } = require('./config.js');
const port = process.env.PORT || 3000;

app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);

app.use(cors());

mongoose.connect(DB_URL, error => error ? console.log(error) : console.log('connect'));

const { Message } = require('./models/Message');

io.on('connection', socket => {
  socket.on('message', data => {

    const newMsg = new Message(data);

    Message.find().limit(10).sort({_id: -1}).exec(function (err, results) {
        results.reverse();
        results.forEach(function (newMsg) {
            socket.emit('addMessage', data);
        });
    });

    io.emit('message', data);
  });
});

server.listen(port, () => {
  console.log('Server started at port', port);
});
