const io = require("socket.io-client");
// Remplacez l'URL par l'adresse de votre serveur Socket.io
const socket = io("http://localhost:3000");

// Nom du joueur passé comme argument lors de l'exécution du script
const playerName = process.argv[2] || "JoueurAnonyme";

socket.on("connect", () => {
    console.log(`Connecté au serveur en tant que ${playerName}`);
    // Envoyer un événement pour rejoindre le jeu avec le nom du joueur
    socket.emit("joinGame", playerName);
});

// Écouter l'événement 'dealCards' pour recevoir la main du joueur
socket.on("dealCards", (hand) => {
    console.log(`${playerName}, voici ta main: `, hand.map(card => card.toString()));
});

// Écouter d'autres événements du jeu si nécessaire
// Par exemple, recevoir une mise à jour du jeu, la carte jouée par un autre joueur, etc.

socket.on("disconnect", () => {
    console.log('Déconnecté du serveur.');
});
