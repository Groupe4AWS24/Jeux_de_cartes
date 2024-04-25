import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MusicPlayer from './MusicPlayer';

describe('MusicPlayer Component', () => {
  // Test pour vérifier si le composant se rend correctement
  test('renders MusicPlayer component', () => {
    render(<MusicPlayer roomId="123" />);
    expect(screen.getByText('🎵')).toBeInTheDocument();
  });

  // Test pour vérifier si le bouton de lecture/pause fonctionne
  test('toggles play and pause', () => {
    render(<MusicPlayer roomId="123" />);
    const playPauseButton = screen.getByRole('button', { name: '▶️' });
    fireEvent.click(playPauseButton);
    expect(playPauseButton).toHaveTextContent('⏸️');
    fireEvent.click(playPauseButton);
    expect(playPauseButton).toHaveTextContent('▶️');
  });

  // Test pour vérifier si le changement de piste fonctionne
  test('changes track on button click', () => {
    render(<MusicPlayer roomId="123" />);
    const nextTrackButton = screen.getByRole('button', { name: '⏭️' });
    fireEvent.click(nextTrackButton);
    // Supposons que le nom de la piste change à "Nintendo" après un clic
    expect(screen.getByText('Nintendo')).toBeInTheDocument();
  });

  // Test pour vérifier le fonctionnement du slider de volume
  test('changes volume', () => {
    render(<MusicPlayer roomId="123" />);
    const volumeSlider = screen.getByRole('slider');
    fireEvent.change(volumeSlider, { target: { value: 80 } });
    expect(volumeSlider.value).toBe('80');
  });
});
