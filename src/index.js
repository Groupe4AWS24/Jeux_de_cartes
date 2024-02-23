const Card = require("./Card");
const Deck = require("./Deck");
const ManageGame = require("./ManageGame");
const Player = require("./Player");
const SpecialCards = require("./SpecialCards");

var player1 = new Player("Daoud");
var player2 = new Player("Aissa");
var player3 = new Player("Rostom");
var player4 = new Player("Ahmed");

//console.log(player1);
//console.log(player2);

const players = [player1, player2 , player3 , player4];

var manageGame = new ManageGame(players);
//console.log(manageGame);


manageGame.GameStart();

//console.log(player1.nextPlayer.name);
//console.log(player1.previousPlayer.name);

//console.log(manageGame.lastCard);

manageGame.skipNextPlayer();
