const socketIo = require("socket.io");
const Player = require("../jeu/Player");
const ManageGame = require("../jeu/ManageGame");
function setupSocket(server) {
  // Paramétrage socket.io pour le serveur hebergé en local
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // Déclaration de plusieurs variables pour la gestion du jeu
  let roomId = 1;
  const rooms = {}; 
  const playerDetails = {};
  const disconnectedPlayers = {};

  // Le serveur via socket.io, va écouter si un joueur se connecte et initialise les fonctions internes.
  io.on("connection", (socket) => {
    // Pour le débugage
    console.log(`Nouveau joueur connecté: ${socket.id}`);

    // Lorsque le serveur écoute qu'un joueur s'est connecté et qu'il est authentifié (en envoyant sur username),
    // va modifier les informations du joueurs pour retenir son username. Et envoyer que ce dernier est bien connecté.
    socket.on("authenticate", (username) => {
      console.log(username);
      if (username) {
        socket.user = { username: username, id: socket.id };
        console.log(socket.id, socket.user);
        // Pour la connexion avec le front et le back
        io.emit("authenticated", "Authentification reussie");
      }
    });

    socket.on("endGameRequest", ({ roomId }) => {
      endGame(roomId);
    });

    socket.on("disconnect", () => {
      console.log(`Joueur ${socket.id} déconnecté`);
      handlePlayerDisconnect(socket.id, false);
    });

    

    

     //tentative de reconnexion 
    socket.on("reconnectAttempt", (username) => {
      handleReconnect(username, socket);
    });
  

    // Permet à un joueur de créer une nouvelle room, en choisiant le nombre de joueurs maximum.
    socket.on("createRoom", ({ maxPlayers }) => {
      const newRoom = {
        id: roomId,
        owner: socket.user,
        players: [socket.user],
        maxPlayers,
        gamestarted: false,
        game: null, // Initialise le jeu sans joueurs pour l'instant
      };

      rooms[roomId] = newRoom;
      console.log(socket.user);
      playerDetails[socket.id] = {
        roomId,
        player: new Player(socket.user.username),
      };

      // Permet au joueur de rejoindre une room
      socket.join(roomId);
      // Lui envoi l'informations de quelle room il a crée
      socket.emit("roomCreated", {
        roomId,
      });
      // augmente le compteur de roomId, pour avoir que des rooms différentes
      roomId += 1;
    });

    // Permet à un joueur d'envoyer un message au sein de sa room.
    socket.on("message", (newMsg) => {
      console.log(
        `L'ancien ${newMsg.player} debite dans la room ${newMsg.room}: ${newMsg.message}`
      );
      io.to(newMsg.room).emit("message", newMsg);
    });

  

    // Permet à un joueur de rejoindre une room précise, tant que cette dernière existe et non remplie.
    socket.on("joinRoom", ({ roomId }) => {
      const room = rooms[roomId];
      // verifie que la room existe dans la liste de liste crée.
      if (!room) {
        socket.emit("error", "Room not exists");
        return;
      }

      // verifie que la room n'est pas remplie
      if (room.players.length >= room.maxPlayers) {
        socket.emit("error", "Room is full");
        return;
      }

      if (room.gamestarted == true) {
        socket.emit("error", "Game already started");
        return;
      }

      // Ajoute le joueur à la liste des joueurs de la room
      room.players.push(socket.user);
      console.log("Liste des joueurs :", room.players);
      playerDetails[socket.id] = {
        roomId: parseInt(roomId),
        player: new Player(socket.user.username),
      };
      // rejoins la room
      socket.join(room.id);
      socket.emit("roomJoined");
      // rajouter dans le coté client qd joeur rejoint en updantant la liste des joueurs
      io.to(room.id).emit("playerJoined", socket.user.username);
    });

    socket.on("startGame", ({ roomId }) => {
      const room = rooms[roomId];

      // Vérifiez si l'utilisateur est le créateur de la room
      if (!room || room.owner.id !== socket.user.id) {
        socket.emit("error", "Seul le créateur peut démarrer le jeu");
        return;
      }

      // Vérifie si le nombre de joueurs est suffisant
      if (room.players.length < room.maxPlayers) {
        socket.emit("error", "Pas assez de joueurs");
        return;
      }

      // Initialiser le jeu
      room.gamestarted = true;
      const game = new ManageGame(
        room.players.map(({ id }) => playerDetails[id].player)
      );
      room.game = game;
      game.GameStart();

      console.log("Jeu commence: ", rooms);
      console.log("Jeu commence: Players :", room.players);
      console.log("Jeu commence: Game :", room.game);
      console.log("Jeu commence: Players :", room.game.players);
      console.log("Jeu commence: Deck :", room.game.UnoDeck);
      io.to(room.id).emit("gameStarted");
    });

    socket.on("GameHasStarted", ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        const start = room.players.map((player) => {
          const findplayer = room.game.players.find(
            (item) => item.name === player.username
          );
          if (findplayer) {
            return {
              username: findplayer.name,
              id: player.id,
              hand: findplayer.hand,
            };
          } else {
            return null;
          }
        }).filter((item) => item !== null);
        socket.emit("SendInfo", start)
      }
    });
  });


 /**
 * Termine le jeu en identifiant le gagnant et les classements des joueurs, envoie ces résultats à tous les joueurs,
 * affiche les résultats pendant un court délai, puis supprime la salle de jeu.
 * @param {number} roomId - L'identifiant de la salle à fermer.
 */
function endGame(roomId) {
  const room = rooms[roomId];
  if (!room) {
    console.error(`La salle ${roomId} n'existe pas.`);
    return;
  }

  // Identifiez le gagnant (premier à n'avoir plus de cartes) et les autres joueurs pour le classement
  const rankings = room.players.map(playerId => {
    const player = playerDetails[playerId];
    return {
      username: player.player.username,
      cardCount: player.player.hand.length
    };
  }).sort((a, b) => a.cardCount - b.cardCount);

  const winner = rankings.find(player => player.cardCount === 0);
  const results = {
    winner: winner ? winner.username : "Pas de gagnant",
    rankings
  };

  // Envoie les résultats à tous les joueurs dans la salle
  io.to(roomId).emit('gameResults', results);
  console.log(`Classements envoyés pour la salle ${roomId}. Gagnant: ${results.winner}`);

  // Arrêter tous les timers de déconnexion temporaires
  clearAllDisconnectTimers();

  // Donner un peu de temps pour que les joueurs voient les résultats
  setTimeout(() => {
    
    room.players.forEach(playerId => {// Nettoie la salle et les détails des joueurs 
      delete playerDetails[playerId];
    });
    delete rooms[roomId];
    console.log(`Salle ${roomId} supprimée après avoir affiché les résultats.`);
  }, 5000);  // Affiche les résultats pendant 5 secondes avant la suppression
}


  // abandon du jeu par un joueur
  socket.on("abandonGame", () => {
  const details = playerDetails[socket.id];
  if (details) {
      const { roomId } = details;
      const room = rooms[roomId];
      if (room) {
          
          room.players = room.players.filter(player => player.id !== socket.id);

          
          io.to(roomId).emit("playerAbandoned", { username: details.player.username });

         
          delete playerDetails[socket.id];
      }

   
      socket.disconnect();
  }
});

  
  function clearAllDisconnectTimers() {
    Object.keys(temporaryDisconnects).forEach(userId => {
      const details = temporaryDisconnects[userId];
      clearTimeout(details.timer);
      delete temporaryDisconnects[userId];
    });
    console.log("All disconnect timers have been cleared.");
  }
  
  function handleTemporaryDisconnect(user) {
    if (!temporaryDisconnects[user.id]) {
      temporaryDisconnects[user.id] = {
      username: user.username,
      roomId: playerDetails[user.id].roomId,
      missedTurns: 0,
      timer: setTimeout(() => {
        incrementMissedTurns(user.id);
      }, 60000) // 60 seconds timeout
    };
  }
}

function incrementMissedTurns(userId) {
  const details = temporaryDisconnects[userId];
  if (details) {
      details.missedTurns += 1;
      if (details.missedTurns > 1) {
          finalizeDisconnect(userId);
      } else {
          // Logique pour faire piocher une carte au joueur
          const game = rooms[details.roomId].game;
          if (game) {
              game.drawCard(details.player);
              io.to(details.roomId).emit('playerMissedTurn', { username: details.username, action: 'drawCard' });
          }
          // Reset du timer
          temporaryDisconnects[userId].timer = setTimeout(() => {
              incrementMissedTurns(userId);
          }, 60000); // Next 60 seconds for another chance
      }
  }
}


  function finalizeDisconnect(userId) {
  const details = temporaryDisconnects[userId];
  if (details) {
    clearTimeout(details.timer); // Arrêter le timer pour éviter les exécutions inutiles
    delete playerDetails[userId]; // Supprimer les détails du joueur du système
    delete temporaryDisconnects[userId]; // Retirer le joueur de la liste des déconnexions temporaires
    io.to(details.roomId).emit('playerPermanentlyDisconnected', details.username);
    console.log(`Finalizing disconnect for ${details.username}, timer stopped and user removed.`);
  }
}

function handleReconnect(username, socket) {
  const entries = Object.entries(temporaryDisconnects);
  const entry = entries.find(([_, value]) => value.username === username);
  if (entry) {
      const [userId, details] = entry;
      const room = rooms[details.roomId];
      // Vérifier si le jeu a commencé avant de permettre la reconnexion
      if (room && room.gamestarted) {
          clearTimeout(details.timer);
          delete temporaryDisconnects[userId];

          // Mettre à jour le socket.id dans playerDetails avec le nouveau socket.id
          if (playerDetails[userId]) {
              playerDetails[userId].id = socket.id; // Mettre à jour le socket.id
          } else {
              // Recréer les détails du joueur si nécessaire
              playerDetails[userId] = { username: username, id: socket.id };
          }

          socket.join(details.roomId);
          io.to(details.roomId).emit('playerReconnected', { username });
          console.log(`${username} reconnected with new socket ID ${socket.id}`);
      } else {
          console.log(`Reconnection refused for ${username}: Game has not started or the room no longer exists.`);
      }
  }

  function handlePlayerDisconnect(socketId, isAbandon) {
    const details = playerDetails[socketId];
    if (details) {
      const { roomId } = details;
      const room = rooms[roomId];
      if (room) {
        room.players = room.players.filter(player => player.id !== socketId);

        const eventMessage = isAbandon ? "playerAbandoned" : "playerDisconnected";
        io.to(roomId).emit(eventMessage, { username: details.player.username });

        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }
      delete playerDetails[socketId];
    }
    if (isAbandon) {
      // Déconnecter le socket s'il s'agit d'un abandon
      io.sockets.sockets.get(socketId)?.disconnect();
    }
  }
}

}
module.exports = { setupSocket };
