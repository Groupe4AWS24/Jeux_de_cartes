const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid'); // Génère des id uniques pour les rooms

const ManageGame = require('../src/ManageGame');
const Player = require('../src/Player');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static('public'));

// Remplacer 'your_jwt_secret' 
const jwtSecret = 'your_jwt_secret';
// Structure pour suivre les rooms et les jeux associés
const rooms = {};
const games = {};
const playerDetails = {};

app.use(express.static('public'));
app.get('/', (req, res) => {
   res.send('Bienvenue sur notre jeu Uno');
});

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

  socket.on('createRoom', ({ token, maxPlayers }) => {
    const userId = verifyToken(token); // Vérifie le token et on obtient l'ID de l'utilisateur
    if (!userId) {
        socket.emit('error', 'Token invalide');
        return;
    }

    const roomId = uuidv4();// Génère un identifiant unique pour la room
    const joinLink = `https://monjeu.com/rejoindre?roomId=${roomId}`;//ou bien utiliser un token temporaire pour plus de precaution
    rooms[roomId] = {
        id: roomId,
        owner: userId,
        players: [userId],
        maxPlayers,
        game: null // La partie n'a pas encore commencé
    };

    // Ajoute le joueur à la room
    playerDetails[socket.id] = { roomId, player: new Player(userId) };

    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
});

   
   socket.on('joinRoom', ({ token, roomId }) => {
    const userId = verifyToken(token);
    if (!userId) {
      socket.emit('error', 'Token invalide');
      return;
    }

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
    socket.to(roomId).emit('playerJoined', userId); // Prévient les autres joueurs
});


    
socket.on('startGame', ({ token, roomId }) => {
  const userId = verifyToken(token);
  const room = rooms[roomId];
  
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
  game.startGame(); 

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





/*//  un joueur pioche des cartes
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
*/
/*/  l'authentification des joueurs (à compléter avec la logique de vérification)
app.post('/login', async (req, res) => {
  // ... logique pour authentifier le joueur ...

  // Générer et envoyer le JWT si authentifié
  const token = jwt.sign({ playerId: player.id }, 'secret_key'); // Utilisez une clé secrète réelle
  res.json({ token });
});

// Middleware Socket.IO pour vérifier le JWT
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, 'secret_key');
    socket.playerId = decoded.playerId;
    next();
  } catch (e) {
    return next(new Error('Authentification échouée'));
  }
});*/
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
