const io = require('socket.io-client');

// Assurez-vous que l'adresse correspond à l'URL de votre serveur
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connecté au serveur avec succès!');

    // Étape 1: Créer une salle
    console.log('Tentative de création de salle...');
    socket.emit('createRoom', { maxPlayers: 4 });
});

// Écouter la confirmation de la création de la salle
socket.on('roomCreated', (data) => {
    console.log('Salle créée avec succès:', data);

    // Étape 2: Rejoindre la salle créée
    console.log('Tentative de rejoindre la salle...');
    socket.emit('joinRoom', { roomId: data.roomId });
});

// Écouter l'événement de démarrage du jeu
socket.on('gameStarted', () => {
    console.log('Le jeu a commencé!');
    // Simuler d'autres actions ici, comme jouer une carte
});

// Écouter les mises à jour de l'état du jeu
socket.on('gameStateUpdate', (update) => {
    console.log('Mise à jour de l’état du jeu:', update);
});

// Écouter les messages d'erreur
socket.on('error', (error) => {
    console.log('Erreur reçue:', error);
});

// Gérer les erreurs de connexion
socket.on('connect_error', (error) => {
    console.log('Erreur de connexion:', error);
});

// Gérer la déconnexion
socket.on('disconnect', (reason) => {
    console.log(`Déconnecté: ${reason}`);
});
