import React, { useState, useRef, useEffect } from 'react';
//import io from 'socket.io-client';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPlay, faPause, faStepForward, faStepBackward, faSyncAlt, faRandom } from '@fortawesome/free-solid-svg-icons';
import '../styles/MusicPlayer.css';  // Assurez-vous que le chemin est correct
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRepeat, FaRedo } from 'react-icons/fa';
import { PiRepeatBold } from "react-icons/pi";
import { PiRepeatOnceBold } from "react-icons/pi";
// Connexion au serveur socket.io
//const socket = io('http://localhost:3001');

function MusicPlayer({ roomId, style, className }) {// rajout de props pour permettre à thanu de gérer la taille de la barre depuis le room.jsx
  const [tracks, setTracks] = useState([
    { name: 'Lofi sad', src: '/audio/Lofi sad.mp3' },
    { name: 'Nintendo', src: '/audio/Nintendo.mp3' },
    { name: 'The promised neverland', src: '/audio/The promised neverland.mp3' }
  ]); 
  
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);  // Index de la piste actuelle
  const [isPlaying, setIsPlaying] = useState(false);  // État de lecture
  const [volume, setVolume] = useState(0.5);  // Volume initial à 50%
  const [progress, setProgress] = useState(0);  // Progression de la piste en cours
  const [duration, setDuration] = useState(0);  // Durée de la piste en cours
  //const [pausedTime, setPausedTime] = useState(0);
  const [repeatMode, setRepeatMode] = useState(0);
  //const [isShuffling, setIsShuffling] = useState(false);
  const [timeMarker, setTimeMarker] = useState('00:00');
  const [hoverPosition, setHoverPosition] = useState(null);// Position en pourcentage pour le CSS
  const [hoverTime, setHoverTime] = useState(null);
  const audioRef = useRef(null);  // Référence à l'élément audio HTML
  const [isMusicPlayerVisible, setIsMusicPlayerVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  

// Lorsque l'audio est mis en pause, enregistrez la position de lecture actuelle
// Met en pause la lecture et enregistre la position de lecture actuelle
// Gère le bouton de lecture/pause directement sans état pausedTime
const togglePlayPause = () => {
  const audio = audioRef.current;
  if (!audio) return;

  const playAudio = async () => {
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Erreur lors de la lecture :", err);

    }
  };

  if (isPlaying) {
    audio.pause();
    setIsPlaying(false);
  } else {
    playAudio();
  }
};


  useEffect(() => {
    const audio = audioRef.current;
    audio.src = tracks[currentTrackIndex]?.src || '';
    if (isPlaying) {
      audio.play().catch(err => console.error("Erreur lors de la lecture :", err));
    }
  }, [currentTrackIndex, tracks]); // Enlevez isPlaying des dépendances si cela cause des réinitialisations
  
  
  const changeTrack = (forward) => {
    let newIndex = currentTrackIndex + (forward ? 1 : -1);
    if (newIndex < 0) newIndex = tracks.length - 1;
    else if (newIndex >= tracks.length) newIndex = 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(true); // Démarrer automatiquement la lecture de la nouvelle piste
  };
  

  const handleTrackEnd = () => {
    if (repeatMode === 1) { // Répétition de la piste actuelle
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else { // Pas de répétition
      // Passez à la piste suivante ou arrêtez la lecture 
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }
  };
  
  
  
  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 2); // Alterne entre 0 et 1
  };
  
  
  /*const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };*/
  
  
  
  const handleTimeUpdate = () => {
    const currentTime = audioRef.current.currentTime;
    setProgress(currentTime);
    setTimeMarker(formatTime(currentTime));
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };
  
  const handleProgressClick = (event) => {
    const audio = audioRef.current;
    if (!audio || !event) return;
  
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const progressBarWidth = rect.width;
  
    if (progressBarWidth === 0) {
      console.error("La largeur de la barre de progression est nulle.");
      return;
    }
  
    const clickX = event.clientX - rect.left;
    if (clickX < 0 || clickX > progressBarWidth) {
      console.error("Position de clic hors limites:", clickX);
      return;
    }
  
    const clickPosition = clickX / progressBarWidth;
    const newTime = audio.duration * clickPosition;
  
    if (!isFinite(newTime)) {
      console.error("Le nouveau temps calculé n'est pas fini:", newTime);
      return;
    }
  
    audio.currentTime = newTime;
  
    // (Optionnel) Si la musique était en pause, démarrez la lecture
    if (!isPlaying) {
        setIsPlaying(true);
        audio.play().catch(err => console.error("Erreur lors de la reprise de la lecture :", err));
    }
};


  const handleMouseMove = (event) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const width = rect.width;
    const clickPosition = x / width;
    const newTime = audioRef.current.duration * clickPosition;
  
    setHoverPosition(clickPosition * 100);
    setHoverTime(formatTime(newTime));
  };

  
  const handleMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  // Fonction d'assistance pour formater le temps en minutes:secondes
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Utilisez cette fonction pour passer à la piste suivante
const getNextTrackIndex = () => {
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= tracks.length) {
    nextIndex = 0; // Retour au début si on est à la fin de la liste
  }
  return nextIndex;
};


  const toggleMusicPlayerVisibility = () => {
    setIsMusicPlayerVisible(prevVisible => !prevVisible);
  };
  
  
  return (
    <>
      <button onClick={toggleMusicPlayerVisibility}className="toggle-music-player-button"> {isMusicPlayerVisible ? '🎵' : '🎵'}</button>
      <audio ref={audioRef} onEnded={handleTrackEnd} onTimeUpdate={handleTimeUpdate} />
      {isMusicPlayerVisible && (
        <div className={`audioPlayer ${className || ''}`} style={style}>
          <div className="controlsWrapper">
            <button onClick={() => changeTrack(false)} className="controlButton"><FaStepBackward style={{ fontSize: '20px' }} /></button>
            <button onClick={togglePlayPause} className="controlButton">{isPlaying ? <FaPause style={{ fontSize: '16px' }}/> : <FaPlay style={{ fontSize: '16px' }}/>}</button>
            <button onClick={() => changeTrack(true)} className="controlButton"><FaStepForward style={{ fontSize: '20px' }} /></button>
            <button onClick={toggleRepeat} className={`controlButton ${repeatMode !== 1 ? 'active' : ''}`}>{repeatMode === 1 ? <PiRepeatOnceBold style={{ fontSize: '24px' }}/> : <PiRepeatBold style={{ fontSize: '24px' }} /> }</button>
          </div>
          <div className="trackInfo">{tracks[currentTrackIndex]?.name}</div>
          <div className="progressContainer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleProgressClick}>
            <div className="progressBar" style={{ width: `${(progress / duration) * 100}%` }}></div>
            {hoverPosition !== null && (
              <div className="hoverMarker" style={{ left: `${hoverPosition}%` }}></div>
            )}
            {hoverTime && (
              <div className="hoverTimeLabel" style={{ left: `${hoverPosition}%` }}>
                {hoverTime}
              </div>
            )}
          </div>
          <div className="progressTime">
            <span>{Math.floor(progress / 60)}:{Math.floor(progress % 60).toString().padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="volumeControls">
            <span className="volumeIcon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volumeSlider"
            />
          </div>
        </div>
      )}
    </>
  );
}  

export default MusicPlayer;