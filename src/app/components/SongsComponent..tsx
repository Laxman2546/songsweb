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
    <div className="w-full min-h-screen flex flex-col">
      {type == "songs" || type == "albums" ? (
        <div className="w-full flex flex-col gap-5">
          {playlistData?.map((playlists: any, idx: number) => (
            <div key={idx}>
              <div className="max-w-full flex flex-row items-center justify-between p-2 pr-24 hover:bg-gray-500 rounded-xl">
                <div className="flex flex-row items-center gap-6">
                  <div className="flex flex-row items-center gap-3">
                    <h1 className="text-md w-8 text-right">{idx + 1}</h1>
                    <Image
                      src={
                        playlists.image[1].url
                          ? playlists.image[1].url
                          : defaultImg
                      }
                      width={50}
                      height={50}
                      className="rounded-sm"
                      alt="songimage"
                    />
                  </div>

                  <div className="flex flex-col">
                    {type !== "albums" ? (
                      <h1
                        className="text-xl text-white font-sans font-medium cursor-pointer"
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
                                  playlists.artists.primary[0]?.name ||
                                  "Unknown",
                                img:
                                  playlists.image[2]?.url ||
                                  playlists.image[1]?.url ||
                                  defaultImg.src,
                                duration: playlists.duration,
                                artistId: playlists.artists.primary[0].id,
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
                                artistId: p.artists.primary[0].id,
                                currentIdx: i,
                              })),
                              idx
                            );
                          } catch (e) {
                            console.log(e, "error occured while suggestions");
                          }
                        }}
                      >
                        {cleanSongName(playlists.name)}
                      </h1>
                    ) : (
                      <Link href={`/album/${playlists.id}`}>
                        <h1 className="text-xl text-white font-sans font-medium cursor-pointer hover:underline">
                          {cleanSongName(playlists.name)}
                        </h1>
                      </Link>
                    )}

                    <Link
                      href={{
                        pathname: `/artist/${encodeURIComponent(
                          playlists.artists.primary[0]
                            ? playlists.artists.primary[0].name
                            : "unknown"
                        )}`,
                        query: {
                          id: playlists.artists.primary[0]
                            ? playlists.artists.primary[0].id
                            : "741999",
                        },
                      }}
                    >
                      <p className="text-md text-white cursor-pointer hover:underline">
                        {playlists.artists.primary[0]
                          ? playlists.artists.primary[0].name
                          : "unknown"}
                      </p>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-8 text-white">
                  {type == "songs" && (
                    <p className="w-20 text-right">
                      {countData(playlists.playCount)}
                    </p>
                  )}
                  <Link
                    href={{
                      pathname: `/album/${
                        type == "songs" ? playlists.album.id : playlists.id
                      }`,
                    }}
                  >
                    <p className="w-40 truncate cursor-pointer hover:underline">
                      {cleanSongName(
                        type == "songs" ? playlists.album.name : playlists.name
                      )}
                    </p>
                  </Link>
                  {type == "songs" && (
                    <p className="w-16 text-right">
                      {durationMin(playlists.duration)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-6  lg:grid-cols-7 gap-5">
          {playlistData?.map((playlists: any, idx: number) => (
            <Link
              key={idx}
              href={{
                pathname:
                  type == "artists"
                    ? `/artist/${encodeURIComponent(
                        playlists.name ? playlists.name : "unknown"
                      )}`
                    : `/player/${playlists.id}`,
                query: {
                  id:
                    type == "artists"
                      ? playlists.id
                        ? playlists.id
                        : "741999"
                      : playlists.id,
                  img: playlists.image?.[2]?.url || playlists.image?.[0]?.url,
                },
              }}
            >
              <div
                className="flex flex-col items-center gap-3 cursor-pointer 
                rounded-2xl
                   hover:scale-105 transition-all duration-300 shadow-md"
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
                    type == "artists" ? "rounded-full" : "rounded-xl"
                  }`}
                />
                <p className="max-w-[80px] md:max-w-[150px] text-center text-white text-sm md:text-base font-medium truncate">
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
