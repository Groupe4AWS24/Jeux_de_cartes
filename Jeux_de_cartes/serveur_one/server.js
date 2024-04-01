
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const ManageGame = require('../src/ManageGame');
const Player = require('../src/Player');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));
// Remplacez 'your_jwt_secret' par votre réelle clé secrète utilisée pour signer les JWT
const jwtSecret = 'your_jwt_secret';
app.get('/', (req, res) => {
    res.send('Bienvenue sur notre jeu Uno');
});
// Structure pour suivre les rooms et les jeux associés
const rooms = {};
const games = {};
io.on('connection', (socket) => {
    console.log(`Nouveau joueur connecté: ${socket.id}`);
    socket.on('authenticate', (token) => {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                socket.emit('authenticationFailed', 'Échec de l’authentification.');
                socket.disconnect();
            } else {
                console.log(`Joueur authentifié : ${decoded.username} (ID: ${socket.id})`);
                // Créez une nouvelle instance Player pour ce socket
                const player = new Player(decoded.username);
                player.socketId = socket.id; // Associez l'ID de socket au joueur pour référence future
                rooms[socket.id] = player;
                socket.emit('authenticated', 'Vous êtes connecté.');
            }
        });
    });
    socket.on('joinRoom', (room) => {
        if (!games[room]) {
            games[room] = new ManageGame([]);
            console.log(`Nouvelle room créée: ${room}`);
        }
        socket.join(room);
        console.log(`${rooms[socket.id].username} a rejoint la room ${room}`);
        io.to(room).emit('newPlayer', `${rooms[socket.id].username} a rejoint la room.`);
    });
    socket.on('startGame', (room) => {
        const game = games[room];
        if (game) {
            game.addPlayer(rooms[socket.id]);
            if (game.players.length >= 2) { // Assurez-vous d'avoir au moins 2 joueurs
                game.start();
                io.to(room).emit('gameStarted', 'Le jeu a commencé.');
                distributeCards(room);
            } else {
                socket.emit('waitingForPlayers', 'En attente de plus de joueurs...');
            }
        }
    });
    socket.on('disconnect', () => {
        console.log(`Joueur déconnecté: ${socket.id}`);
        // Retirer le joueur de sa room et de la partie
        const playerName = rooms[socket.id] ? rooms[socket.id].username : 'Un joueur';
        Object.keys(games).forEach(room => {
            const game = games[room];
            game.removePlayer(rooms[socket.id]);
            io.to(room).emit('playerLeft', `${playerName} a quitté la room.`);
        });
        delete rooms[socket.id];
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
function distributeCards(room, currentSocketId) {
  const game = games[room];
  if (game) {
      game.players.forEach(player => {
          const hand = player.getPlayerHand().map(card => {
              return {
                  color: card.color,
                  value: card.value,
                  faceUp: player.socketId === currentSocketId // Les cartes sont de face seulement pour le propriétaire
              };
          });
          io.to(player.socketId).emit('updateHand', hand);
      });
  }
}