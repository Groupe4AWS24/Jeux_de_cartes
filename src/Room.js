const express = require('express');
const socketIo = require('socket.io');
const http = require("http");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Génère des id uniques pour les rooms
const {authMiddleware} = require("./Middleware/Middleware.js")


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


// Structure pour suivre les rooms et les jeux associés
const rooms = {};
const playerDetails = {};

io.on('connection', (socket) => {
    console.log(`Nouveau joueur connecté: ${socket.id}`);
    socket.on('authenticate', (token) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
          if (!err) {
              const player = new Player(decoded.username);                    
              playerDetails[socket.id] = { player, isConnected: true };
              socket.emit('authenticated');
          } else {
              socket.emit('authenticationFailed', 'Échec de l’authentification.');
              socket.disconnect();
          }
      });
  });
});  


// Utilisation du middleware pour l'événement 'createRoom'
socket.on('createRoom', (data) => {
    authMiddleware(socket, (err) => {
        if (err) {
            // Gérer l'erreur d'authentification
            socket.emit('authenticationFailed', err.message);
            socket.disconnect();
        } else {
            // Le token JWT est valide, continuer avec la création de la salle
            const { maxPlayers } = data;
            const userId = socket.userId;
            const roomId = uuidv4();
            //const joinLink = `https://monjeu.com/rejoindre?roomId=${roomId}`;

            rooms[roomId] = {
                id: roomId,
                owner: userId,
                players: [userId],
                maxPlayers,
                game: null
            };

            playerDetails[socket.id] = { roomId, player: new Player(socket.username) };
            socket.join(roomId);
            socket.emit('roomCreated', { roomId });
        }
    });
});

// Utilisation du middleware pour l'événement 'joinRoom'
socket.on('joinRoom', (data) => {
    authMiddleware(socket, (err) => {
        if (err) {
            // Gérer l'erreur d'authentification
            socket.emit('authenticationFailed', err.message);
            socket.disconnect();
        } else {
            // Le token JWT est valide, continuer avec l'ajout du joueur à la salle
            const { roomId } = data;
            const userId = socket.userId;

            const room = rooms[roomId];
            if (!room) {
                socket.emit('error', 'Room non trouvée');
                return;
            }

            if (room.players.length >= room.maxPlayers) {
                socket.emit('error', 'Room pleine');
                return;
            }

            room.players.push(userId);
            playerDetails[socket.id] = { roomId, player: new Player(userId) };
            socket.join(roomId);

            socket.emit('roomJoined', roomId);
            socket.to(roomId).emit('playerJoined', userId);
        }
    });
});


socket.on('startGame', (data) => {
    authMiddleware(socket, (err) => {
        if (err) {
            // Gérer l'erreur d'authentification
            socket.emit('authenticationFailed', err.message);
            socket.disconnect();
        } else {
            // Le token JWT est valide, continuer avec l'ajout du joueur à la salle
            const { roomId } = data;
            const userId = socket.userId;
            const room = rooms[roomId];
    
            // Vérifie si la salle existe
            if (!room) {
                socket.emit('error', 'Room non trouvée');
                return;
            }
    
            // Vérifie si l'utilisateur est le créateur de la room
            if (room.owner !== userId) {
                socket.emit('error', 'Seul le créateur peut démarrer le jeu');
                return;
            }
  
            // Vérifie si le nombre de joueurs est suffisant
            if (room.players.length < room.maxPlayers) {
                socket.emit('error', 'Pas assez de joueurs');
                return;
            }
  
            // Initialiser le jeu
            const game = new ManageGame(room.players.map(id => playerDetails[id].player));
            room.game = game;
            game.executeGame(); 
  
            io.to(roomId).emit('gameStarted');
        }
    });
});

socket.on('disconnect', () => {
    const details = playerDetails[socket.id];
    if (details) {
        const { roomId } = details;
        const room = rooms[roomId];
        if (room) {
            room.players = room.players.filter(id => id !== details.player.id);
            if (room.players.length === 0) {
                // Supprime la room si elle est vide
                delete rooms[roomId];
            } else {
                io.to(roomId).emit('playerDisconnected', details.player.id);
            }
        }
        delete playerDetails[socket.id];
    }
  });
















