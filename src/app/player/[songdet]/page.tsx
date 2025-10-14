"use client";
import { useParams, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
import { getSongUrl } from "@/lib/api";
import { Vibrant } from "node-vibrant/browser";
import DetailsComponent from "@/app/components/DetailsComponent";

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
  const [playlistName, setplaylistName] = useState<string>("");
  const [playlistDescription, setplaylistDescription] = useState<string>("");
  const [songNo, setSongNo] = useState<string>("");

  const playlistImg = searchParams.get("img");
  useEffect(() => {
    const songUrl = async (playlistId: string) => {
      try {
        setLoading(true);
        const response = await getSongUrl(playlistId);
        // @ts-ignore
        setplaylistData(response ? [response.songs] : []);
        // @ts-ignore
        setplaylistName(response ? response.name : undefined);
        // @ts-ignore
        setSongNo(response ? response.songCount : undefined);
        // @ts-ignore
        setplaylistDescription(response ? response.description || "" : "");
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

  return (
    <>
      <DetailsComponent
        playlistData={playlistData[0]}
        playName={playlistName}
        playlistDescribe={playlistDescription}
        count={songNo}
        image={playlistImg || ""}
        type={"Playlist"}
      />
    </>
  );
}
