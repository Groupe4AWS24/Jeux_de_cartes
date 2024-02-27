# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire à UNO qui diffère sur certaines règles (on peut enchainer plusieurs fois la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de façon relativement sécurisé.

## Progrès Réalisés 
  Nous avons commencé par choisir les technologies sur lesquelles on va réaliser le projet, pour le côté du front-end (interface du site), on a décidé d'utiliser le framework React étant un des framework les plus populaires, donc celui qui a le plus de documentation, pour la gestion du projet il sera utilisé avec Vite au lieu du CRA, principalement pour le temps qu'il nous fait gagner (temps de démarrage et application des modifications).  

  Pour gérer la base de données du système d'authentification, on utilisera du NOSQL via MongoDB, on privilégie cette approche par rapport à un hébergement via firebase à cause de la limitation du nombre de requête par jour pour la version gratuite.

  Pour le côté du serveur, on passera par Node.js et son framework express.js pour faciliter la création des serveurs et du gestion des requêtes HTTP.
  
  Dans un premier temps,  on a développé la direction artistique de notre jeu, en réalisant plusieurs propositions pour les cartes, et une maquette du jeu, l'objectif était d'avoir une maquette assez simpliste qui nous permettra de l'intégrer le plus rapidement possible (cf l'apendix).

  Puis pour l'intégration du projet, on a décidé de principalement se concentrer sur la logique du jeu et réaliser toutes les fonctions essentielles. Cependant on a également commencé à réaliser l'intégration de la maquette via React, par des fonctions qui gèrent la création de cartes, de la main, et sur la réflexion de la stratégie à mettre en place pour la dispositions des différents éléments.

# Réferences

https://css-tricks.com/snippets/css/a-guide-to-flexbox/ Explication des FlexBox  
https://www.figma.com/fr/ Le site où a était réalisé les maquettes  
https://flexboxfroggy.com/#fr Pour apprendre les différentes usages des Flexbox (jeu intéractif)  
https://flukeout.github.io/ Pour apprendre le CSS (jeu intéractif)  
https://www.platoapp.com/: Plato a été notre inspiration pour notre jeu Uno.  
https://socket.io/fr/docs/v4/ Pour la documentation sur la bibliothèque et ses intérêts  
https://www.youtube.com/watch?v=EdB_lK7ICYc: Vidéo comparative entre Vite et CRA 


# Problèmes rencontrés
1. __Organisation des Classes et Méthodes :__  
L'une des premières difficultés a été de définir clairement les responsabilités de chaque classe et les méthodes nécessaires. La conception du jeu Uno impliquait de gérer plusieurs entités (cartes, joueurs, deck) et établir des liens logiques entre elles. La répartition des tâches entre les classes et la détermination des méthodes clés ont demandé une réflexion approfondie pour garantir une structure logique et compréhensible.
2. __Gestion de l'Ordre des Joueurs et des Actions Spéciales :__  
Trouver une manière efficace de relier les joueurs entre eux pour organiser l'ordre de jeu, faciliter les changements de sens de jeu et gérer les sauts du prochain joueur s'est révélé être un défi.  
L'idée proposée pour résoudre ce problème était d'introduire une organisation circulaire des joueurs avec des références à leurs prédécesseurs et successeurs.
3. __La disposition des éléments :__  
La disposition des éléments sur l'écran à été un défi complexe du à notre manque d'expérience avec le CSS et du framework React, fallait trouver un moyens de pouvoir placer les éléments selon la maquette, tout en gardant une certaine flexibilité pour l'évolution via le responsive. Pour ceci, on ne pouvait donc pas utiliser des absolute position, on a décidé de partir sur des structures composée de FlexBox, on a divisé l'écran en colonne via 3 Div et pour la colonne du milieu on la redivisait en ligne via 3 Div. (cf la derniere image dans l'apendix.)
4. __FlexBox :__
   Dans une moindre mesure, la compréhension de l'usage des flexbox était difficile à comprendre. Pour ceci on a consulter différentes documentation et on a pratiqué sur les différents usage du flexbox via un jeu intéractif (cf les références)

# Calendrier

## Calendrier intial:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implémenter le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification)
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les intéractions du jeu + gestion des serveurs +possible intégration de bots.
- 03/04: Finir la gestion des serveurs + si tout est accomplit, intégrer d'autre jeux de cartes + gérer le responsive.

## Calendrier ajusté:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implémenter le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + continuer l'implémentation du site
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les intéractions du jeu + gestion des serveurs + Finir l'implémentation du site + rajouter de la musique d'ambiance
- 03/04: Finir la gestion des serveurs + si tous accompli intégré d'autre jeux de cartes

# Rôle

Rôle de la semaine:  
- Responsable : Thanu/Maya
- Codeurs : Thanu/Maya et Daoud
- Chercheuse : Zeyneb

Rôle des prochaines semaines:  
Du 28/02 au 13/03 :  
- Responsable : Zeyneb
- Codeurs : Maya et Daoud
- Chercheur : Thanu

Du 13/03 au 03/04 :  
- Responsable : Maya/Thanu
- Codeurs :  Maya et Zeyneb
- Chercheur : Daoud

Du 03/04 au 10/04 :  
- Responsable : Daoud
- Codeurs : Zeyneb et Thanu
- Chercheuse : Maya


# Technologies qui sera utilisées

  Pour la communication client-serveur, on a opté pour Socket.io, une bibliothèque facilitant les communications en temps réel, mais elle fournit également des fonctionnalités supplémentaires comme la reconnexion automatique, la diffusion à plusieurs clients, et le support des rooms, des notions majeures pour un jeu multijoueur contrairement aux Websockets natifs. Socket.io sera integré à React pour communiquer avec le serveur Node.js (Socket.IO et Node.js sont utilisés ensemble), cela va établir une connexion WebSocket entre le navigateur de l'utilisateur et le serveur. Exemple simple de l'utilisation de Socket.io : quand un joueur joue une carte, l'action est envoyée au serveur via Socket.IO, le serveur va traiter cette action (comme vérifier si le mouvement est valide, mettre à jour l'état du jeu, etc...), puis diffuse l'état du jeu mis à jour à tous les joueurs connectés en utilisant Socket.IO.

Dans le contexte d'un jeu Uno en ligne, Node.js sera utile pour construire le serveur qui gère la logique du jeu, les intéractions avec la BD et les sessions des joueurs.
On creusera plus tard du coté de l'intégration du framework Express combiné à Node.js pour faciliter la gestion des requetes HTTP.
  

# Apendix
## Maquette
Maquette conception du jeu:  
![jeuschema](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux.png)  
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'interface du jeu: 
![jeu](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20de%20l'interface%20du%20jeu.png)

Schéma des division pour l'affichage:  
![schemadiv](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/schemadiv.png)
