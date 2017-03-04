'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { DB_URL } = require('./config.js');
const port = process.env.PORT || 3000;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());

mongoose.connect(DB_URL, error => error ? console.log(error) : console.log('connect'));

const { Message } = require('./models/Message');

io.on('connection', socket => {

  Message.find({}).limit(10).sort({_id: 1})
    .then(messages => socket.emit('listMessages', messages));

  socket.on('message', data => {
    Message.create(data)
      .then(newMsg => io.emit('message', newMsg))
      .catch(console.log);
  });

});

server.listen(port, () => {
  console.log('Server started at port', port);
});
