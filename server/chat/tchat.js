const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const socketIo = require("socket.io");


function setupSocket(server) {    
    const io = socketIo(server,  {
        cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
        }
      });
    const jwtSecret = "your_jwt_secret";
    const rooms = {};
    const playerDetails = {};
    io.on("connection", (socket) => {
        console.log(`Nouveau joueur connecté: ${socket.id}`);

        socket.on("authenticate", (username) => {
            if (username) {
                console.log(username)
                // const player = new Player(username);
                // playerDetails[socket.id] = { player, isConnected: true };
                io.emit("authenticated", "Authentification reussie");
            };
        });

        socket.on("message", (newMsg) => {
            console.log(`L'ancien ${newMsg.player} debite : ${newMsg.message}`);
            io.emit("message", newMsg);
        });
    
        socket.on("disconnect", () => {
            console.log(`Joueur ${socket.id} deconnecté`);
        })
        
    });

    // socket.on("createRoom", ({ token, maxPlayers }) => {
    //     const userId = verifyToken(token);
    //     const roomId = uuidv4();
    //     rooms[roomId] = {
    //     id: roomId,
    //     owner: userId,
    //     players: [userId],
    //     maxPlayers,
    //     game: null,
    //     };

    //     playerDetails[socket.id] = { roomId, player: new Player(userId) };

    //     socket.join(roomId);
    //     socket.emit("roomCreated", { roomId });
    // });

    // socket.on("joinRoom", ({ token, roomId }) => {
    //     const userId = verifyToken(token);
    //     if (!userId) {
    //     socket.emit("error", "Token invalide");
    //     return;
    //     }

    //     const room = rooms[roomId];
    //     if (!room) {
    //     socket.emit("error", "Room non trouvée");
    //     return;
    //     }

    //     if (room.players.length >= room.maxPlayers) {
    //     socket.emit("error", "Room pleine");
    //     return;
    //     }

    //     room.players.push(userId);
    //     playerDetails[socket.id] = { roomId, player: new Player(userId) };
    //     socket.join(roomId);

    //     socket.emit("roomJoined", roomId);
    //     socket.to(roomId).emit("playerJoined", userId);
    // });

    // // D'autres événements peuvent être gérés ici selon vos besoins

    // socket.on("disconnect", () => {
    //     const details = playerDetails[socket.id];
    //     if (details) {
    //     const { roomId } = details;
    //     const room = rooms[roomId];
    //     if (room) {
    //         room.players = room.players.filter((id) => id !== details.player.id);
    //         if (room.players.length === 0) {
    //         delete rooms[roomId];
    //         } else {
    //         io.to(roomId).emit("playerDisconnected", details.player.id);
    //         }
    //     }
    //     delete playerDetails[socket.id];
    //     }
    // });
    // });
}

module.exports = { setupSocket };