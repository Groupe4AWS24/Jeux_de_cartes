import React, { useState } from "react";
import "../styles/dashboard.css";

function Test() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Inverse l'état de la case à cocher lorsqu'elle est cliquée
  };

  // Rendu
  return (
    <div className="screendash">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screendashWhite" />
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
          <div className="containerJoin">
            <button className="buttonjoin" type="submit">
              Create Room
            </button>
          </div>
        </div>
      </div>
      <div className="RightPart1 Sidedash">
        <div className="CreateRoom">
          <h2 className="text-center-dash">Join Room</h2>
          <div className="input-groupdash">
            <p className="label">Room ID :</p>
            <input
              type="text"
              id="room"
              className="inputdash"
              placeholder="Enter your Room ID"
            />
          </div>
          <div className="containerJoin">
            <button className="buttonjoin" type="submit">
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export
export default Test;
