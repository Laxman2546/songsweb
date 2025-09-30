"use client";
import React, { createContext, useState, ReactNode } from "react";

type Song = {
  url: string;
  title: string;
  artist: string;
  img: string;
  duration: number;
};

type MusicContextType = {
  currentSong: Song | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | null>>;
  queue: Song[];
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playSong: (song: Song, allSongs: Song[]) => void;
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

  const playSong = (song: Song, allSongs: Song[]) => {
    setCurrentSong(song);
    setQueue(allSongs);
    setIsPlaying(true);
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
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
