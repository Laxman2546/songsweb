"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";

type Song = {
  url: string;
  title: string;
  artist: string;
  img: string;
  duration: string;
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
  toggleShuffle: () => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  currentIdx: number;
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>;
  shuffleActive: boolean;
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
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]); // store original order
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffleActive, setShuffleActive] = useState(false);

  const playSong = (song: Song, allSongs: Song[], index: number) => {
    setCurrentSong(song);
    setQueue(allSongs);
    setOriginalQueue(allSongs);
    setIsPlaying(true);
    setCurrentIdx(index);
    setShuffleActive(false);
  };
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong ? currentSong?.title : "Song title",
        artist: currentSong?.artist || "Artist Name",
        album: currentSong?.title,
        artwork: [
          {
            src: currentSong?.img || "/logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("play", () => {
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        playPrev();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        playNext();
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        setProgress(0);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        setProgress(100);
      });
      navigator.mediaSession.setActionHandler("stop", () => {
        setIsPlaying(false);
      });
    }
  }, [currentSong]);
  const playNext = () => {
    if (currentIdx < queue.length - 1) {
      setCurrentSong(queue[currentIdx + 1]);
      setCurrentIdx(currentIdx + 1);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (currentIdx > 0) {
      setCurrentSong(queue[currentIdx - 1]);
      setCurrentIdx(currentIdx - 1);
    }
  };
  const toggleShuffle = () => {
    if (!currentSong) return;

    if (!shuffleActive) {
      const shuffled = [...queue];
      for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const currentIndexInShuffled = shuffled.findIndex(
        (s) => s.url === currentSong.url
      );
      if (currentIndexInShuffled !== -1) {
        [shuffled[0], shuffled[currentIndexInShuffled]] = [
          shuffled[currentIndexInShuffled],
          shuffled[0],
        ];
      }

      setQueue(shuffled);
      setCurrentIdx(0);
    } else {
      setQueue(originalQueue);

      const songIndex = originalQueue.findIndex(
        (s) => s.url === currentSong.url
      );
      setCurrentIdx(songIndex >= 0 ? songIndex : 0);
    }

    setShuffleActive(!shuffleActive);
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
        shuffleActive,
        toggleShuffle,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
