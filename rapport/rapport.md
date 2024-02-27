# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire à UNO qui diffère sur certaines règles (on peut enchainer plusieurs fois la même carte, pas de régle d'échange de carte...).  

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de façon relativement sécurisé.

## Progrès Réalisés 
  Nous avons commencé par choisir les technologies sur lesquel on va réaliser le projet, pour le coté du front-end (interface du site), on a décidé d'utiliser le framework React étant un des framework les plus populaires, donc celui qui a le plus de documentation, pour la gestion du projet il sera utilisé avec Vite au lieu du CRA, principalement pour le temps qu'il nous fait gagner (temps de démarrage et application des modifications).  

  Pour gérer la base de donnés du système d'authentification, on utilisera du NOSQL via MangoDB, on privilégie cette approche par rapport à un hébergemet via firebase à cause de la limitation du nombre de requête par jour pour la version gratuite.

  Pour le coté du serveur, on passera par Node.js et son framework express.js pour faciliter la créations des serveurs et du gestion des requetes HTTP.
  
  Dans un premier temps,  on a développé la direction artistique de notre jeu, en réalisant plusieurs propositions pour les cartes, et une maquette du jeu, l'objectif était d'avoir une maquette assez simpliste qui nous permettra de l'intégrer le plus rapidement possible (cf l'apendix).

  Puis pour l'intégration du projet, on a décidé de principalement se concentrer sur la logique du jeu et réaliser toutes les fonctions essentiels. Cependant on a également commencé à réaliser l'intégration de la maquette via React, par des fonctions qui gèrent la création de cartes, de la main, et sur la réflexion de la stratégie à mettre en place pour la dispositons des différents élements.

# Réferences

https://css-tricks.com/snippets/css/a-guide-to-flexbox/ Explication des FlexBox  
https://www.figma.com/fr/ Le site où a était réalisé les maquettes  
https://flexboxfroggy.com/#fr Pour apprendre les différentes usages des Flexbox (jeu intéractif)  
https://flukeout.github.io/ Pour apprendre le CSS (jeu intéractif)  
https://www.platoapp.com/: Plato a été notre inspiration pour notre jeu Uno.  
https://socket.io/fr/docs/v4/ Pour la documentation sur la bibliothèque et ses intérêts  
https://www.youtube.com/watch?v=C3A7NBVyM1o (je pense faut pas mettre)  
https://www.youtube.com/watch?v=HPbMh1QAxb4 (je pense faut pas mettre)  


# Problèmes rencontrés
1. __Organisation des Classes et Méthodes :__  
L'une des premières difficultés a été de définir clairement les responsabilités de chaque classe et les méthodes nécessaires. La conception du jeu Uno impliquait de gérer plusieurs entités (cartes, joueurs, deck) et établir des liens logiques entre elles. La répartition des tâches entre les classes et la détermination des méthodes clés ont demandé une réflexion approfondie pour garantir une structure logique et compréhensible.
2. __Gestion de l'Ordre des Joueurs et des Actions Spéciales :__  
Trouver une manière efficace de relier les joueurs entre eux pour organiser l'ordre de jeu, faciliter les changements de sens de jeu et gérer les sauts du prochain joueur s'est révélé être un défi.  
L'idée proposée pour résoudre ce problème était d'introduire une organisation circulaire des joueurs avec des références à leurs prédécesseurs et successeurs.
3. __La disposition des éléments :__  
La disposition des éléments sur l'écran à était un défi complexe du à notre manque d'expérience avec le CSS et du framework React, fallait trouver un moyens de pouvoir placer les éléments selon la maquette, tout en gardant une certaine flexibilité pour l'évolution via le responsive. Pour ceci, on ne pouvait donc pas utiliser des absolute position, on a décider de partir sur des structures composée de FlexBox, on a divisé l'écran en colonne via 3 Div et pour la colonne du milieu on la redivisait en ligne via 3 Div. (cf l'image dans l'apendix.)
4. __FlexBox :__
   Dans une moindre mesure, la compréhension de l'usage des flexbox était difficile à comprendre. Pour ceci on a consulter différentes documentation et on a pratiqué sur les différente usage du flexbox via un jeu interactif (cf les références)

# Calendrier

## Calendrier intial:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implémenter le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification)
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les intéractions du jeu + gestion des serveurs +possible intégration de bots.
- 03/04: Finir la gestion des serveurs + si tout est accomplit, intégrer d'autre jeux de cartes + gérer le responsive.

## Calendrier ajusté:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 14/02: Implementer le jeu + Création du design + Implémenter le site
- 28/02: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + continuer l'implémentation du site
- 13/03: Finir la création de compte (Intégration de la base de données) + développer le tchat + les intéractions du jeu + gestion des serveurs + Finir l'implementation du site + rajouter de la musique d'ambiance
- 03/04: Finir la gestion des serrveurs + si tous accomplis intégré d'autre jeu de cartes

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


# Technologies qui sera utilisé

  Pour la communication client-serveur, on a opté pour Socket.io, une bibliothèque facilitant les communications en temps réel, mais il fournit également des fonctionnalités supplémentaires comme la reconnexion automatique, la diffusion à plusieurs clients, et le support des rooms, des notions majeurs pour un jeu multijoueur.

# Apendix
## Maquette
Maquette pour les cartes:
