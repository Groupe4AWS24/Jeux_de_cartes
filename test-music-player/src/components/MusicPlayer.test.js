import { render, screen, fireEvent } from '@testing-library/react';
import MusicPlayer from '../components/MusicPlayer';

describe('Tests du composant MusicPlayer', () => {
  test('affiche le bouton de bascule et bascule la visibilité du lecteur de musique', () => {
    render(<MusicPlayer />);
    
    // Vérification initiale pour l'état visible par défaut
    const toggleButton = screen.getByRole('button', { name: /🎵/i });
    expect(toggleButton).toBeInTheDocument();  // Vérifie si le bouton de bascule du lecteur de musique est présent

    // Simule un clic pour basculer la visibilité du lecteur de musique
    fireEvent.click(toggleButton);

    // Vérifiez si l'UI du lecteur de musique est visible ou cachée en fonction des changements de classe ou du rendu conditionnel.
  });
});
