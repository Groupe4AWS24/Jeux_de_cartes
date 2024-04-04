// Imports
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Fonction Login
function Forget() {
  const navigate = useNavigate();
  // Objet contenant des strings pour chaque champ.
  const [emailEntry, setemailEntry] = useState({
    email: "",
  });

  /** Modifie la valeur d'un champ lors de la saisie.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setemailEntry({
      email: value,
    });
  };

  const handleforget = async () => {
    axios.post("/forgotpassword", {email: emailEntry.email});
  };

  // Rendu
  return (
    <div className="screen">
      <div className="container">
        <div className="Left side">
          <h2 className="text-center">Log in</h2>
            <div className="input-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="input"
                value={emailEntry.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>            
            <span className="error-message"></span>
            <button className="button" onClick={handleforget}>
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
