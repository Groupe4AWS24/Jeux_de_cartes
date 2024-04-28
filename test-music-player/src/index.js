// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importer createRoot de react-dom/client
import MusicPlayer from './components/MusicPlayer';
import './styles/MusicPlayer.css';
// index.js ou App.js
import './index.css';


const container = document.getElementById('root');
const root = createRoot(container); // Créer une racine avec le conteneur

// Utiliser root.render pour monter votre composant
root.render(
  <React.StrictMode>
    <MusicPlayer />
  </React.StrictMode>
);
