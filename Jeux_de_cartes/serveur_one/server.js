const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { v4: uuidv4 } = require('uuid'); // Génère des id uniques pour les rooms
const ManageGame = require('../src/ManageGame');
const Player = require('../src/Player');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);


require('dotenv').config({ path: '../../../server/.env' });//dépend de l'emplacement de.env

const jwtSecret = process.env.JWT_SECRET;//dans les variables d'environment


// Structure pour suivre les rooms et les jeux associés
const rooms = {};
const games = {};
const playerDetails = {};//va stocker les details sur les joueurs connectés

app.use(express.static('src'));//Remplacer par index.html
app.get('/', (req, res) => {
   res.send('Bienvenue sur notre jeu Uno');//remplacer par l'emplacemet du front
});
// Middleware pour vérifier les tokens JWT des connexions Socket.IO
io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (cookies) {
      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (token) {
          jwt.verify(token, jwtSecret, (err, decoded) => {
              if (err) {
                  return next(new Error('Authentication error'));
              }
              socket.user = decoded;
              next();
          });
      } else {
          next(new Error('Authentication error: No token provided'));
      }
  } else {
      next(new Error('Authentication error: No cookies found'));
  }
});

io.on('connection', (socket) => {
  console.log(`Nouveau joueur connecté: ${socket.id}`);

  socket.on('createRoom', ({ maxPlayers }) => {
      if (!socket.user) {
          socket.emit('error', 'Authentication failed');
          return;
      }

      const roomId = uuidv4();
      const newRoom = {
          id: roomId,
          owner: socket.user.id,
          players: [socket.user.id],
          maxPlayers,
          game: new ManageGame([]), // Initialise le jeu sans joueurs pour l'instant
      };

      rooms[roomId] = newRoom;
      playerDetails[socket.id] = { roomId, player: new Player(socket.user.username) };

      socket.join(roomId);
      socket.emit('roomCreated', { roomId, joinLink: `https://monjeu.com/rejoindre?roomId=${roomId}` });
  });

  socket.on('joinRoom', ({ roomId }) => {
      if (!socket.user) {
          socket.emit('error', 'Authentication failed');
          return;
      }

      const room = rooms[roomId];
      if (!room) {
          socket.emit('error', 'Room not found');
          return;
      }

      if (room.players.length >= room.maxPlayers) {
          socket.emit('error', 'Room is full');
          return;
      }

      room.players.push(socket.user.id);
      playerDetails[socket.id] = { roomId, player: new Player(socket.user.username) };
      socket.join(roomId);

      socket.emit('roomJoined', roomId);
      io.to(roomId).emit('playerJoined', socket.user.username);
  });

    
  socket.on('startGame', ({ roomId }) => {
    // Pas besoin de vérifier le token ici, car `socket.user` est déjà défini si l'utilisateur est authentifié.
    if (!socket.user) {
        socket.emit('error', 'Authentication failed');
        return;
    }
  
    const room = rooms[roomId];
  
    // Vérifiez si l'utilisateur est le créateur de la room
    if (!room || room.owner !== socket.user.id) {
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
    game.GameStart();
  
    io.to(roomId).emit('gameStarted');
});


  
  socket.on('playCard', (card) => {
    // Identifier le joueur et la partie à partir des informations de la socket
    const player = rooms[socket.id];
    if (!player) {
        socket.emit('error', { message: "Joueur non trouvé." });
        return;
    }

    const game = games[player.room];
    if (!game) {
        socket.emit('error', { message: "Partie non trouvée." });
        return;
    }

    // Vérifier si c'est le tour du joueur
    if (game.getCurrentPlayer().id !== player.id) {
        socket.emit('error', { message: "Ce n'est pas votre tour." });
        return;
    }

    // Trouver la carte dans la main du joueur
    const cardIndex = player.hand.findIndex(c => c.color === card.color && c.value === card.value);
    if (cardIndex === -1) {
        socket.emit('error', { message: "Carte non trouvée dans votre main." });
        return;
    }
    const playedCard = player.hand[cardIndex];

    // Vérifier si la carte peut être jouée
    if (!game.canPlayCard(playedCard)) {
        socket.emit('error', { message: "Mouvement invalide." });
        return;
    }

    // Jouer la carte et l'appliquer à la logique du jeu
    game.playCard(playedCard, player);

    // Envoyer la mise à jour à tous les joueurs de la partie
    const update = game.getGameState();
    io.to(player.room).emit('gameStateUpdate', update);

    // Retirer la carte de la main du joueur
    player.removeFromHand(playedCard);

    // Envoyer la nouvelle main du joueur après avoir joué la carte
    socket.emit('handUpdate', player.getHand());

    // Vérifier la condition de victoire
    if (player.hand.length === 0) {
        game.endGame(player);
        io.to(player.room).emit('gameOver', { winner: player.name });
        
    } else {
        // Passer au joueur suivant
        game.nextTurn();
        const nextPlayer = game.getCurrentPlayer();
        io.to(player.room).emit('nextTurn', { nextPlayerName: nextPlayer.name });
    }
});

function endGame(roomId) {
  const room = rooms[roomId];
  if (room) {
      io.to(roomId).emit('gameEnded', { winner: room.game.getWinner() });
      delete rooms[roomId]; // Supprime la room
  }
}

function sendHandToAllPlayers() {
  gameState.players.forEach(player => {
    const hand = player.hand.map(card => {
      if (player.id === socket.id) {
        return card;
      } else {
        return { back: true };
      }
    });
    io.to(player.id).emit('handUpdate', hand);
  });
}

function distributeCards(room, currentSocketId) {//utiliser composant react de Thanu !
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

function updateGameState(gameId) {
  const gameState = games[gameId]; // obtenir l'état de la partie
  gameState.players.forEach(playerId => {
    io.to(playerId).emit('updateState', {});
  });
}

//un joueur pioche des cartes
socket.on('drawCards', (data) => {
  const { room, numberOfCards } = data;
  const game = games[room];
  if (game) {
      const player = rooms[socket.id];
      // Logique pour faire piocher les cartes au joueur
      // Après avoir mis à jour la main du joueur, redistribuer ses cartes
      distributeCards(room, socket.id);
  }
});

socket.on('disconnect', () => {
  const details = playerDetails[socket.id];
  if (details) {
    // Marquer le joueur comme déconnecté
    details.isDisconnected = true;

    // Informer les autres joueurs de la déconnexion
    const room = rooms[details.roomId];
    if (room) {
      io.to(details.roomId).emit('playerDisconnected', { playerId: details.player.id, username: details.player.name });
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


socket.on('reconnectPlayer', ({ userId, roomId }) => {
  // Trouver le joueur déconnecté correspondant
  const disconnectedPlayerDetails = Object.values(playerDetails).find(details => details.player.id === userId && details.roomId === roomId && details.isDisconnected);

  if (disconnectedPlayerDetails) {
    // Remettre à jour le socket.id pour le joueur qui se reconnecte
    playerDetails[socket.id] = { ...disconnectedPlayerDetails, isDisconnected: false };
    delete playerDetails[disconnectedPlayerDetails.socketId]; // Supprimer l'ancienne entrée

    disconnectedPlayerDetails.socketId = socket.id; // Mettre à jour avec le nouveau socket.id

    // Faire rejoindre le joueur à sa room
    socket.join(roomId);

    // Informer le joueur qu'il est reconnecté
    socket.emit('reconnected', { roomId, userId });

    // Informer les autres joueurs de la reconnexion
    io.to(roomId).emit('playerReconnected', { playerId: userId, username: disconnectedPlayerDetails.player.name });
  } else {
    // Gérer le cas où la reconnexion n'est pas possible (par exemple, le joueur n'existe pas)
    socket.emit('reconnectFailed', { message: "Reconnexion échouée. Le joueur ou la salle n'existe pas." });
  }
});

  


});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
