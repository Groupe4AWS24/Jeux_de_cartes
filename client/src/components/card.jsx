import React, { useEffect, useState } from "react";
import back from "../assets/back.png";
import back_left from "../assets/back left.png";
import purple from "../assets/purple_1.png";

/**
 * Crée la face d'une carte. Sera utilisé pour génerer les cartes des adversaires selon la vue du joueur.
 *
 * @return {JSX.Element} La face de la carte.
 */
export function BackCard(props) {
  const { joueur } = props;
  switch (joueur) {
    case 1:
      return <img className="back topside" src={back} />;

    case 2:
      return <img className="back leftside" src={back_left} />;

    case 3:
      return <img className="back rightside" src={back_left} />;

    default:
      return <img className="back drawcard" src={back} />;
  }
}

/**
 * Crée la carte avec sa couleur et sa valeur. Sera utilisé pour génerer les cartes du joueur.
 * Les cartes sont cliquables, ce qui permet de lancer une fonction handleCardClick. Nécessaire pour l'intégration visuel du jeu.
 *
 * @return {JSX.Element} La face de la carte. On retourne une balise image.
 */
export function Card({ valeur }) {
  const val = "purple_1";
  const [imagePath, setImagePath] = useState("");
  useEffect(() => {
    import(`../assets/${val}.png`)
      .then((image) => {
        setImagePath(image.default);
      })
      .catch((error) => {
        //console.error("Erreur de chargement de l'image :", error);
      });
  }, [valeur]);

  /**
   * Une fonction qui sera utilisé si une carte est cliquée.
   * Elle veriféra si la carte est jouable et la joue si oui.
   * A gérer.
   *
   */
  const handleCardClick = (event) => {
    // Si la card de la pioche
    if (!event.currentTarget.closest('.lastcard')) {
      console.log("boulot");
    } else {
      console.log("hehehehe")
    }
  };

  // Valeur de la carte pour l'affichage, contenant sa couleur et la valeur, ex: "purple_1"
  return <img className="card" src={imagePath} onClick={handleCardClick} />;
}
