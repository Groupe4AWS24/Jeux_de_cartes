const Card = require("./Card");
const Player = require("./Player");
const UnoDeck = require('./UnoDeck');

/**
 * Module exports a ManageGame class representing the game manager for Uno.
 * @class
 */
module.exports = class ManageGame {
    /**
     * Constructor for the ManageGame class.
     * @constructor
     * @param {Array} players - An array of Player instances representing the players in the game.
     */
    constructor(players) {
        // Validate the number of players (must be between 2 and 4)
        if (players.length < 2 || players.length > 4) {
            // Handle the case where the number of players is not valid
            console.error("Le nombre de joueurs doit être compris entre 2 et 4.");
            return;
        }

        // Set the players array for the game
        this.players = players;

        // Initialize the hands of each player
        for (let player of players) {
            player.initializeHand();
        }

        // Set the current player to the first player in the array
        this.currentPlayer = this.players[0];

        // Create a new Uno deck for the game
        this.UnoDeck = new UnoDeck();

        // Set the initial last played card to null
        this.lastCard = null;

        // Variable to track the total penalty cards to take from the deck in the game
        this.sumPinition = 0;
    }
    
    /**
     * initializePlayerReferences - Function to establish player references.
     * Each player will have references to the next player and the previous player in the game.
     */
    initializePlayerReferences() {
        // Get the total number of players in the game
        const numPlayers = this.players.length;

        // Loop through all players to establish references
        for (let i = 0; i < numPlayers; i++) {
            // The current player for which we are establishing references
            let currentPlayer = this.players[i];

            // The next player, which will be the player at the next index in the array
            let nextPlayer = this.players[(i + 1) % numPlayers];

            // The previous player, which will be the player at the previous index in the array
            let previousPlayer = this.players[(i - 1 + numPlayers) % numPlayers];

            // Establish the reference from the current player to the next player
            currentPlayer.nextPlayer = nextPlayer;

            // Establish the reference from the current player to the previous player
            currentPlayer.previousPlayer = previousPlayer;
        }   
    }

    /**
     * GameStart - Function to start the Uno game.
     * Initializes player references, deals cards, and begins the game loop.
     */
    GameStart() {
        // Initialize player references for the game
        this.initializePlayerReferences();

        // Deal 7 cards to each player from the Uno deck
        this.UnoDeck.dealCards(this.players, 7);
    
        // Display a message indicating the start of the Uno game
        console.log('Le jeu Uno commence!');
    
        // Initialize a variable to control the game loop
        let val = 0;

        // Enter the game loop until a valid starting card is drawn
        while (val === 0) {
            // Draw a card from the Uno deck
            let card = this.UnoDeck.cards.pop();

            // Check if the drawn card is a special card
            if (card.isSpecialCard()) {
                // If it's a special card, put it back, shuffle the deck, and draw again
                this.UnoDeck.cards.push(card);
                this.UnoDeck.shuffle();
            } else {
                // If it's a regular card, set it as the last card and exit the loop
                this.lastCard = card;
                val = 1;
              }
        }

        // Display a message indicating the starting player's turn
        console.log("Le joueur " + this.currentPlayer.name + " tu vas commencer à jouer");
    }
    

    /**
     * canPlayOn - Determines if the given card can be played on the last played card.
     * Checks if the color, value, or special properties of the card match the last played card.
     * @param {Card} card - The card to check for playability.
     * @returns {boolean} - True if the card can be played, false otherwise.
     */
    canPlayOn(card) {
        return (
            // Check if the color of the card matches the color of the last played card
            card.color == this.lastCard.color || 
        
            // Check if the value of the card matches the value of the last played card
            card.value === this.lastCard.value || 
              
            // Check if the card is a Change Color card and the last card is not +4 or +2 and no one was pioched yet
            (card.isChangeColorCard() && this.sumPinition == 0 ) ||      // attention sur le cas de ChangeColor sur +4 carte
        
            // Check if the card is a Plus 4 card 
            (card.isPlus4Card() )
        );
    }

    /**
     * play - Handles the player's attempt to play cards in the Uno game.
     * Checks if the selected cards are playable, applies card effects, and updates game state accordingly.
     * @param {Card[]} cards - An array of cards the player is attempting to play.
    */
    play(cards) {
        // Retrieve the array of playable cards for the current player
        const playableCards = this.getPlayableCards();        //we can do this logique outside when we create the methode of play ...

        // Flag to track if a card with the same value has been played
        let playedSameValue = false;
    
        // Loop through each card the player is attempting to play
        for (const card of cards) {
            // Check if the card is playable
            if (playableCards.includes(card)) {
                // Check conditions for playing a card with the same color
                if (!playedSameValue && card.getColor() == this.lastCard.color && card.getValue() != this.lastCard.value) {
                    if (card.isPlus2Card()) {
                        sumPinition +=2;
                    }
                    // Play the card, update lastCard, and exit the loop
                    this.currentPlayer.removeFromHand(card);
                    this.lastCard = card;
                    break;
                } else {
                    // Check conditions for playing special cards
                    if (!playedSameValue && card.isChangeColorCard()) {
                            this.currentPlayer.removeFromHand(card);
                            this.lastCard = card;
                            playedSameValue = true;   
                    } else {
                        if (!playedSameValue && card.isPlus4Card()) {
                            this.currentPlayer.removeFromHand(card);
                            sumPinition += 4;
                            this.lastCard = card;
                            playedSameValue = true;
                        } else {
                            // Check conditions for playing a card with the same value
                            if (card.getValue() === this.lastCard.value) {
                                if (this.card.isPlus4Card()) {
                                    sumPinition += 4;
                                } else if(this.card.isPlus2Card() ) {
                                        sumPinition +=2;
                                }
                                this.currentPlayer.removeFromHand(card);
                                this.lastCard = card;
                                playedSameValue = true;
                            }
                        }
                    }          
                }
            } else {
                // Inform the player that the card is not playable
                console.log("Tu ne peux pas jouer cette carte " + card + " sur la carte " + this.lastCard + " !!");
                //il faut rejouer autre cartes
                //this.playTurn();
            }
        }

        // Check if the last played card is not a special card
        if(!this.lastCard.isSpecialCard()) {
            // Move to the next player
            this.moveToNextPlayer();
        } else {
            // Apply special card effects based on the type of special card played
            if(this.lastCard.isSkipCard()){
                this.skipNextPlayer();
            } else {
                if(this.lastCard.isReverseCard()) {
                    this.reverseGameDirection();
                } else if(this.lastCard.isPlus4Card()) {
                    this.plus4Card();
                } else if(this.lastCard.isPlus2Card()) {
                    this.plus2Card();
                }
            }
        }
    }

    /**
     * getPlayableCards - Retrieves an array of cards that the current player can play on the last played card.
     * Uses the canPlayOn function to filter the current player's hand.
     * @returns {Card[]} - An array of playable cards.
     */
    getPlayableCards() {
        // Use the canPlayOn function to filter the current player's hand for playable cards
        return this.currentPlayer.hand.filter(card => this.canPlayOn(card));
    }

    /**
     * reverseGameDirection - Reverses the direction of play in the Uno game.
     * Swaps the nextPlayer and previousPlayer references for each player in the game.
     */
    reverseGameDirection() {
        // Loop through each player in the game
        for (let currentPlayer of this.players) {
            // Swap the nextPlayer and previousPlayer references
            [currentPlayer.nextPlayer, currentPlayer.previousPlayer] = [currentPlayer.previousPlayer, currentPlayer.nextPlayer];
        }
    }

    /**
     * plus2Card - Handles the effect of playing a Plus 2 card in the Uno game.
     * Moves to the next player and enforces the penalty of dealing 2 cards from the Uno deck.
     * If the player has playable cards, display them and allow the player to choose.
     * If the player has no playable cards, deal 2 cards from the Uno deck to the next player, reset the penalty to zero, and move to the next player.
     */
    plus4Card() {
        // Move to the next player
        this.moveToNextPlayer();

        // Get playable cards for the current player
        const playableCards = this.getPlayableCards();

        // Check if the player has playable cards
        if (playableCards.length > 0) {
            // Display playable cards to the player and allow them to choose
            console.log("Playable cards: ", playableCards);

            // Here, we have to add logic to allow the player to choose cards to play
            const cardsToPlay = /* logic to get cards chosen by the player */

            // Play the chosen cards, and add the logic to sum the penalty
            this.play(cardsToPlay);
        } else {
            // If the player has no playable cards
            // Deal 4 cards from the Uno deck to the next player
            this.UnoDeck.dealCards(this.currentPlayer.nextPlayer, sumPinition);

            // Reset the total penalty to zero
            sumPinition = 0;

            // Move to the next player
            this.moveToNextPlayer();
        }
    }

    /**
     * plus2Card - Handles the effect of playing a Plus 2 card in the Uno game.
     * Deals 2 cards from the Uno deck to the next player in the game.
     */
    plus2Card() {
        // Move to the next player
        this.moveToNextPlayer();
    
        // Get playable cards for the current player
        const playableCards = this.getPlayableCards();
    
        // Check if the player has playable cards
        if (playableCards.length > 0) {
            // Display playable cards to the player and allow them to choose
            console.log("Playable cards: ", playableCards);

            // Here, we have to add logic to allow the player to choose cards to play
            const cardsToPlay = /* logic to get cards chosen by the player */
    
            // Play the chosen cards
            this.play(cardsToPlay);      // we have to add the logique of sum the penality
        } else {
            // If the player has no playable cards
            // Deal 2 cards from the Uno deck to the next player
            this.UnoDeck.dealCards(this.currentPlayer, sumPinition);
    
            // Reset the total penalty to zero
            sumPinition = 0;
    
            // Move to the next player
            this.moveToNextPlayer();
        }
    }

    /**
     * skipNextPlayer - Handles the effect of playing a Skip card in the Uno game.
     * Skips the next player's turn, informs them, and moves to the player after.
     */
    skipNextPlayer() {
        // Move to the player after the next player
        this.moveToNextPlayer();
    
        // Inform the skipped player about their skipped turn
        console.log(this.currentPlayer.name + " tu ne peux pas jouer, tu es sauté !! ");
    
        // Move to the player after the skipped player
        this.moveToNextPlayer();
    
        // Inform the current player that it's now their turn
        console.log("Maintenant c'est ton tour " + this.currentPlayer.name);
    }

    /*changeColor(color) {
        
    }*/

    /**
     * moveToNextPlayer - Moves the turn to the next player in the Uno game.
     * Updates the current player reference to be the player next in line.
     */
    moveToNextPlayer() {
        // Update the current player reference to be the player next in line
        this.currentPlayer = this.currentPlayer.nextPlayer;
    }

     /**
     * playTurn - Simulates a player's turn in the Uno game.
     * This method should be called each time a player takes a turn.
     */
    playTurn() {
        // Display the current player's hand
        console.log(`${this.currentPlayer.name}, voici ta main: `, this.currentPlayer.hand);

        // Display the last played card
        //console.log("Dernière carte jouée: ", this.lastCard);

        // Get playable cards for the current player
        const playableCards = this.getPlayableCards();

        // Check if the player has playable cards
        if (playableCards.length > 0) {
            // Display playable cards to the player and allow them to choose
            console.log("Cartes jouables: ", playableCards);

            // Here, you need to add logic to allow the player to choose cards to play
            let cardsToPlay = /* logique pour obtenir les cartes choisies par le joueur */

            // Play the chosen cards, and add the logic to sum the penalty
            this.play(cardsToPlay);
        } else {
            // If the player has no playable cards
            // Deal cards from the Uno deck to the current player
            this.UnoDeck.dealCards(this.currentPlayer, 1);

            // Inform the player about the dealt card
            console.log(`Tu as pioché une carte: ${this.currentPlayer.hand[this.currentPlayer.hand.length - 1]}`);

            // Move to the next player
            this.moveToNextPlayer();
        }
    }

    /**
     * executeGame - Main method to execute the Uno game.
     * This method should be called to start and run the entire Uno game.
     */
    executeGame() {
        // Start the Uno game
        this.GameStart();

        // Continue playing turns until the game ends
        while (!this.isGameEnd()) {
            // Display the current state of the game
            console.log("-------------------------------------------------------------");
            console.log("Tour actuel: ", this.currentPlayer.name);
            console.log("Carte en jeu: ", this.lastCard);
            console.log("-------------------------------------------------------------");

            // Simulate a player's turn
            this.playTurn();
        }

        // Display the winner of the game
        console.log("Le jeu est terminé! Le joueur " + this.currentPlayer.name + " a gagné!");
    }

    /**
     * isGameEnd - Checks if the Uno game has ended.
     * This method should be called after each turn to determine if the game is over.
     * @returns {boolean} - True if the game is over, false otherwise.
     */
    isGameEnd() {
        // Check if any player has an empty hand
        return this.currentPlayer.hand.length === 0;
    }

}

