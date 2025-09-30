"use client";
import { useState, useEffect, useContext } from "react";
import { getTrendingSongs } from "@/lib/api";
import Loader from "./components/Loader";
import Image from "next/image";
import Link from "next/link";
interface songDet {
  id: string;
  name: string;
  image: { url: string }[];
}
export default function home() {
  const [songsData, setsongsData] = useState<songDet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const getsongs = async () => {
      try {
        setLoading(true);
        const data = await getTrendingSongs();
        setsongsData(data);
      } catch (e) {
        console.log("something went wrong with api", e);
      } finally {
        setLoading(false);
      }
    };
    getsongs();
  }, []);
  return (
    <section className="w-full min-h-screen">
      <div className="w-full h-full items-center justify-center">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center mt-8">
            <Loader />
          </div>
        ) : (
          <div className="w-full grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7  gap-5 items-center justify-center pl-8">
            {songsData.map((playlists, idx) => (
              <Link
                href={{
                  pathname: `/player/${playlists.id}`,
                  query: {
                    img: playlists.image[2].url || playlists.image[0].url,
                  },
                }}
                key={idx}
              >
                <div className="flex flex-col gap-2 cursor-pointer">
                  <Image
                    src={playlists.image[2].url || playlists.image[0].url}
                    alt="song image"
                    width={280}
                    height={160}
                    className="rounded-xl"
                  />
                  <p className="text-white max-w-80 text-center">
                    {playlists.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
