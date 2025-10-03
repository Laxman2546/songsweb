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
    <div className="p-8 flex flex-col gap-5">
      <div className="flex flex-row gap-8 ">
        <div
          className={`p-3 pl-8 pr-8 rounded-3xl  font-medium cursor-pointer ${
            active == "Songs"
              ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setActive("Songs")}
        >
          <p>Songs</p>
        </div>
        <div
          className={`p-3 pl-8 pr-8 rounded-3xl  font-medium cursor-pointer ${
            active == "Albums"
              ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setActive("Albums")}
        >
          <p>Albums</p>
        </div>
        <div
          className={`p-3 pl-8 pr-8 rounded-3xl  font-medium cursor-pointer ${
            active == "Artists"
              ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setActive("Artists")}
        >
          <p>Artists</p>
        </div>
        <div
          className={`p-3 pl-8 pr-8 rounded-3xl  font-medium cursor-pointer ${
            active == "Playlists"
              ? "bg-gradient-to-r from-blue-600 to-fuchsia-500 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => setActive("Playlists")}
        >
          <p>Playlists</p>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-bold">
          Search results for "{query}" {active}
        </h1>
      </div>
      <div>
        {loading ? (
          <div>
            <h1 className="text-2xl font-semibold">Fetching songs...</h1>
          </div>
        ) : (
          <>
            {resultsData.length < 1 || (albumData.length < 1 && !loading) ? (
              <p className="text-3xl font-medium">No {active} found</p>
            ) : active == "Songs" ? (
              <SongsComponent playlistData={resultsData} type="songs" />
            ) : active == "Albums" ? (
              <SongsComponent playlistData={albumData} type="albums" />
            ) : active == "Artists" ? (
              artistData.length > 1 ? (
                <SongsComponent playlistData={artistData} type="artists" />
              ) : (
                <p className="text-3xl font-medium">No {active} found</p>
              )
            ) : playlistData.length > 1 ? (
              <SongsComponent playlistData={playlistData} type="playlists" />
            ) : (
              <p className="text-3xl font-medium">No {active} found</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
