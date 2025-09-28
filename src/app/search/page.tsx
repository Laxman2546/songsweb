import { getQuerySongs } from "@/lib/api";
import React, { useEffect, useState } from "react";

type SearchResultsProps = {
  query?: string;
};

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [active, setActive] = useState("Songs");
  const [resultsData, setrResultsData] = useState([]);
  const fetchResults = async () => {
    const response = await getQuerySongs(query);
    console.log(response);
  };
  useEffect(() => {
    fetchResults();
  });
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
        
      </div>
    </div>
  );
};

export default SearchResults;
