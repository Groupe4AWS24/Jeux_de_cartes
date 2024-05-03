import React, { useContext, useEffect, useState } from "react";
import back from "../assets/cartes/back.png";
import back_left from "../assets/cartes/back left.png";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/userContext";

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
export function Card({ valeur, playableCard, setShow, choice }) {
  const { socket } = useContext(UserContext);
  const { roomId } = useParams();
  const [imagePath, setImagePath] = useState("");
  let playable = "";
  if (playableCard !== undefined && playableCard !== null) {
    // if lenght = 0 => no playable card
    if (playableCard.length === 0) {
      playable = "cannotPlay";
    } else {
      for (const card of playableCard) {
        if (card.color === valeur.color && card.value === valeur.value) {
          playable = "";
          break;
        } else {
          playable = "cannotPlay";
        }
      }
    }
  }
  useEffect(() => {
    import(`../assets/cartes/${valeur.color}_${valeur.value}.png`)
      .then((image) => {
        //console.log(valeur, `${valeur.color}_${valeur.value}.png`);
        setImagePath(image.default);
      })
      .catch((error) => {
        //console.log("wee", valeur, `${valeur.color}_${valeur.value}.png`);
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
    if (
      event.currentTarget.parentElement.className !== "lastcard" &&
      event.currentTarget.classList.value == "card " &&
      !event.currentTarget.parentElement.className.includes("cannotPlay")
    ) {
      if (valeur.color === "withoutColor" || valeur.color === "allColors") {
        console.log("en petitetenue");
        setShow(true);
        waitForChoice().then((selectedColor) => {
          // Ici, vous pouvez faire ce que vous voulez avec la couleur sélectionnée
          console.log("Couleur sélectionnée :", selectedColor);
          // Mettez ici le code que vous souhaitez exécuter une fois que la couleur est sélectionnée
          setShow(false); // Cachez le sélecteur de couleur après que l'utilisateur a fait son choix
        });
        //while(choice==="") {console.log(choice)};
        //setShow(false);
        console.log(choice);
      }
      console.log("boulot");
      socket.emit("playCard", { cardPlayed: valeur });
    }
  };

  // Ajoutez cette fonction à l'intérieur de Page1.js
  const waitForChoice = () => {
    return new Promise((resolve, reject) => {
      console.log("Couleur :", choice);
      const interval = setInterval(() => {
        console.log("Couleur sélectionnée :", choice);
        if (choice !== "") {
          clearInterval(interval);
          resolve(choice);
        }
      }, 100000); // Vérifiez si le choix a été fait toutes les 100 millisecondes
      interval;
    });
  };

  // Valeur de la carte pour l'affichage, contenant sa couleur et la valeur, ex: "purple_1"
  return (
    <img
      className={`card ${playable}`}
      src={imagePath}
      onClick={handleCardClick}
    />
  );
}
