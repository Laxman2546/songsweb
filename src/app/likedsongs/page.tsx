"use client";
import React, { useState, useEffect } from "react";
import defaultImg from "../../../public/default.png";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { MusicContext } from "@/context/MusicContextProvider";

const page = () => {
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const getLikedSongs = () => {
    const songs = localStorage.getItem("likedsongs");
    if (songs) {
      try {
        const parsedSongs = JSON.parse(songs);
        setLikedSongs(Array.isArray(parsedSongs) ? parsedSongs : []);
      } catch (error) {
        console.error("Error parsing liked songs:", error);
        setLikedSongs([]);
      }
    } else {
      setLikedSongs([]);
    }
  };

  useEffect(() => {
    getLikedSongs();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "likedsongs") {
        getLikedSongs();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const cleanSongName = (songName?: string): string => {
    if (!songName) return "";
    let s = String(songName);
    s = s.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const safePercent = s.replace(/%(?![0-9A-Fa-f]{2})/g, "%25");
    try {
      return decodeURIComponent(safePercent);
    } catch (err) {
      return safePercent;
    }
  };

  const durationMin = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const songContext = useContext(MusicContext);
  if (!songContext) {
    throw new Error("MusicContext must be used within MusicContextProvider");
  }
  const { playSong } = songContext;
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-semibold p-4">Liked Songs</h1>

      {likedSongs?.map((playlists: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-row items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-500 transition-all duration-200"
        >
          <div className="flex flex-row items-center gap-3 sm:gap-6 w-3/4 sm:w-2/3">
            <p className="hidden sm:block text-gray-300 w-6 text-sm sm:text-base">
              {idx + 1}
            </p>

            <Image
              src={playlists.img ? playlists.img : defaultImg}
              width={50}
              height={50}
              className="rounded-md object-cover"
              alt="song image"
            />

            <div className="w-full flex flex-col text-left overflow-hidden whitespace-nowrap">
              <span
                className="block text-white font-medium text-sm sm:text-lg cursor-pointer hover:underline"
                onClick={() =>
                  playSong(
                    playlists,
                    likedSongs.map((p: any, i: number) => ({
                      url: p.url,
                      title: p.title,
                      artist: p.artist,
                      img: p.img,
                      duration: p.duration,
                      artistId: p.artistId,
                      currentIdx: i,
                    })),
                    idx
                  )
                }
              >
                {cleanSongName(playlists.title) || "unknown"}
              </span>

              <Link
                href={{
                  pathname: `/artist/${encodeURIComponent(
                    playlists.artists ? playlists.artists : "unknown"
                  )}`,
                  query: { id: playlists.artistId },
                }}
              >
                <p className="text-gray-300 text-xs sm:text-sm hover:underline">
                  {playlists.artist || "unknown"}
                </p>
              </Link>
            </div>
          </div>

          <div className="flex flex-row items-end sm:items-center gap-4 text-gray-300 text-sm sm:text-base">
            <p className="text-right">{durationMin(playlists.duration)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
