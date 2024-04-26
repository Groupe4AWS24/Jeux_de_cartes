import React, { useState } from 'react';
import './MusicControl.css'; // Assurez-vous de créer ce fichier CSS

const MusicControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-control">
      <button onClick={togglePlay}>
        {isPlaying ? '⏸️' : '▶️'} {/* Emoji pour le bouton play/pause */}
      </button>
      {isPlaying && (
        <div className="control-bar">
          {/* Vous pouvez ajouter des éléments de contrôle ici, comme des sliders de volume, etc. */}
          <p>Playing music...</p>
          {/* Ajoutez ici d'autres contrôles si nécessaire */}
        </div>
      )}
    </div>
  );
};

export default MusicControl;
