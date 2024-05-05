import { render, screen } from '@testing-library/react';
import MusicPlayer from '../MusicPlayer';

test('renders MusicPlayer and displays the toggle button', () => {
  render(<MusicPlayer roomId="123" style={{}} className="" />);
  const toggleButton = screen.getByRole('button', { name: /🎵/i });
  expect(toggleButton).toBeInTheDocument();
});
