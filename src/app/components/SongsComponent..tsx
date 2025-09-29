"use client";
import { useParams, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { getSongUrl } from "@/lib/api";
import { Vibrant } from "node-vibrant/browser";
import defaultImg from "../../../public/default.png";
import Link from "next/link";
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
  return (
    <div className="w-full min-h-screen flex flex-col">
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
                  <h1 className="text-xl text-white font-sans font-medium cursor-pointer">
                    {cleanSongName(playlists.name)}
                  </h1>
                  <Link
                    href={{
                      pathname: `/artist/${encodeURIComponent(
                        playlists.artists.primary[0]
                          ? playlists.artists.primary[0].name
                          : "unknown"
                      )}`,
                      query: {
                        id: playlists.artists.primary[0].id,
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
                <p className="w-20 text-right">
                  {countData(playlists.playCount)}
                </p>
                <Link href={{ pathname: `/album/${playlists.album.id}` }}>
                  <p className="w-40 truncate cursor-pointer hover:underline">
                    {cleanSongName(playlists.album.name)}
                  </p>
                </Link>
                <p className="w-16 text-right">
                  {durationMin(playlists.duration)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsComponent;
