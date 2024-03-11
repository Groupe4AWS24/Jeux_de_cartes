class Signin {
	constructor(form, fields) {
		this.form = form;
		this.fields = fields;
		this.validateonSubmit();
	}

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

	verifyFields(field) {
		// faire une fonction qui verifie que le compte existe dans la bdd : que username existe bien, et si oui que pwd corresponde.
        // sinon, indiquer que l'un des deux est faux
	}

	// Rajoute au champs un message d'erreur
	setStatus(field, message, status) {
		const errorMessage = field.parentElement.querySelector(".error-message");
		if (status == "success" && errorMessage) {
			errorMessage.innerText = "";
			//field.classList.remove("input-error");
		}

		if (status == "error") {
			errorMessage.innerText = message;
			//field.classList.add("input-error");
		}
	}
}

// Récupère les cases que l'on peut remplir
const form = document.querySelector(".signinForm");
if (form) {
	const fields = ["username", "password"];
	const validator = new Signin(form, fields);
}