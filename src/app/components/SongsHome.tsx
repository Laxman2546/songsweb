import React from "react";
import { useState, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { MusicContext } from "@/context/MusicContextProvider";
import defaultImg from "../../../public/default.png";

const SongsHome = ({
  data,
  title,
  subtitle,
}: {
  data: any;
  title: string;
  subtitle?: string;
}) => {
  const carsouleRef = useRef<HTMLDivElement>(null);
  const cleanSongName = (songName?: string): string => {
    if (!songName) return "";
    let s = String(songName);
    s = s.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const safePercent = s.replace(/%(?![0-9A-Fa-f]{2})/g, "%25");
    try {
      return decodeURIComponent(safePercent);
    } catch {
      return safePercent;
    }
  };

  const songContext = useContext(MusicContext);
  if (!songContext) {
    throw new Error("MusicContext must be used within MusicContextProvider");
  }
  const { playSong, isPlaying, currentSong } = songContext;
  const scroll = (direction: string) => {
    const { current } = carsouleRef;
    if (!current) return;
    const scrollAmount = 600;
    current.scrollBy({
      // @ts-ignore
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && (
        <span className="text-xs font-medium text-gray-400">{subtitle}</span>
      )}
      <div className="relative mt-5">
        <div className="md:hidden w-full flex gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          {data.map((song: any, idx: number) => (
            <div
              className="flex flex-col gap-2 cursor-pointer items-center text-center w-[100px] flex-shrink-0"
              onClick={() =>
                playSong(
                  {
                    url: song.downloadUrl[3]?.url,
                    title: cleanSongName(song.name),
                    artist: song.artists.primary[0]?.name || "Unknown",
                    img:
                      song.image[2]?.url ||
                      song.image[1]?.url ||
                      defaultImg.src,
                    duration: song.duration,
                    artistId: song.artists.primary[0]?.id,
                    currentIdx: idx,
                  },
                  data.map((p: any, i: number) => ({
                    url: p.downloadUrl[3]?.url,
                    title: cleanSongName(p.name),
                    artist: p.artists.primary[0]?.name || "Unknown",
                    img: p.image[2]?.url || p.image[1]?.url || defaultImg.src,
                    duration: p.duration,
                    artistId: p.artists.primary[0]?.id,
                    currentIdx: i,
                  })),
                  idx
                )
              }
              key={idx}
            >
              <Image
                src={song.image[2]?.url || song.image[0]?.url}
                alt="song image"
                width={100}
                height={100}
                className="rounded-xl object-cover w-[100px] h-[100px] transition-transform duration-200 hover:scale-105"
              />
              <p className="text-white text-xs truncate w-full">{song.name}</p>
            </div>
          ))}
        </div>

        <div
          ref={carsouleRef}
          className="hidden md:block w-full overflow-x-auto overflow-y-hidden scroll-smooth pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500"
        >
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-50 opacity-10 hover:opacity-100 bg-black/50 rounded-full p-1 hover:bg-black/70"
          >
            <CiCircleChevLeft size={40} color="#fff" />
          </button>
          <div className="flex relative gap-5">
            {data.map((song: any, idx: number) => (
              <div
                key={idx}
                className="w-[150px] flex flex-col gap-3 cursor-pointer items-center text-center min-w-[180px] flex-shrink-0"
              >
                <div className="relative group">
                  <Image
                    src={song.image[2]?.url || song.image[0]?.url}
                    alt="song image"
                    width={180}
                    height={180}
                    className="rounded-xl object-cover w-[180px] h-[180px] transition-transform duration-200 group-hover:scale-105"
                  />
                  {isPlaying &&
                  song.downloadUrl[3]?.url == songContext.currentSong?.url ? (
                    <FaPauseCircle
                      onClick={() => songContext.setIsPlaying(false)}
                      className="text-white bg-black rounded-full shadow-lg group-hover:scale-105  transition-transform cursor-pointer p-0.5 absolute right-5 bottom-5"
                      size={35}
                    />
                  ) : (
                    <FaPlayCircle
                      onClick={() =>
                        playSong(
                          {
                            url: song.downloadUrl[3]?.url,
                            title: cleanSongName(song.name),
                            artist: song.artists.primary[0]?.name || "Unknown",
                            img:
                              song.image[2]?.url ||
                              song.image[1]?.url ||
                              defaultImg.src,
                            duration: song.duration,
                            artistId: song.artists.primary[0]?.id,
                            currentIdx: idx,
                          },
                          data.map((p: any, i: number) => ({
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
                        )
                      }
                      className="text-white bg-black rounded-full shadow-lg group-hover:scale-105 group-hover:opacity-100 opacity-0 transition-transform cursor-pointer p-0.5 absolute right-5 bottom-5"
                      size={35}
                    />
                  )}
                </div>
                <p className="text-white text-base truncate w-full">
                  {cleanSongName(song.name)}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-50 opacity-10 hover:opacity-100 bg-black/50 rounded-full p-1 hover:bg-black/70"
          >
            <CiCircleChevRight size={40} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongsHome;
