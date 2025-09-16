import { useAudioPlayer } from 'expo-audio';

// Audio assets
import playerMoveSound from '../../assets/audio/playerMove.mp3';
import winSound from '../../assets/audio/win.mp3';
import loseSound from '../../assets/audio/lose.mp3';
import drawSound from '../../assets/audio/draw.mp3';
import cpuMoveSound from '../../assets/audio/cpuMove.mp3';

export const useGameAudio = () => {
  // Create separate player instances for each unique usage
  const clickPlayer = useAudioPlayer(playerMoveSound);
  const winPlayer = useAudioPlayer(winSound);
  const losePlayer = useAudioPlayer(loseSound);
  const drawPlayer = useAudioPlayer(drawSound);
  const cpuMovePlayer = useAudioPlayer(cpuMoveSound);

  const playClick = () => {
    try {
      clickPlayer.seekTo(0);
      clickPlayer.play();
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const playWin = () => {
    try {
      winPlayer.seekTo(0);
      winPlayer.play();
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const playLose = () => {
    try {
      losePlayer.seekTo(0);
      losePlayer.play();
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const playDraw = () => {
    try {
      drawPlayer.seekTo(0);
      drawPlayer.play();
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  const playCpuMove = () => {
    try {
      cpuMovePlayer.seekTo(0);
      cpuMovePlayer.play();
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  return {
    playClick,
    playWin,
    playLose,
    playDraw,
    playCpuMove,
  };
};