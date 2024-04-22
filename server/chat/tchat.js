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

    // Permet au joueur de se déconnecter
    socket.on("disconnect", () => {
      console.log(`Joueur ${socket.id} deconnecté`);
      const details = playerDetails[socket.id];
      if (details) {
        const { roomId } = details;
        const room = rooms[roomId];
        if (room) {
          room.players = room.players.filter(
            ({ username }) => username !== details.player.name
          );
          if (room.players.length === 0) {
            // Supprime la room si elle est vide
            delete rooms[roomId];
          } else {
            console.log("roommmmm : ", details);
            io.to(roomId).emit("playerDisconnected", details.player.name);
          }
        }
        delete playerDetails[socket.id];
      }
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
}

module.exports = { setupSocket };
