"use client";
import { useParams, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { getSongUrl } from "@/lib/api";
import { Vibrant } from "node-vibrant/browser";

export default function songDetails() {
  type playlist = {
    id: string;
    name: string | any;
    image: string[];
    data: string[];
    songs: [string] | any;
  };
  const { songdet } = useParams<{ songdet: string }>();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistData, setplaylistData] = useState<playlist | any>([]);
  const [playlistName, setplaylistName] = useState<string | undefined>("");
  const [playlistDescription, setplaylistDescription] = useState<string>("");
  const [SongNo, setSongNo] = useState<string>("");
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(to bottom, #000, #111)"
  );
  const playlistImg = searchParams.get("img");
  useEffect(() => {
    if (!playlistImg) return;

    Vibrant.from(playlistImg)
      .getPalette()
      .then((palette: any) => {
        console.log(palette);
        if (palette.Vibrant && palette.DarkMuted) {
          const color1 = palette.LightVibrant.hex;
          const color2 = palette.LightMuted.hex;
          setBgGradient(`linear-gradient(to top, ${color1}, ${color2})`);
        }
      });
  }, [playlistImg]);
  useEffect(() => {
    const songUrl = async (playlistId: string) => {
      try {
        setLoading(true);
        const response = await getSongUrl(playlistId);
        setplaylistData(response ? [response.songs] : []);
        console.log("iam response", response.songs[0].artists.primary[0].name);
        setplaylistName(response ? response.name : undefined);
        setplaylistDescription(response ? response.description : "");
        setSongNo(response ? response.songCount : "");
      } catch (e) {
        console.log(e, "have an error with the url");
      } finally {
        setLoading(false);
      }
    };
    if (songdet) {
      songUrl(songdet);
    }
  }, [songdet, searchParams]);

  const cleanSongName = (songName: String) => {
    return songName.replace(/&quot;|&amp;/g, '"');
  };
  return (
    <div className="w-full min-h-screen flex flex-col">
      <div
        className="w-full p-12 rounded-t-2xl flex flex-row gap-5 items-center"
        style={{ background: bgGradient }}
      >
        <Image
          src={playlistImg as string}
          width={240}
          height={120}
          className="rounded-md"
          alt="songimage"
        />
        <div className="w-full flex flex-col gap-3">
          <h1 className="text-white font-medium text-xl">Playlist</h1>
          <h1 className="text-white  font-extrabold text-7xl">
            {playlistName}
          </h1>
          <div className="w-full flex flex-col gap-2">
            <p className="text-xl font-medium">
              {cleanSongName(playlistDescription)}
            </p>
            <p className="font-medium text-xl text-nowrap">{SongNo} Songs</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 p-12">
        {playlistData[0]?.map((playlists: any, idx: number) => (
          <div key={idx}>
            <div className="max-w-full flex flex-row items-center justify-between pr-24 hover:bg-gray-500">
              <div className="flex flex-row items-center gap-6">
                <div className="flex flex-row items-center gap-3">
                  <h1 className="text-md w-8 text-right">{idx + 1}</h1>
                  <Image
                    src={playlists.image[1].url}
                    width={50}
                    height={50}
                    className="rounded-sm"
                    alt="songimage"
                  />
                </div>

                <div className="flex flex-col">
                  <h1 className="text-xl text-white font-sans font-medium">
                    {cleanSongName(playlists.name)}
                  </h1>
                  <p className="text-md text-white">
                    {playlists.artists.primary[0].name}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center gap-8 text-white">
                <p className="w-20 text-right">{playlists.playCount}</p>
                <p className="w-40 truncate">{playlists.album.name}</p>
                <p className="w-16 text-right">{playlists.duration}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
