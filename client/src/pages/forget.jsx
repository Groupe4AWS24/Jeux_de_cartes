// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/forget.css";

// Fonction Login
function Forget() {
  // utiliser plus tard pour rediriger vers le Home à implémenter.
  const navigate = useNavigate();

  // Variables permettant de gérer les entrées des utlisateurs, et envoyé
  // des messages d'erreurs ou de succès correspondant à la situation.
  const [emailEntry, setEmailEntry] = useState({
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /**
   * Modifie la valeur d'un champ lors de la saisie.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmailEntry({
      email: value,
    });
  };

  /**
   * Une fonction asynchrone qui soumet une demande de réinitialisation de
   * mot de passe oublié au serveur.
   * Affiche des messages d'erreurs et de success.
   */
  const sumbitForget = async () => {
    axios
      .post("/forgotpassword", { email: emailEntry.email })
      .then(({ data }) => {
        if (data.error) {
          setSuccessMsg("");
          setErrorMsg(data.error);
        } else {
          setErrorMsg("");
          setSuccessMsg(data.message);
        }
      });
  };

  // Rendu
  return (
    <div className="screen">
      <div className="container">
        <div className="Left forget side">
          <h2 className="text-center">Enter your email</h2>
          <div className="input-group">
            <p className="Forgetparagraph">
              Enter your email and we will send you a link to reset your
              password
            </p>
            <input
              type="text"
              id="email"
              className="input"
              value={emailEntry.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="errorcontainer">
            <span className="error-message">{errorMsg}</span>
            <span className="success-message">{successMsg}</span>
          </div>
          <button className="button forgetbutton" onClick={sumbitForget}>
            Send
          </button>
        </div>
        <div className="Right side" />
      </div>
    </div>
  );
}

// Export
export default Forget;
