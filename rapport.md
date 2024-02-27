# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire à UNO qui différe sur certaines règles (on peut enchainer plusieurs fois la même carte, pas de régle d'échange de carte...).  

Il sera également possible de communiquer via un tchat. un système d'authentification sera mis en place pour identifier de façon relativement sécurisé un joueur.

## Progrès Réalisé 
  Nous avons commencé par choisir les technologies sur lequel on va réaliser le projet, pour le coté du front-end (interface du site), on a décidé d'utiliser le framework React étant un des framework les plus populaires, donc celui qui a le plus de documentation, pour la gestion du projet il sera utilisé avec Vite au lieu du CRA, principalement pour le temps qui nous fait gagner (temps de démérage et application des modifications).  

  Pour gérer la base de donnés du système d'authentification, on utilisera du NOSQL via MangoDB, on priviligie cette approche par rapport à un hebergemet via firebase à cause de la limitation du nombre de requête par jour pour la version gratuit.

  Pour le coté du serveur, on passera par Node.js et son framework express.js pour facilité la créations des serveurs et du gestion des requetes HTTP.
  
  Dans un premier temps,  on a développé la direction artisque de notre jeu, en réalisant plusieurs proposition pour les cartes, et une maquette du jeu, l'objectif était d'avoir une maquette assez simpliste qui nous permettra de l'intégré le plus rapidement possible.
  
  Puis pour l'intégration du projet, on a décidé de principalement se concentré sur la logique du jeu et réalisé toutes les fonctions essentiels. Cependant on a aussi commencé a réaliser l'intégration de la maquette via React, par des fonctions qui gérer la création de cartes, et de la main, et sur la réflexion de la stratégie à mettre en place pour la dispositons des élements.
  
  Pour la communication client-serveur, on a opté pour Socket.io, une bibliothèque facilitant les communications en temps réel, mais il fournit également des fonctionnalités supplémentaires comme la reconnexion automatique, la diffusion à plusieurs clients, et le support des rooms, des notions majeurs pour un jeu multijoueur.


##Maquette

Maquette pour les cartes:
