"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { getSongurl } from "@/lib/api";
export default function songDetails() {
  type playlist = {
    id: string;
    name: string;
    image: string[];
  };
  const { songdet } = useParams<{ songdet: string }>();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistData, setplaylistData] = useState<string[]>([]);

  useEffect(() => {
    const songUrl = async (playlistId: string) => {
      try {
        setLoading(true);
        const response = await getSongurl(playlistId);
        setplaylistData(response ? [response] : []);
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
  console.log(playlistData, "iam song link");
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full flex flex-col">
        {playlistData[0]?.map((playlists: any, idx: number) => (
          <div key={idx}>
            <div className="flex flex-row ">
              <Image
                src={playlists.image[1].url}
                width={80}
                height={60}
                alt="songimage"
              />
              <h1 className="text-white">{playlists.name}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
