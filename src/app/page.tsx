"use client";
import { useState, useEffect, useContext } from "react";
import { getTrendingSongs, getTrendingSongUrl } from "@/lib/api";
import Loader from "./components/Loader";
import HomeSection from "./components/HomeSection";
import Image from "next/image";
import Link from "next/link";
export interface songDet {
  id: string;
  name: string;
  image: { url: string }[];
}
export default function home() {
  const [songsData, setsongsData] = useState<songDet[]>([]);
  const [madeForyou, setMadeForyou] = useState<songDet[]>([]);
  const [artistPick, setArtistPick] = useState<songDet[]>([]);
  const [yearlyPicks, setYearlyPicks] = useState<songDet[]>([]);
  const [topPicks, setTopPicks] = useState<songDet[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const getsongs = async () => {
      try {
        setLoading(true);
        const data = await getTrendingSongs();
        setsongsData(data);
        console.log(data);
        const selectedPlaylists = data.filter((_, idx) => {
          return (
            idx == 5 ||
            idx == 10 ||
            idx == 6 ||
            idx == 21 ||
            idx == 30 ||
            idx == 32
          );
        });
        setMadeForyou(selectedPlaylists);
        const artistData = data.filter((_, idx) => {
          return (
            idx == 22 ||
            idx == 28 ||
            idx == 31 ||
            idx == 34 ||
            idx == 55 ||
            idx == 47
          );
        });
        setArtistPick(artistData);
        const topPicksData = data.filter((_, idx) => {
          return (
            idx == 5 ||
            idx == 10 ||
            idx == 29 ||
            idx == 20 ||
            idx == 27 ||
            idx == 16
          );
        });
        setTopPicks(topPicksData);
        const yearlyOrder = [7, 3, 2, 0, 1];
        const yearlyData = yearlyOrder.map((i) => data[i]).filter(Boolean);
        setYearlyPicks(yearlyData);
      } catch (e) {
        console.log("something went wrong with api", e);
      } finally {
        setLoading(false);
      }
    };
    getsongs();
  }, []);
  const getTrendingSongsbylink = async (query: string) => {
    try {
      const songsResult = await getTrendingSongUrl(query);
      setTrendingSongs(songsResult.songs);
      console.log(songsResult, "iam trending songs");
    } catch (e) {
      console.log("something went wrong with api", e);
    }
  };
  useEffect(() => {
    getTrendingSongsbylink(
      "https://www.jiosaavn.com/featured/kotha-tunes/bDjUXq26B5Y_"
    );
  }, []);

  return (
    <section className="w-full min-h-screen">
      <div className="w-full h-full items-center justify-center">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center mt-8">
            <Loader />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-5 pl-8">
            <div className="w-full mt-5 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6  gap-5 items-center justify-center">
              {trendingSongs.slice(0, 6).map((song, idx) => (
                <Link
                  href={{
                    pathname: `/player/${song.id}`,
                    query: {
                      img: song.image[2].url || song.image[0].url,
                    },
                  }}
                  key={idx}
                >
                  <div className="flex flex-col gap-5 cursor-pointer">
                    <Image
                      src={song.image[2].url || song.image[0].url}
                      alt="song image"
                      width={280}
                      height={160}
                      className="rounded-xl"
                    />
                    <p className="text-white max-w-80 text-center">
                      {song.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <HomeSection title="Artsist picks" data={artistPick} />
            <HomeSection
              subtitle="Made for you"
              title="Playlists"
              data={madeForyou}
            />
            <HomeSection
              title="Music Through the Years"
              subtitle={"From retro classics to 2000 hits"}
              data={yearlyPicks}
            />
            <HomeSection
              title="Top Picks"
              data={topPicks}
              subtitle={"A blend of the best — just for you."}
            />
          </div>
        )}
      </div>
    </section>
  );
}
