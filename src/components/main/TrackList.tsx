
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { Track } from '@/types/music';
import { Play, Pause } from 'lucide-react';

interface TrackListProps {
  tracks: Track[];
}

export const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  const { state, dispatch } = useMusic();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track, index: number) => {
    if (state.currentTrack?.id === track.id && state.isPlaying) {
      dispatch({ type: 'PAUSE' });
    } else if (state.currentTrack?.id === track.id && !state.isPlaying) {
      dispatch({ type: 'RESUME' });
    } else {
      dispatch({ 
        type: 'PLAY_TRACK', 
        payload: { track, queue: tracks, index } 
      });
    }
  };

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => (
        <Card 
          key={track.id} 
          className="p-4 bg-player-card border-player-hover hover:bg-player-hover transition-colors music-card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={track.albumArt}
                alt={track.album}
                className="w-12 h-12 rounded object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePlayTrack(track, index)}
                className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
              >
                {state.currentTrack?.id === track.id && state.isPlaying ? (
                  <Pause className="h-4 w-4 text-white" />
                ) : (
                  <Play className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                state.currentTrack?.id === track.id ? 'text-player-primary' : 'text-player-text'
              }`}>
                {track.title}
              </h3>
              <p className="text-sm text-player-secondary truncate">
                {track.artist} • {track.album}
              </p>
            </div>

            <div className="text-sm text-player-muted">
              {formatDuration(track.duration)}
            </div>

            {state.currentTrack?.id === track.id && (
              <div className="flex items-center gap-1">
                <div className="equalizer-bar w-1 h-3 rounded-full"></div>
                <div className="equalizer-bar w-1 h-2 rounded-full"></div>
                <div className="equalizer-bar w-1 h-4 rounded-full"></div>
                <div className="equalizer-bar w-1 h-2 rounded-full"></div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
