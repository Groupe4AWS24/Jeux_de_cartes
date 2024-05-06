import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tchat from "../components/tchat";
import React, { useState } from "react";

import { UserContext } from "../../context/userContext";
import { io } from "socket.io-client";
// Imports
import "../styles/dashboard.css";
import axios from "axios";

function Test() {
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
      <div className="LeftPart1 Sidedash">
        <div className="CreateRoom">
          <h2 className="text-center-dash">Create Room</h2>
          <div className="choice-group">
            <p className="label">Number of players :</p>
            <div className="choicePlayer">
            <button className="buttonPlayer">2</button>
            <button className="buttonPlayer">3</button>
            <button className="buttonPlayer">4</button>
            </div>
          </div>
          <div className="bot-group">
            <p className="label">Fill with bots : </p>
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
      <div className="RightPart1 Sidedash">
        <div className="CreateRoom">
          <h2 className="text-center-dash">Join Room</h2>
          <div className="choice-group">
            <p className="label">Room ID :</p>
            <button className="button2">2</button>
            <button className="button3">3</button>
            <button className="button4">4</button>
          </div>
          <div className="bot-group">
            <p className="label">Fill with bots</p>
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
  );
}

// Export
export default Test;

// <div className="screendash">
//   <div className="LeftPart Sidedash">
//   <div className="containerdash">
//     <div className="CreateRoom">
//       <h2 className="text-center">Create Room</h2>
//       <div className="choice-group">
//         <label htmlFor="players" className="label">
//           Number of players
//         </label>
//         <button className="button2">2</button>
//         <button className="button3">3</button>
//         <button className="button4">4</button>
//       </div>
//       <div className="bot-group">
//         <label htmlFor="bots" className="label">
//           Fill with bots
//         </label>
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={handleCheckboxChange}
//           className="checkbox"
//         />
//       </div>
//       <button className="button" type="submit">
//         Create Room
//       </button>
//     </div>
//     </div>
//   </div>
//   <div className="RightPart">
//   <div className="containerdash">
//     <div className="input-groupdash">
//       <label htmlFor="room" className="label">
//         Room ID
//       </label>
//       <input
//         type="text"
//         id="room"
//         className="inputdash"
//         placeholder="Enter your Room ID"
//       />
//     </div>
//     <button className="buttondash" type="submit">
//       Join Room
//     </button>
//   </div>
// </div>
// </div>
