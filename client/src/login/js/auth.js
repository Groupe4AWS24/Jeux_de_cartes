class Auth {
	// Création d'une instance en vidant le contenu html de base
	constructor() {
        document.querySelector("body").style.display = "none";
		// Permet de stocker de manière persistente côté client
		const auth = localStorage.getItem("auth");
		this.validateAuth(auth);
	}
	// Vérifie si l'authentification est correcte
	validateAuth(auth) {
		// Si validation incorrecte, redirige sur le sign in
		if (auth != 1) {
			window.location.replace("/");
		} else {
			// Sinon, affiche le contenu de la page
            document.querySelector("body").style.display = "block";
		}
	}

	// Déconnexion
	logOut() {
		// Déstocke la donnée qui était enregistrée de manière permanente
		localStorage.removeItem("auth");
		// Redirige vers la racine
		window.location.replace("/");
	}
}
