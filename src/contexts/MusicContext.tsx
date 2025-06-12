
import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Track, Playlist, PlayerState } from '@/types/music';
import { toast } from '@/hooks/use-toast';

type MusicAction =
  | { type: 'PLAY_TRACK'; payload: { track: Track; queue?: Track[]; index?: number } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'UPDATE_CURRENT_TIME'; payload: number };

interface MusicContextType {
  state: PlayerState;
  playlists: Playlist[];
  audioRef: React.RefObject<HTMLAudioElement>;
  dispatch: React.Dispatch<MusicAction>;
  addPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  deletePlaylist: (playlistId: string) => void;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  shuffle: false,
  repeat: 'none',
  queue: [],
  currentIndex: 0,
};

const musicReducer = (state: PlayerState, action: MusicAction): PlayerState => {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: action.payload.queue || [action.payload.track],
        currentIndex: action.payload.index || 0,
        isPlaying: true,
        currentTime: 0,
      };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESUME':
      return { ...state, isPlaying: true };
    case 'STOP':
      return { ...state, isPlaying: false, currentTime: 0 };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'UPDATE_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'TOGGLE_REPEAT':
      const nextRepeat = state.repeat === 'none' ? 'playlist' : state.repeat === 'playlist' ? 'track' : 'none';
      return { ...state, repeat: nextRepeat };
    case 'NEXT_TRACK':
      if (state.queue.length === 0) return state;
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.queue.length) {
        nextIndex = state.repeat === 'playlist' ? 0 : state.currentIndex;
      }
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.queue[nextIndex],
        currentTime: 0,
      };
    case 'PREVIOUS_TRACK':
      if (state.queue.length === 0) return state;
      let prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = state.repeat === 'playlist' ? state.queue.length - 1 : 0;
      }
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.queue[prevIndex],
        currentTime: 0,
      };
    default:
      return state;
  }
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'UPDATE_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleEnded = () => {
      if (state.repeat === 'track') {
        audio.currentTime = 0;
        audio.play();
      } else {
        dispatch({ type: 'NEXT_TRACK' });
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.repeat]);

  // Update audio when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    if (audio.src !== state.currentTrack.audioUrl) {
      audio.src = state.currentTrack.audioUrl;
    }

    audio.volume = state.volume;
    audio.currentTime = state.currentTime;

    if (state.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [state.currentTrack, state.isPlaying, state.volume]);

  const addPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    toast({
      title: "Playlist created",
      description: `"${name}" has been created successfully.`,
    });
  };

  const addTrackToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: [...playlist.tracks, track] }
        : playlist
    ));
    toast({
      title: "Track added",
      description: `"${track.title}" has been added to the playlist.`,
    });
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, tracks: playlist.tracks.filter(track => track.id !== trackId) }
        : playlist
    ));
    toast({
      title: "Track removed",
      description: "Track has been removed from the playlist.",
    });
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    toast({
      title: "Playlist deleted",
      description: "Playlist has been deleted successfully.",
    });
  };

  return (
    <MusicContext.Provider value={{
      state,
      playlists,
      audioRef,
      dispatch,
      addPlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      deletePlaylist,
    }}>
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
