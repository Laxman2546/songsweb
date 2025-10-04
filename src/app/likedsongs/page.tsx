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
    <div>
      <h1 className="text-3xl font-semibold p-4">Liked songs</h1>
      {likedSongs?.map((playlists: any, idx: number) => (
        <div key={idx}>
          <div className="max-w-full flex flex-row items-center justify-between p-2 pr-24 hover:bg-gray-500 rounded-xl">
            <div className="flex flex-row items-center gap-6">
              <div className="flex flex-row items-center gap-3">
                <h1 className="text-md w-8 text-right">{idx + 1}</h1>
                <Image
                  src={playlists.img ? playlists.img : defaultImg}
                  width={50}
                  height={50}
                  className="rounded-sm"
                  alt="songimage"
                />
              </div>

              <div className="flex flex-col">
                <h1
                  className="text-xl text-white font-sans font-medium cursor-pointer"
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
                </h1>
                <Link
                  href={{
                    pathname: `/artist/${encodeURIComponent(
                      playlists.artists ? playlists.artists : "unknown"
                    )}`,
                    query: { id: playlists.artistId },
                  }}
                >
                  <p className="text-md text-white cursor-pointer hover:underline">
                    {playlists.artist || "unknown"}
                  </p>
                </Link>
              </div>
            </div>
            <div className="flex flex-row items-center gap-8 text-white">
              <p className="w-16 text-right">
                {durationMin(playlists.duration)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default page;
