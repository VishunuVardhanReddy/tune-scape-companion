
import React from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { MainContent } from './main/MainContent';
import { PlayerBar } from './player/PlayerBar';
import { MusicProvider } from '@/contexts/MusicContext';

export const MusicPlayerLayout: React.FC = () => {
  return (
    <MusicProvider>
      <div className="h-screen flex flex-col bg-player-bg text-player-text">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
        <PlayerBar />
      </div>
    </MusicProvider>
  );
};
