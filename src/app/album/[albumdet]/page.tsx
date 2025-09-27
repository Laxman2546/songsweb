"use client";
import DetailsComponent from "@/app/components/DetailsComponent";
import { getAlbumSongsbyID } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const page = () => {
  const [songsData, setsongsData] = useState([]);
  const [albumImage, setalbumImage] = useState("");
  const [albumName, setalbumName] = useState("");
  const [albumDescription, setalbumDescription] = useState("");
  const [albumCount, setalbumCount] = useState();

  const { albumdet } = useParams();
  const fetchAlbum = async () => {
    try {
      const response = await getAlbumSongsbyID(albumdet);
      console.log(response);
      setsongsData(response.songs);
      setalbumDescription(response.description);
      setalbumName(response.name);
      setalbumImage(response.image[2].url);
      setalbumCount(response.songCount);
    } catch (e) {
      console.log("something went wrong with thealbum");
    }
  };
  useEffect(() => {
    fetchAlbum();
  }, []);
  return (
    <div>
      <DetailsComponent
        playlistData={songsData}
        playName={albumName}
        playlistDescribe={albumDescription}
        count={albumCount || ""}
        image={albumImage}
        type="Album"
      />
    </div>
  );
};

export default page;
