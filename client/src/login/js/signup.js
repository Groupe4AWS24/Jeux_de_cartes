class Signup {
	constructor(form, fields) {
		this.form = form;
		this.fields = fields;
		this.validateonSubmit();
	}

	// Verifie que tout est respecté avant de passer à la prochaine page
	validateonSubmit() {
		let self = this;

		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			let error = 0;
			self.fields.forEach((field) => {
				const input = document.querySelector(`#${field}`);
				if (self.validateFields(input) == false) {
					error++;
				}
			});
			if (error == 0) {
				localStorage.setItem("auth", 1);
				this.form.submit();
			}
		});
	}

	// Verifie que tous les champs sont remplis selon les critères
	// Ajouter le lien avec la BDD en verifiant qu'un compte avec le meme username n'existe pas déjà
	validateFields(field) {
		const majusculeRegex = /[A-Z]/;
		const chiffreRegex = /\d/;
		const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		const mailcompo = /[@.]/ ;
		// Check si le input est vide
		if (field.value.trim() === "") {
			this.setStatus(
				field,
				`${field.previousElementSibling.innerText} cannot be blank`,
				"error"
			);
			return false;
		} else {
			if (field.id == "password") {
				// Verifie la longueur du mot de passe
				if (field.value.length < 12) {
					this.setStatus(
						field,
						`${field.previousElementSibling.innerText} must be at least 12 characters`,
						"error"
					);
					return false;
				} else {
					// Verifie que le mot de passe possède au moins une majuscule
					if (!majusculeRegex.test(field.value)) {
						this.setStatus(
							field,
							`${field.previousElementSibling.innerText} must have at least an upper case`,
							"error"
						);
						return false;
					}
					// Verifie que le mot de passe possède au moins un chiffre
					else if (!chiffreRegex.test(field.value)) {
						this.setStatus(
							field,
							`${field.previousElementSibling.innerText} must have at least a number`,
							"error"
						);
						return false;
					}
					// Verifie que le mot de passe possède au moins au caractère spécial
					else if (!specialRegex.test(field.value)) {
						this.setStatus(
							field,
							`${field.previousElementSibling.innerText} must have at least a special character`,
							"error"
						);
						return false;
					}
					// Si toutes les conditions sont validées
					this.setStatus(field, null, "success");
					return true;
				}
			}
			if (field.id == "username") {
				// Verifie la longueur de l'username
				if (field.value.length < 4) {
					this.setStatus(
						field,
						`${field.previousElementSibling.innerText} must be at least 4 characters`,
						"error"
					);
					return false;
				} else {
					// Verifie le format de l'username
					if (specialRegex.test(field.value)) {
						this.setStatus(
							field,
							`${field.previousElementSibling.innerText} cannot contain a special character`,
							"error"
						);
						return false;
					}
					this.setStatus(field, null, "success");
					return true;
				}
			}
			if (field.id == "email") {
				// Verifie le format du mail
				if (!mailcompo.test(field.value)) {
					this.setStatus(
						field,
						`${field.previousElementSibling.innerText} has not the right format.`,
						"error"
					);
				} else {
				this.setStatus(field, null, "success");
				return true;
				}
			}
		}
	}

	// Rajoute au champs un message d'erreur
	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector(".error-message");
		if (status == "success" && errorMessage) {
			errorMessage.innerText = "";
		}

		if (status == "error") {
			errorMessage.innerText = message;
		}
	}
}

// Récupère les cases que l'on peut remplir
const form = document.querySelector(".signupForm");
if (form) {
	const fields = ["email","username", "password"];
	const validator = new Signup(form, fields);
}
