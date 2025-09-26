"use client";
import DetailsComponent from "@/app/components/DetailsComponent";
import { getArtist, getArtistSongsbyID } from "@/lib/api";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { artistname } = useParams<{ artistname: string }>();
  const [number, setNumber] = useState(0);
  const fetchArtist = async () => {
    try {
      const response = await getArtist(decodeURIComponent(artistname));
      console.log(response);
      if (response) {
        const id = response.results[0].id || response.results[1].id || 741999;
        const getArtistSongs = await getArtistSongsbyID(id, number);
        console.log(getArtistSongs);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchArtist();
  });
  return (
    <div>
      {/* <DetailsComponent
      
      /> */}
    </div>
  );
};

export default page;
