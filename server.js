// Tout d'abbord on initialise notre application avec le framework Express 
// et la bibliothèque http integrée à node.
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use('/', express.static(__dirname + '/public'));

// On lance le serveur en écoutant les connexions arrivant sur le port 3000


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    console.log('message : ' + message.text);
  });
});
http.listen(3000, function(){
    console.log('Server is listening on *:3000');
});