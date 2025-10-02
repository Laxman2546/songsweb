"use client";
import { useParams, useSearchParams } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { getSongUrl } from "@/lib/api";
import { Vibrant } from "node-vibrant/browser";
import defaultImg from "../../../public/default.png";
import Link from "next/link";
import { MusicContext } from "@/context/MusicContextProvider";

const DetailsComponent = ({
  playlistData,
  playName,
  playlistDescribe,
  count,
  image,
  type,
}: {
  playlistData: any;
  playName: string;
  playlistDescribe: string;
  count: string;
  image: string;
  type: string;
}) => {
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(to bottom, #000, #111)"
  );
  useEffect(() => {
    if (!image) return;

    Vibrant.from(image)
      .getPalette()
      .then((palette: any) => {
        if (palette.Vibrant && palette.DarkMuted) {
          const color1 = palette.LightVibrant.hex;
          setBgGradient(`linear-gradient(to bottom, ${color1}, black)`);
        }
      });
  }, [image]);

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
      <div
        className="w-full p-12 rounded-t-2xl flex flex-row gap-5 items-center"
        style={{ background: bgGradient }}
      >
        {image && (
          <Image
            src={image}
            width={240}
            height={120}
            className="rounded-md"
            alt="songimage"
          />
        )}
        <div className="w-full flex flex-col gap-3">
          <h1 className="text-white font-medium text-xl">{type}</h1>
          <h1 className="text-white  font-extrabold text-7xl">
            {decodeURIComponent(playName)}
          </h1>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xl font-medium">
              {cleanSongName(playlistDescribe)}
            </p>
            <p className="font-medium text-xl text-nowrap">{count} Songs</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 p-12">
        <div className="flex flex-col">
          <div className="max-w-full flex flex-row items-center justify-between p-2 pr-24">
            <div className="flex flex-row items-center gap-12 pl-5">
              <p className="text-right font-light text-sm text-gray-400 italic">
                #
              </p>
              <h1 className=" font-light text-sm text-gray-400 italic">
                Title
              </h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-8 text-white">
              {type == "Playlist" ||
                (type == "Album" && (
                  <p className="w-20 text-right font-light text-sm text-gray-400 italic">
                    Count
                  </p>
                ))}
              <p className="w-40 truncate font-light text-sm text-gray-400 italic">
                Album
              </p>
              <p className="w-16 text-right font-light text-sm text-gray-400 italic">
                Duration
              </p>
            </div>
          </div>
          <span className="w-full h-[1px] bg-gray-200"></span>
        </div>
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
                  <Link
                    href="/songplayer"
                    onClick={() =>
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
                          artistId: playlists.artists.primary[0].id,
                          currentIdx: idx,
                        },
                        playlistData.map((p: any, i: number) => ({
                          url: p.downloadUrl[3]?.url,
                          title: cleanSongName(p.name),
                          artist: p.artists.primary[0]?.name || "Unknown",
                          img:
                            p.image[2]?.url || p.img[1].url || defaultImg.src,
                          duration: p.duration,
                          artistId: p.artists.primary[0].id,
                          currentIdx: i,
                        })),
                        idx
                      )
                    }
                  >
                    <h1 className="text-xl text-white font-sans font-medium cursor-pointer">
                      {cleanSongName(playlists.name) || "unknown"}
                    </h1>
                  </Link>
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
                {type == "Playlist" ||
                  (type == "Album" && (
                    <p className="w-20 text-right">
                      {countData(playlists.playCount)}
                    </p>
                  ))}
                <Link href={{ pathname: `/album/${playlists.album.id}` }}>
                  <p className="w-40 truncate cursor-pointer hover:underline">
                    {cleanSongName(playlists.album.name || "unknown")}
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

export default DetailsComponent;
