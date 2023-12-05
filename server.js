const express = require('express');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/messages.model');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client')));
app.use(express.urlencoded({ extended: false }));

const messagesRoutes = require('./routes/messages.routes');

app.use('/api', messagesRoutes); 

const messages = [];
const logins = [];

app.get('/', (req, res) => {
    res.render('/index');
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);

app.use((req, res, next) => {
    req.io = io;
    next();
  });
  

// connects our backend code with the database
mongoose.connect('mongodb://0.0.0.0:27017/ChatApp', { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to the database');
  });
  db.on('error', err => console.log('Error ' + err));

io.on('connection', async (socket) => {
    console.log('New client! Its id – ' + socket.id);
    try {
        const messagesData =  await Message.find();
        socket.emit('messagesUpdated', JSON.stringify(messagesData));
        messages.push(JSON.stringify(messagesData));
        console.log('messages', messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
      }
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('join', (login) => {
        console.log('Oh, I\'ve got userName from ' + socket.id);
        logins.push({ id: socket.id, user: login.login });
        socket.broadcast.emit('newUser', login.login);

    });

    socket.on('disconnect', () => {
        const disconnectedUserIndex = logins.findIndex((user) => user.id === socket.id);
        if (disconnectedUserIndex !== -1) {
            const disconnectedUser = logins[disconnectedUserIndex];
            logins.splice(disconnectedUserIndex, 1);
            console.log('User disconnected:', disconnectedUser.login);
            console.log('users: ', logins);
            io.emit('userDisconnected', disconnectedUser.user);
        }
    });

    console.log('I\'ve added a listener on message and disconnect events \n');
});

// io.on('connection', async (socket) => {
//     console.log('New socket');
//     try {
//       const seatsData =  await Seat.find();
//       socket.emit('seatsUpdated', JSON.stringify(seatsData));
//     } catch (err) {
//       console.error('Error fetching seats:', err);
//     }
  
//     socket.on('disconnect', () => {
//       console.log('Client disconnected');
//     });
//   });