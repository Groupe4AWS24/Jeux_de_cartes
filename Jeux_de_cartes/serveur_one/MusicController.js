/*const socketIO = require('socket.io');

class MusicController {
  constructor(server) {
    this.io = socketIO(server);
    this.setupSocket();
  }

  setupSocket() {
    this.io.on('connection', (socket) => {
      console.log(`Nouveau joueur connecté: ${socket.id}`);

      // Synchroniser la playlist lorsque les joueurs rejoignent la room
      socket.on('joinRoom', (roomId) => {
        const roomPlaylist = getRoomPlaylist(roomId); // Fonction à implémenter pour récupérer la playlist de la room
        socket.emit('syncPlaylist', roomPlaylist);
      });

      // Gérer d'autres événements Socket.IO ici...
    });
  }
}

module.exports = MusicController;
*/