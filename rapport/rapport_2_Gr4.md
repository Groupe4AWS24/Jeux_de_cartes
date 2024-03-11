# Projet AWS: Card Games

## Description de l'application

Nous avons décidé de créer une plateforme qui permettra de jouer en multijoueur à un jeu similaire au UNO différant sur certaines règles (enchaînement plusieurs fois de la même carte, pas de règle d'échange de carte...). 

Il sera également possible de communiquer via un tchat. Un système d'authentification sera mis en place pour identifier un joueur de manière relativement sécurisée.

## Déjà Réalises 

Dans un premier temps, nous avons développé la direction artistique de notre jeu.
Enfin, pour l'intégration du projet, nous avons commencé pla logique du jeu. En outre, nous avons également commencé à réaliser l'intégration de la maquette via React.

## Progrès Réalisés 

Cette semaine nous avons terminé la logique du jeu + l'authentification du compte et l'inscription ce qui sera peaufiné la semaine prochaine. Nous avons continué le front en corrigeant des erreurs que l'on avait rencontrés.

  
# Réferences

https://cyber.gouv.fr/bonnes-pratiques-protegez-vous#:~:text=Cr%C3%A9ez%20un%20mot%20de%20passe,chiffres%20et%20des%20caract%C3%A8res%20sp%C3%A9ciaux
https://cyber.gouv.fr/publications/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe
https://fr.wikipedia.org/wiki/Bcrypt
https://www.iubenda.com/fr/help/57465-consent-database-documentation-js
https://stytch.com/blog/argon2-vs-bcrypt-vs-scrypt/
https://www.platoapp.com/: Plato a été notre inspiration pour notre jeu Uno. 
https://nordvpn.com/fr/blog/what-is-bcrypt/
https://socket.io/fr/docs/v4/ Pour la documentation sur la bibliothèque et ses intérêts  
Sources: Chagpt nous a principalement été utile pour l'explication de certains termes compliqués et le début de piste de recherche.



# Problèmes rencontrés
1. __Disponibilités de chacun  :__  
L'une des difficultés de cette semaine a été de s'adapter au calendrier de chacun car une partie du groupe était en déplacement à l'étranger dans le cadre d'un Hackaton, ces contre temps nous ont conduit à se referer strictement au calendrier prévu à cet effet et ne nous ont pas permis d'apporter des améliorations.
2. __Gestion asynchrone :__  
La nécessité de récupérer les cartes choisies par chaque joueur introduit une interaction utilisateur essentielle. Cependant, cette étape a posé des problèmes de gestion du flux de contrôle, car le programme devait attendre que chaque joueur fasse son choix avant de passer au tour suivant. La gestion de cette interaction utilisateur tout en maintenant la continuité du jeu a exigé une approche asynchrone.
L'introduction de mécanismes d'attente asynchrone a été une solution clé. Cette approche permet au programme de suspendre temporairement son exécution pour attendre les choix des joueurs sans bloquer complètement le déroulement du jeu.


# Calendrier

## Calendrier intial:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 28/02: Implémenter le jeu + Création du design + Implémenter le site
- 13/03: Finir le jeu + Création de compte (Implémentation d'un système d'authentification)
- 03/04: Finir la création de compte (Intégration de la base de données) + développer le tchat + les interactions du jeu + gestion des serveurs + possible intégration de bots.
- 10/04: Finir la gestion des serveurs + si tout est accompli, intégrer d'autre jeux de cartes + gérer le responsive.

## Calendrier ajusté:
Objectif à partir de la date jusqu'à la date de la prochaine séance d'AWS.
- 28/02: Implémenter le jeu + Création du design + Implémenter le site
- 13/03: Finir le jeu + Création de compte (Implémentation d'un système d'authentification) + Continuer l'implémentation du site
- 03/04: Finir la création de compte (Intégration de la base de données + relier back/bdd+ Finition côté front avec react) + Finir l'implémentation du site + Relier front/back + les interactions du jeu + gestion des serveurs
- 10/04: Finir la gestion des serveurs + si tous accompli, intégrer d'autre jeux de cartes + Ajouter de la musique d'ambiance + développer le tchat

# Rôles

Rôles de la semaine:  
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


# Technologies qui seront utilisées
On va utiliser les bibliothèque mongosse (MongoDB), Bcrypt (Hachage), dotenv (pouvoir stocker des info sensibles sans le mettre dans le code source ex : clé API)
Nous avons choisi Bcrypt, pour plusieurs raisons, la principale est l’intégration automatique du sel. Qu’il était conçu pour être lent à calculer, pour rendre coûteuses les attaques par force brute. Du fait qu’il soit largement adopté, il y a plusieurs tests de sécurité dessus, ce qui renforce la confiance dans sa robustesse.
Initialement, on avait prévu de suivre les recommandations de l’ANSII pour le système d’authentification. Mais étant donné la complexité de la mise en place de plusieurs éléments tel que l’authentification à facteurs multiples, la journalisation et surveillance des tentatives de connexion, qui ne correspond pas aux ambitions de notre projet et qui rendrait l’expérience utilisateur moindre.


# Appendix
## Maquette
Maquette conception du jeu:  
![jeuschema](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux.png)  
![jeucouleur](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20jeux%20couleur.png)  

Maquette pour les cartes:  
![carte](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20cartes.png)  

Maquette pour l'interface du jeu: 
![jeu](https://github.com/Groupe4AWS24/Jeux_de_cartes/blob/main/rapport/Maquette%20de%20l'interface%20du%20jeu.png)

