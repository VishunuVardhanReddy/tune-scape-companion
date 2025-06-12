
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/MusicContext';
import { Play, Pause, Stop, Volume } from 'lucide-react';

export const PlayerBar: React.FC = () => {
  const { state, dispatch } = useMusic();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (state.isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else if (state.currentTrack) {
      dispatch({ type: 'RESUME' });
    }
  };

  const handleStop = () => {
    dispatch({ type: 'STOP' });
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch({ type: 'SET_VOLUME', payload: value[0] });
  };

  const handleSeek = (value: number[]) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: value[0] });
  };

  const handleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const handleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  if (!state.currentTrack) {
    return (
      <div className="h-20 bg-player-card border-t border-player-hover flex items-center justify-center">
        <p className="text-player-muted">Select a song to start playing</p>
      </div>
    );
  }

  return (
    <div className="h-20 bg-player-card border-t border-player-hover px-4 flex items-center gap-4">
      {/* Current Track Info */}
      <div className="flex items-center gap-3 min-w-0 w-64">
        <img
          src={state.currentTrack.albumArt}
          alt={state.currentTrack.album}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-player-text truncate">
            {state.currentTrack.title}
          </h4>
          <p className="text-sm text-player-secondary truncate">
            {state.currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShuffle}
            className={`text-player-text hover:text-player-primary ${
              state.shuffle ? 'text-player-primary' : ''
            }`}
          >
            🔀
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="text-player-text hover:text-player-primary"
          >
            ⏮️
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className="text-player-text hover:text-player-primary bg-player-primary/10 hover:bg-player-primary/20"
          >
            {state.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="text-player-text hover:text-player-primary"
          >
            ⏭️
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRepeat}
            className={`text-player-text hover:text-player-primary ${
              state.repeat !== 'none' ? 'text-player-primary' : ''
            }`}
          >
            {state.repeat === 'track' ? '🔂' : '🔁'}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-player-muted min-w-[40px]">
            {formatTime(state.currentTime)}
          </span>
          <Slider
            value={[state.currentTime]}
            max={state.currentTrack.duration}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-player-muted min-w-[40px]">
            {formatTime(state.currentTrack.duration)}
          </span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 w-32">
        <Volume className="h-4 w-4 text-player-muted" />
        <Slider
          value={[state.volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};
