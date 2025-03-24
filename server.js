const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/real-time-textboxes', { useNewUrlParser: true, useUnifiedTopology: true });

const Textbox = mongoose.model('Textbox', {
  python: String,
  html: String,
  javascript: String
});

io.on('connection', (socket) => {
  console.log('Client connected');

  Textbox.findOne({}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('update-textboxes', data);
    }
  });

  socket.on('update-python', (data) => {
    Textbox.updateOne({}, { $set: { python: data } }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-python', data);
      }
    });
  });

  socket.on('update-html', (data) => {
    Textbox.updateOne({}, { $set: { html: data } }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-html', data);
      }
    });
  });

  socket.on('update-javascript', (data) => {
    Textbox.updateOne({}, { $set: { javascript: data } }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-javascript', data);
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
