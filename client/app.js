const socket = io();

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = '';

const login = (event) => {
    event.preventDefault();
    const userNameValue = userNameInput.value;
    if (!userNameValue) {
        alert('Please input Name')
    } else {

        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        userName = userNameValue;
        socket.emit('join', {login: userName})
    }
}


const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author}</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
}

const sendMessage = (event) => {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if (!messageContent.length) {
        alert('Please input message')
    } else {
        addMessage(userName, messageContentInput.value)
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value = '';
    }
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) => newUser(user));
socket.on('userDisconnected', (disconnectedUser) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    message.innerHTML = `
        <h3 class="message__author">Chat Bot</h3>
        <div class="message__content">
            <p class="message_chatbot">${disconnectedUser} has left the conversation...</p>
        </div>
    `;
    messagesList.appendChild(message);
});


const newUser = (user) => {

    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    message.innerHTML = `
      <h3 class="message__author">Chat Bot</h3>
      <div class="message__content">
        <p class="message_chatbot">${user} Has joined the conversation!</p>
      </div>
    `;
    messagesList.appendChild(message);

}
