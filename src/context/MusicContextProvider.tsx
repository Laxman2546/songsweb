"use client";
import React, { createContext, useState, ReactNode } from "react";

type Song = {
  url: string;
  title: string;
  artist: string;
  img: string;
  duration: number;
  currentIdx: number;
  artistId: number;
};

type MusicContextType = {
  currentSong: Song | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | null>>;
  queue: Song[];
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playSong: (song: Song, allSongs: Song[], index: number) => void;
  playNext: () => void;
  playPrev: () => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
};

export const MusicContext = createContext<MusicContextType | undefined>(
  undefined
);

export default function MusicContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [duration, setDuration] = useState(0);
  const playSong = (song: Song, allSongs: Song[], index: number) => {
    setCurrentSong(song);
    setQueue(allSongs);
    setIsPlaying(true);
    setCurrentIdx(index);
  };
  const playNext = () => {
    if (currentIdx < queue.length - 1) {
      setCurrentSong(queue[currentIdx + 1]);
      setCurrentIdx(currentIdx + 1);
    }
  };
  const playPrev = () => {
    if (currentIdx > 0) {
      setCurrentSong(queue[currentIdx - 1]);
      setCurrentIdx(currentIdx - 1);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        queue,
        setQueue,
        isPlaying,
        setIsPlaying,
        playSong,
        playNext,
        playPrev,
        currentIdx,
        setCurrentIdx,
        progress,
        setProgress,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
