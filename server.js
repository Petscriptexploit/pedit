const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/real-time-textboxes', { useNewUrlParser: true, useUnifiedTopology: true });

const PythonTextbox = mongoose.model('PythonTextbox', { text: String });
const HtmlTextbox = mongoose.model('HtmlTextbox', { text: String });
const JavascriptTextbox = mongoose.model('JavascriptTextbox', { text: String });

io.on('connection', (socket) => {
  console.log('Client connected');

  PythonTextbox.findOne({}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('update-python', data.text);
    }
  });

  HtmlTextbox.findOne({}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('update-html', data.text);
    }
  });

  JavascriptTextbox.findOne({}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('update-javascript', data.text);
    }
  });

  socket.on('update-python', (data) => {
    PythonTextbox.updateOne({}, { text: data }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-python', data);
      }
    });
  });

  socket.on('update-html', (data) => {
    HtmlTextbox.updateOne({}, { text: data }, (err) => {
      if (err) {
        console.error(err);
      } else {
        io.emit('update-html', data);
      }
    });
  });

  socket.on('update-javascript', (data) => {
    JavascriptTextbox.updateOne({}, { text: data }, (err) => {
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
