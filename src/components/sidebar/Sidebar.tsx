
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusic } from '@/contexts/MusicContext';
import { Plus, ListMusic } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { playlists, addPlaylist } = useMusic();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      addPlaylist(playlistName.trim());
      setPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  return (
    <div className="w-64 bg-player-sidebar border-r border-player-hover p-4 flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-player-text mb-2">
          <ListMusic className="inline-block mr-2 h-6 w-6" />
          Music Player
        </h1>
      </div>

      <nav className="mb-6">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-player-text hover:bg-player-hover mb-2"
        >
          Home
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-player-text hover:bg-player-hover mb-2"
        >
          Search
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-player-text hover:bg-player-hover"
        >
          Your Library
        </Button>
      </nav>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-player-secondary uppercase tracking-wider">
            Playlists
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
            className="text-player-secondary hover:text-player-text"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {showCreatePlaylist && (
          <div className="mb-4">
            <Input
              placeholder="Playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              className="bg-player-card border-player-hover text-player-text"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleCreatePlaylist}>
                Create
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreatePlaylist(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          {playlists.length === 0 ? (
            <p className="text-player-muted text-sm">No playlists yet</p>
          ) : (
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className="w-full justify-start text-player-secondary hover:text-player-text hover:bg-player-hover"
                >
                  <div className="truncate">
                    <div className="font-medium">{playlist.name}</div>
                    <div className="text-xs text-player-muted">
                      {playlist.tracks.length} song{playlist.tracks.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
