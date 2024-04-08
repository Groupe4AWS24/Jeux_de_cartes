# Projet AWS : One, jeu de cartes

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire au UNO, nommé One, différant sur certaines règles (enchaînement plusieurs fois de la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de manière relativement sécurisée.

## Ce qui a été réalisé les semaines passées

Dans un premier temps, nous avons développé la direction artistique et la logique de notre jeu. Un système d'authentification a été réalisé avec React, ExpressJS et MongoDB. En parallèle, nous avons commencer l'intégration de la gestion des serveurs avec Socket.io.

## Progrès Réalisés 

Cette dernière semaine, chaque personne avait une tâche précise, ce qui nous a permis d'avancer efficacement sur notre projet.

Tout d'abord, nous avons peaufiné l'authentification en lui rajoutant une option de "mot de passe oublié", le joueurs est redirigé vers une page où il saisit son mail, pour recevoir un lien unique limité dans le temps grâce à nodeMailer et JWTokens.  
Le lien redirige vers une page pour réinitialiser son mot de passe, qui s'appliquera sur la base de données de MongoDB.  

Ensuite, pour consolider la gestions des serveurs, nous avons implémenter un tchat en utilisant les fonctionnialité de socket.io (au lieu de WebSocket pour sa facilité d'utilisation), permettant aux joueurs de pouvoir communiquer entre eux.

Ensuite, la finition de gestion des serveurs a été un objectif à atteindre pour cette semaine. On a ajouter un middleware d'authentification pour vérifier si le client est déjà authentifié avant d'exécuter toute action sur la plateforme. Sinon, une erreur d'autorisation sera renvoyée. Outre la gestion des déconnexions, un mécanisme de reconnexion a été élaboré pour permettre aux joueurs de rejoindre à nouveau la partie en cas de coupure Internet ou de fermeture accidentelle du navigateur. Ce système nécessite de garder une trace des joueurs actifs et déconnectés pour permettre une reprise fluide du jeu sans pénaliser les autres participants.Cela impliquait de marquer les joueurs comme "déconnectés" sans les retirer immédiatement de la partie, permettant ainsi leur reconnexion dans un intervalle de temps donné. Ce mécanisme complexe a nécessité une gestion fine des états des joueurs et des parties, ainsi qu'une modification de la logique de communication via Socket.IO pour gérer les événements de déconnexion et de reconnexion.


En résumé, un joueur peut changer son mot de passe, peut communiquer avec les autres joueurs, rejoindre des rooms spécifiques, pour de nouveau rejoindre la room en cas de déconnexion soudaines, et démarrer des parties de Uno, et que ses actions dans le jeu impactent tous les joueurs.

De manière générale, les codes de chacun devaient faire attention a bien pouvoir s'intégrer aux codes des autres, en particulier pour l'intégration du tchat qui nécessite de réutiliser le code de la gestions du serveur.  

## Problèmes rencontrés
1. __Création d'un moyens de réinitialiser le mot de passe :__     
Le choix de la méthode à était crutial, l'objectif étant de garantir la sécurité des joueurs, on avait plusieurs options, comme avoir une page générique pour la réinitialisation accessible à tous, où de la limiter à des utilisateurs possèdant un token spécifique. L'option optée étant d'envoyer un lien contenant un token avec un temps d'expiration court par mail à l'utilisateur.

## Améliorations
Côté authentification, quelques ajouts seront faits dans les semaines à venir, dans le _"Forgot password?"_ et le "Reset_Password" une option cliquable pour retourner dans le menu, un style css pour le tchat et continuer la DA pour voir comment l'intégrer, ou encore la sécurisation du token et des routes.  
Faire en sorte, que le chat soit limité à la room.
Coté serveur, on pourrait éventuellement combler une room avec des bots.
Et de manière plus générale, un choix final de DA et un lien entre tous les codes sera fait.

## Organisation

L'organisation pour ces dernières semaines a été la suivante :
- Thanushan s'est occupés d'implémenter un moyens de pouvoir réinitialiser le mot de passe (envoi d'un mail avec un lien unique) et d'implémenter un tchat
- Zeyneb s'est occupée de finir la gestions des serveurs avec socket.io
- Maya a fait des recherches plus approfondies sur nos choix
- Daoud s'est occupé de suivre chacun des membres, gérer les réunions et de continuer la gestion des serveurs.
  
## Calendrier

### Calendrier initial:
Objectif à avoir accompli à la date indiquée.
**10/04** : Finir la gestion des serveurs (Z & D) + développer le tchat (T & M) + Tout relier bien (T) + (Rendre visible le mdp avec le petit oeil, Oubli de mdp -> mail automatique ) (M & T)  
**24/04** : Gérer le responsive (T) + Sécuriser avec https et routes et token (M) + Ajout mode daltonien (T) + Hebergeur (Z & D) + Ajout d'une IA (possibilité d'avoir 1 jour réel, 3 bots etc) OU jeu maléable (peut etre joué a 2, 3 ou 4) (Z & D) + Avoir une plateforme uniforme sur la DA et jouable (T & M)   
**08/05** : Avoir une plateforme uniforme sur la DA et jouable (T & M) + Implémenter & Rédiger paramètres (M) +
Rapport et soutenance (M) + Ajouter de la musique d'ambiance (Z & D) + (Classement (Z & D)) 

### Calendrier ajusté:
**10/04** : Finir la gestion des serveurs (Z & D) + développer le tchat (T & M) + (Rendre visible le mdp avec le petit oeil, Oubli de mdp -> mail automatique ) (M & T)  
**24/04** : Réorganisation de la gestion des serveurs + Tout relier bien (T) + Gérer le responsive (T) + Sécuriser avec https et routes et token (M) + Ajout mode daltonien (T) + Hebergeur (Z & D) + Ajout d'une IA (possibilité d'avoir 1 jour réel, 3 bots etc) OU jeu maléable (peut etre joué a 2, 3 ou 4) (Z & D) + Avoir une plateforme uniforme sur la DA et jouable (T & M)   
**08/05** : Avoir une plateforme uniforme sur la DA et jouable (T & M) + Implémenter & Rédiger paramètres (M) +
Rapport et soutenance (M) + Ajouter de la musique d'ambiance (Z & D) + (Classement (Z & D)) 


## Rôles

#### Rôles de la semaine :  
_Du 03/04 au 10/04_ :  
- Responsable : Daoud
- Codeurs : Zeyneb et Thanu
- Chercheuse : Maya


## Réferences

https://www.npmjs.com/package/jsonwebtoken  
https://jwt.io/libraries  
https://www.researchgate.net/figure/Hash-Message-Authentication-Code-HMAC-process-332-Overview-of-SHA-256-SHA-256_fig2_346634579  
https://www.ionos.fr/digitalguide/hebergement/aspects-techniques/le-https-cest-quoi/  
https://www.ionos.fr/digitalguide/serveur/securite/tls-vs-ssl/  
https://aws.amazon.com/fr/compare/the-difference-between-https-and-http/  
https://www.comforth-easyfront.eu/article/heroku-dynos-private-spaces/  
https://www.capterra.fr/software/158191/heroku  
https://apidog.com/articles/socket-io-vs-websocket/#:~:text=WebSocket%20offers%20superior%20performance%20and,browser%20compatibility%20and%20automatic%20reconnection.  
https://ably.com/topic/socketio-vs-websocket  
https://www.youtube.com/watch?v=djMy4QsPWiI  


# Appendix
## Maquette
Maquette pour l'interface du jeu: 
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'authentification: 
![authentification](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Login.png)
