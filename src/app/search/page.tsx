"use client";
import { getQuerySongs, getAlbums, getArtists, getPlaylists } from "@/lib/api";
import React, { useEffect, useState } from "react";
import SongsComponent from "../components/SongsComponent.";

type SearchResultsProps = {
  query?: string;
};

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [active, setActive] = useState("Songs");
  const [resultsData, setrResultsData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchResults = async () => {
    try {
      setLoading(true);
      switch (active) {
        case "Songs":
          const responseSongs = await getQuerySongs(query);
          setrResultsData(responseSongs.results);
        case "Albums":
          const responseAlbums = await getAlbums(query);
          setAlbumData(responseAlbums.results);
        case "Artists":
          const responseArtists = await getArtists(query);
          setArtistData(responseArtists.results);
        case "Playlists":
          const responsePlaylists = await getPlaylists(query);
          setPlaylistData(responsePlaylists.results);
      }
    } catch (e) {
      console.log(e, "error in the active songs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResults();
  }, [query]);
  return (
    <div className="p-4 sm:p-8 flex flex-col gap-5 w-full">
      <div className="flex flex-wrap gap-3 sm:gap-6 justify-center sm:justify-start">
        {["Songs", "Albums", "Artists", "Playlists"].map((tab) => (
          <div
            key={tab}
            className={`px-5 py-2 sm:px-8 sm:py-3 rounded-3xl font-medium cursor-pointer text-sm sm:text-base transition-all duration-200 ${
              active === tab
                ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white shadow-md scale-105"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            onClick={() => setActive(tab)}
          >
            <p>{tab}</p>
          </div>
        ))}
      </div>

      <div className="w-full mt-2">
        {loading ? (
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold animate-pulse">
              Fetching {active.toLowerCase()}...
            </h1>
          </div>
        ) : (
          <>
            {resultsData.length < 1 ||
            (albumData.length < 1 &&
              !loading &&
              active !== "Artists" &&
              active !== "Playlists") ? (
              <p className="text-center sm:text-left text-xl sm:text-2xl font-medium">
                No {active} found
              </p>
            ) : active === "Songs" ? (
              <SongsComponent playlistData={resultsData} type="songs" />
            ) : active === "Albums" ? (
              <SongsComponent playlistData={albumData} type="albums" />
            ) : active === "Artists" ? (
              artistData.length > 1 ? (
                <SongsComponent playlistData={artistData} type="artists" />
              ) : (
                <p className="text-center sm:text-left text-xl sm:text-2xl font-medium">
                  No {active} found
                </p>
              )
            ) : playlistData.length > 1 ? (
              <SongsComponent playlistData={playlistData} type="playlists" />
            ) : (
              <p className="text-center sm:text-left text-xl sm:text-2xl font-medium">
                No {active} found
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
