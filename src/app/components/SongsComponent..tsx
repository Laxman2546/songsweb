"use client";
import React from "react";
import Image from "next/image";
import defaultImg from "../../../public/default.png";
import Link from "next/link";
import { useContext, useState } from "react";
import { MusicContext } from "@/context/MusicContextProvider";
import { getSongSuggestions } from "@/lib/api";
const SongsComponent = ({
  playlistData,
  type,
}: {
  playlistData: any;
  type: string;
}) => {
  const cleanSongName = (songName: String) => {
    return decodeURIComponent(songName.replace(/&quot;|&amp;/g, '"'));
  };
  const durationMin = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const countData = (count: number) => {
    const formattedCount = new Intl.NumberFormat("en-US").format(count);
    return formattedCount;
  };
  const songContext = useContext(MusicContext);
  if (!songContext) {
    throw new Error("MusicContext must be used within MusicContextProvider");
  }
  const { playSong } = songContext;

  return (
    <div className="w-full min-h-screen flex flex-col px-3 sm:px-6 md:px-10 py-4">
      {type === "songs" || type === "albums" ? (
        <div className="w-full flex flex-col gap-3 sm:gap-5">
          {playlistData?.map((playlists: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-row items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-600/50 transition-all duration-200"
            >
              <div className="flex flex-row items-center gap-3 sm:gap-6 w-3/4 sm:w-2/3">
                <p className="hidden sm:block text-gray-400 w-6 text-sm sm:text-base">
                  {idx + 1}
                </p>

                <Image
                  src={
                    playlists.image?.[1]?.url
                      ? playlists.image[1].url
                      : defaultImg
                  }
                  width={50}
                  height={50}
                  className="rounded-md object-cover"
                  alt="song image"
                />

                <div className="flex flex-col overflow-hidden whitespace-nowrap">
                  {type !== "albums" ? (
                    <h1
                      className="text-white font-medium text-sm sm:text-lg cursor-pointer hover:underline truncate"
                      onClick={async () => {
                        try {
                          const response = await getSongSuggestions(
                            playlists.id
                          );
                          playSong(
                            {
                              url: playlists.downloadUrl[3]?.url,
                              title: cleanSongName(playlists.name),
                              artist:
                                playlists.artists.primary[0]?.name || "Unknown",
                              img:
                                playlists.image[2]?.url ||
                                playlists.image[1]?.url ||
                                defaultImg.src,
                              duration: playlists.duration,
                              artistId: playlists.artists.primary[0]?.id,
                              currentIdx: idx,
                            },
                            response.map((p: any, i: number) => ({
                              url: p.downloadUrl[3]?.url,
                              title: cleanSongName(p.name),
                              artist: p.artists.primary[0]?.name || "Unknown",
                              img:
                                p.image[2]?.url ||
                                p.image[1]?.url ||
                                defaultImg.src,
                              duration: p.duration,
                              artistId: p.artists.primary[0]?.id,
                              currentIdx: i,
                            })),
                            idx
                          );
                        } catch (e) {
                          console.log(e, "error occurred while suggestions");
                        }
                      }}
                    >
                      {cleanSongName(playlists.name)}
                    </h1>
                  ) : (
                    <Link href={`/album/${playlists.id}`}>
                      <h1 className="text-white font-medium text-sm sm:text-lg cursor-pointer hover:underline truncate">
                        {cleanSongName(playlists.name)}
                      </h1>
                    </Link>
                  )}

                  <Link
                    href={{
                      pathname: `/artist/${encodeURIComponent(
                        playlists.artists.primary[0]?.name || "unknown"
                      )}`,
                      query: {
                        id: playlists.artists.primary[0]?.id || "741999",
                      },
                    }}
                  >
                    <p className="text-gray-300 text-xs sm:text-sm hover:underline truncate">
                      {playlists.artists.primary[0]?.name || "unknown"}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="flex flex-row items-center gap-4 sm:gap-6 text-gray-300 text-xs sm:text-base">
                {type === "songs" && (
                  <p className="hidden sm:block w-20 text-right">
                    {countData(playlists.playCount)}
                  </p>
                )}
                <Link
                  href={{
                    pathname: `/album/${
                      type === "songs" ? playlists.album.id : playlists.id
                    }`,
                  }}
                >
                  <p className="hidden sm:block sm:w-40 truncate hover:underline">
                    {cleanSongName(
                      type === "songs" ? playlists.album.name : playlists.name
                    )}
                  </p>
                </Link>
                {type === "songs" && (
                  <p className="text-right">
                    {durationMin(playlists.duration)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6">
          {playlistData?.map((playlists: any, idx: number) => (
            <Link
              key={idx}
              href={{
                pathname:
                  type === "artists"
                    ? `/artist/${encodeURIComponent(
                        playlists.name || "unknown"
                      )}`
                    : `/player/${playlists.id}`,
                query: {
                  id:
                    type === "artists"
                      ? playlists.id || "741999"
                      : playlists.id,
                  img: playlists.image?.[2]?.url || playlists.image?.[0]?.url,
                },
              }}
            >
              <div
                className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer rounded-2xl 
            hover:scale-105 transition-all duration-300 shadow-md bg-gray-800/40 p-3 sm:p-4"
              >
                <img
                  src={
                    playlists.image?.[2]?.url ||
                    playlists.image?.[0]?.url ||
                    defaultImg.src
                  }
                  width={150}
                  height={150}
                  onError={(e) => (e.currentTarget.src = defaultImg.src)}
                  alt="image"
                  className={`object-cover shadow-lg ${
                    type === "artists" ? "rounded-full" : "rounded-xl"
                  }`}
                />
                <p className="max-w-[90px] sm:max-w-[140px] text-center text-white text-xs sm:text-sm font-medium truncate">
                  {playlists.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SongsComponent;
