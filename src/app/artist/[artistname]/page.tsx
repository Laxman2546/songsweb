"use client";
import DetailsComponent from "@/app/components/DetailsComponent";
import { getArtist, getArtistSongsbyID } from "@/lib/api";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
const page = () => {
  const { artistname } = useParams<{ artistname: string }>();
  const [pageNumber, setPageNumber] = useState(0);
  const [artistImage, setartistImage] = useState("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [artistsSongsData, setArtistsSongsData] = useState<any[] | []>([]);
  const [count, setCount] = useState<string | undefined>("");
  const artistDescription = `Top songs from ${artistname}`;
  const searchpararms = useSearchParams();
  const artistId = searchpararms.get("id");
  const fetchArtist = async (page: number) => {
    try {
      const response = await getArtist(decodeURIComponent(artistname));
      setartistImage(response.results[0].image[2].url);
      if (response && artistId) {
        const getArtistSongs = await getArtistSongsbyID(artistId, page);
        console.log(getArtistSongs);
        setHasMore(getArtistSongs.songs.length > 0);
        setArtistsSongsData((prev) => [...prev, ...getArtistSongs.songs]);
        setCount(getArtistSongs.total);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      },
      {
        rootMargin: "25px",
      }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (artistId) {
      fetchArtist(pageNumber);
    }
  }, [pageNumber, artistId]);
  return (
    <div>
      <DetailsComponent
        playlistData={artistsSongsData}
        playName={artistname}
        playlistDescribe={artistDescription}
        count={count || ""}
        image={artistImage}
        type="Artist"
      />
      {hasMore && (
        <div ref={loaderRef} className="text-center mt-4">
          <p>Loading more songs...</p>
        </div>
      )}
      {artistsSongsData.length === 0 && !hasMore && <p>No songs available.</p>}
    </div>
  );
};

export default page;
