const express = require('express');
const socketIo = require('socket.io');
const http = require("http");
const jwt = require('jsonwebtoken');



const app = express();
const server = http.createServer(app);
const io = socketIo(server);


function authMiddleware(req,res,next) {
    const token = req.cookies;

    if(!token) {
        return res.status(401).json({message:'Token d\'authentification manquant'});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
        if(err) {
            return res.status(401).json({ message: 'Échec de l\'authentification. Token invalide' });
        }
        res.json(user);
        next();
    });
}







// Utilisation du middleware pour les routes protégées
app.get('/api/ressource-protégée', authMiddleware, (req, res) => {
    // La requête est authentifiée, vous pouvez accéder aux informations d'identification de l'utilisateur via req.userId
    // Traiter la demande pour la ressource protégée ici
});


















//app.use(express.static('public'));
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
});  










socket.on('createRoom', ({ token, maxPlayers }) => {
    const userId = verifyToken(token);                    // Vérifie le token et on obtient l'ID de l'utilisateur  verifyToken() ????
    if (!userId) {
        socket.emit('error', 'Token invalide');
        return;
    }

    const roomId = uuidv4();       // Génère un identifiant unique pour la room
    //const joinLink = `https://monjeu.com/rejoindre?roomId=${roomId}`;  //ou bien utiliser un token temporaire pour plus de precaution
    rooms[roomId] = {
        id: roomId,
        owner: userId,
        players: [userId],
        maxPlayers,
        game: null // La partie n'a pas encore commencé
    };

     // Ajoute le joueur à la room
    playerDetails[socket.id] = { roomId, player: new Player(userId) };       //

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
  
    // Vérifie si le nombre de joueurs est suffisant     (ça il étais déjà fait au code de startGame)
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

