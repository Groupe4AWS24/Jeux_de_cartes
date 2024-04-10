const socketIo = require("socket.io");

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
      if (username) {
        socket.user = username;
        console.log(socket.id, socket.user);
        // Pour la connexion avec le front et le back
        // const player = new Player(username);
        // playerDetails[socket.id] = { player, isConnected: true };
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
        //game: new ManageGame([]), // Initialise le jeu sans joueurs pour l'instant
      };

      rooms[roomId] = newRoom;
      playerDetails[socket.id] = {
        roomId,
        //player: new Player(socket.user.username),
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
      console.log(`L'ancien ${newMsg.player} debite dans la room ${newMsg.room}: ${newMsg.message}`);
      io.to(newMsg.room).emit("message", newMsg);
    });

    // Permet au joueur de se déconnecter
    socket.on("disconnect", () => {
      console.log(`Joueur ${socket.id} deconnecté`);
    });

    // Permet à un joueur de rejoindre une room précise, tant que cette dernière existe et non remplie.
    socket.on("joinRoom", ({ roomId }) => {
      const room = rooms[roomId];
      // verifie que la room existe dans la liste de liste crée.
      if (!room) {
        socket.emit("error", "Room not found");
        return;
      }

      // verifie que la room n'est pas remplie
      if (room.players.length >= room.maxPlayers) {
        socket.emit("error", "Room is full");
        return;
      }

      // Ajoute le joueur à la liste des joueurs de la room
      room.players.push(socket.user.id);
      playerDetails[socket.id] = {
        roomId,
        //player: new Player(socket.user.username),
      };
      // rejoins la room
      socket.join(room.id);
      socket.emit("roomJoined", room.id);
      io.to(roomId).emit("playerJoined", socket.user);
    });
  });
}

module.exports = { setupSocket };
