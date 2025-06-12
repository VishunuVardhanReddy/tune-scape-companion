
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrackList } from './TrackList';
import { sampleTracks } from '@/data/sampleTracks';
import { Track } from '@/types/music';

export const MainContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>(sampleTracks);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTracks(sampleTracks);
    } else {
      const filtered = sampleTracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  };

  return (
    <div className="flex-1 bg-player-bg">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-player-text mb-4">Your Music</h2>
          <Input
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md bg-player-card border-player-hover text-player-text placeholder-player-muted"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <TrackList tracks={filteredTracks} />
        </ScrollArea>
      </div>
    </div>
  );
};
