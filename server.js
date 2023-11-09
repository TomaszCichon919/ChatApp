const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];
const logins = [];

app.get('/', (req, res) => {
    res.render('/index');
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
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

