const auth = new Auth();
// Déconnexion au clic
document.querySelector(".logout").addEventListener("click", (e) => {
	auth.logOut();
});
