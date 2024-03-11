import React from 'react';

/**
 * Crée la face d'une carte. Sera utilisé pour génerer les cartes des adversaires selon la vue du joueur.
 *
 * @return {JSX.Element} La face de la carte.
 */
export function BackCard(props) {
    const joueur = props.joueur;
    switch (joueur) {
        case 1: return (
            <img className="back leftside" src="src/assets/back.png"/>
        )

        case 2: return (
            <img className="back topside" src="src/assets/back.png"/>
        )

        case 3: return (
            <img className="back rightside" src="src/assets/back.png"/>
        )

        default : return (
            <img className="back" src="src/assets/back.png"/>
        )
    }
    
}

/**
 * Crée la carte avec sa couleur et sa valeur. Sera utilisé pour génerer les cartes du joueur.
 * Les cartes sont cliquables, ce qui permet de lancer une fonction handleCardClick. Nécessaire pour l'intégration visuel du jeu.
 *
 * @return {JSX.Element} La face de la carte. On retourne une balise image.
 */
export function Card(props) {

    /**
     * Une fonction qui sera utilisé si une carte est cliquée. 
     * Elle veriféra si la carte est jouable et la joue si oui.
     * A gérer.
     * 
     */
    const handleCardClick = () => { 
        null
    };

    // Valeur de la carte pour l'affichage, contenant sa couleur et la valeur, ex: "purple_1"
    const valeur = props.valeur;
    return (
        <img className="card" src={`src/assets/${valeur}.png`} onClick={handleCardClick}/>
    )
}