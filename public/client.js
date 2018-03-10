const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
//envoie d'un message au server
const sendEl = document.querySelector('#send');

document.querySelector('#chat').style.visibility = 'hidden';

sendEl.addEventListener('click', (e) => {
  e.preventDefault();
  if (document.querySelector('#m').value.indexOf('/carouf') !== - 1) {
    getLocation();

    document.querySelector('#m').focus();
  } else {
    const message = {
      'text': document.querySelector('#m').value
    };

    document.querySelector('#m').value = '';
    if (message.text.trim().length !== 0) {
      socket.emit('chat-message', message);
    }
    document.querySelector('#m').focus();
  }
});
/**
 * Réception d'un message de service
 */
socket.on('service-message', (message) => {
  const messageService = document.createElement('li');
  const textnode = document.createTextNode(message.text);

  messageService.appendChild(textnode);
  document.querySelector('#messages').appendChild(messageService);
});

//reception d'un message du server
socket.on('chat-message', (message) => {
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(message.username + ': ' + message.text + ' (' + message.log + ')');

  nouveauMessage.appendChild(textnode);
  document.querySelector('#messages').appendChild(nouveauMessage);
});

//reception d'un message du bot youtube
socket.on('message-bot-youtube', (message) => {
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(`${message.username} :`);
  const titleString = document.createTextNode(message.title);

  const nouveauDiv = document.createElement('div');
  const nouveauImage = document.createElement('img');

  nouveauImage.setAttribute('src', message.urlVid);
  nouveauImage.setAttribute('id', message.id);

  nouveauImage.addEventListener('click', (e) => {
    e.preventDefault();
    const nouveauIframe = document.createElement('iframe');

    nouveauIframe.setAttribute('id', 'player');
    nouveauIframe.setAttribute('type', 'text/html');
    nouveauIframe.setAttribute('width', '650');
    nouveauIframe.setAttribute('height', '300');
    nouveauIframe.setAttribute('src', `http://www.youtube.com/embed/${message.id}`);
    document.querySelector('#messages').appendChild(nouveauIframe);
  });
  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(titleString);
  nouveauDiv.appendChild(nouveauImage);
  nouveauMessage.appendChild(nouveauDiv);
  document.querySelector('#messages').appendChild(nouveauMessage);
});

//reception d'un message du bot carrefour
socket.on('message-bot-carrouf', (message) => {
  document.querySelector('#m').value = '';
  const nouveauMessage = document.createElement('li');
  const textnode = document.createTextNode(`${message.username} :`);

  const nouveauIframe = document.createElement('iframe');

  nouveauIframe.setAttribute('src', `https://www.google.com/maps/embed/v1/place?key=AIzaSyBzhXQGlpp20V71dGCT_67REdUlWe-Gpog&q=${message.latitude},${message.longitude}`);
  nouveauIframe.setAttribute('width', '650');
  nouveauIframe.setAttribute('height', '300');

  nouveauMessage.appendChild(textnode);
  nouveauMessage.appendChild(nouveauIframe);
  document.querySelector('#messages').appendChild(nouveauMessage);
});

//connection utilisateur
const sendUser = document.querySelector('#logger');

sendUser.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('toto');
  const user = {
    'username': document.querySelector('#login input').value
  };

  if (user.username.length > 0) {
    document.querySelector('#chat').style.visibility = '';
    document.querySelector('#login').style.visibility = 'hidden';
    socket.emit('user-login', user);
    document.querySelector('#m').focus();
  }
});

function getLocation () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
}

function showPosition (position) {
  const message = {
    'text': document.querySelector('#m').value,
    'latitude': position.coords.latitude,
    'longitude': position.coords.longitude
  };

  console.log(message);
  socket.emit('chat-message', message);
}
