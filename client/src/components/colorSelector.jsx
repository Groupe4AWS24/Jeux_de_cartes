import React from "react";
import {memo} from "react";
const ColorSelector = ({ setChoice }) => {
  const handleClick = (color) => {
    setChoice(color);
    console.log(color)
  };

  return (
    <div className="background">
      <div className="colorContainer">
        <div className="askColor">Select a color</div>
        <div className="colorSelector">
          <div
            className="part violet"
            style={{ borderRadius: "100% 0 0 0" }}
            onClick={() => handleClick("violet")}
          />
          <div
            className="part rose"
            style={{ borderRadius: "0 100% 0 0" }}
            onClick={() => handleClick("rose")}
          />
          <div
            className="part bleu"
            style={{ borderRadius: "0 0 0 100%" }}
            onClick={() => handleClick("bleu")}
          />
          <div
            className="part vert"
            style={{ borderRadius: "0 0 100% 0" }}
            onClick={() => handleClick("vert")}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ColorSelector);
