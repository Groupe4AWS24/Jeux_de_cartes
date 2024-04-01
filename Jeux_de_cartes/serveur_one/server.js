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
// Remplacer 'your_jwt_secret' par la vraie clé secrète utilisée pour signer les JWT
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
                // Créer une nouvelle instance Player pour ce socket avec le nom d'utilisateur décodé du Token
                const player = new Player(decoded.username);
                player.socketId = socket.id; // Associez l'ID de socket au joueur pour les futurs références, permet de lier les actions du joueurs à sa connexion websocket
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
          // Ajoute chaque joueur à la partie
          Object.values(rooms).forEach(player => {
              if (player.room === room) { // on s'assure que le joueur est dans la bonne room
                  game.addPlayer(player);
              }
          });
          if (game.players.length >= 2) { // Vérifie le nombre de joueurs
              game.start();
              io.to(room).emit('gameStarted', 'Le jeu a commencé.');
              game.players.forEach(player => distributeCards(room, player.socketId)); // Distribue les cartes
          } else {
              socket.emit('waitingForPlayers', 'En attente de plus de joueurs...');
          }
      }
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
});
*/