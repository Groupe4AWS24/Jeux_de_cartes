// A remplacer avec un menu
// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import axios from "axios";

// Fonction Dashboard qui sera modifiée pour devenir un menu
function Dashboard() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Inverse l'état de la case à cocher lorsqu'elle est cliquée
  };

  function CheckBox() {}

  /**
   *  Fonction asynchrone qui envoie une requête pour la déconnexion.
   */
  const disconnect = async () => {
    await axios.post("/disconnect");
    navigate("/");
  };

  // CSS
  const style = {
    flexDirection: "column",
  };

  // Rendu
  return (
    <div className="screendash">
      <div className="LeftPart Sidedash">
      <div className="containerdash">
        <div className="CreateRoom">
          <h2 className="text-center">Create Room</h2>
          <div className="choice-group">
            <label htmlFor="players" className="label">
              Number of players
            </label>
            <button className="button2">2</button>
            <button className="button3">3</button>
            <button className="button4">4</button>
          </div>
          <div className="bot-group">
            <label htmlFor="bots" className="label">
              Fill with bots
            </label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="checkbox"
            />
          </div>
          <button className="button" type="submit">
            Create Room
          </button>
        </div>
        </div>
      </div>
      <div className="RightPart">
      <div className="containerdash">
        <div className="input-group">
          <label htmlFor="room" className="label">
            Room ID
          </label>
          <input
            type="text"
            id="room"
            className="input"
            placeholder="Enter your Room ID"
          />
        </div>
        <button className="button" type="submit">
          Join Room
        </button>
      </div>
    </div>
    </div>
  );
}

// Export
export default Dashboard;
