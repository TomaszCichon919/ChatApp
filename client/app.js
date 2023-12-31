const socket = io();

const loginForm = document.getElementById("welcome-form");
const messagesSection = document.getElementById("messages-section");
const messagesList = document.getElementById("messages-list");
const addMessageForm = document.getElementById("add-messages-form");
const userNameInput = document.getElementById("username");
const messageContentInput = document.getElementById("message-content");

let userName = '';

const messageSound = new Audio('beep.wav'); 

window.addEventListener('DOMContentLoaded', async () => {
  try {
      // Fetch messages from the database
      const response = await fetch('/api/messages');
      const data = await response.json();
      
      // Iterate over the messages and display them
      data.forEach((message) => {
          addMessage(message.author, message.content);
      });
  } catch (error) {
      console.error('Error fetching previous messages:', error);
  }
});

const playMessageSound = () => {
  messageSound.play();
};

const login = (event) => {
    event.preventDefault();
    const userNameValue = userNameInput.value;
    if (!userNameValue) {
        alert('Please input Name')
    } else {

        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        userName = userNameValue;
        socket.emit('join', { login: userName })
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
    if (author !== userName) {
      playMessageSound();
    }
    messagesList.appendChild(message);
}

const userLog = (user, content) => {

    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    message.innerHTML = `
      <h3 class="message__author">Chat Bot</h3>
      <div class="message__content">
        <p class="message_chatbot">${user}  ${content}</p>
      </div>
    `;
    messagesList.appendChild(message);

}

const sendMessage = async (event) => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
      alert('Please input message');
  } else {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', { author: userName, content: messageContent });
      messageContentInput.value = '';

      try {
          // Save the message to the database
          await fetch('/api/messages', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ author: userName, content: messageContent }),
          });
      } catch (error) {
          console.error('Error saving message:', error);
      }
  }
};
  
   

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', (user) => userLog(user, "has joined the conversation"));
socket.on('userDisconnected', (disconnectedUser) => userLog(disconnectedUser, "has left the conversation.."));

