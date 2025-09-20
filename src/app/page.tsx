"use client";
import { useState, useEffect } from "react";
import { getTrendingSongs } from "@/lib/api";
import Loader from "./components/Loader";
export default function home() {
  const [songsData, setsongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getsongs = async () => {
      try {
        setLoading(true);
        const data = await getTrendingSongs();
        console.log(data);
        setsongsData(data?.data || []);
      } catch (e) {
        console.log("something went wrong with api", e);
      } finally {
        setLoading(true);
      }
    };
    getsongs();
  }, []);
  return (
    <section className="w-full min-h-screen">
      <div className="w-full h-full">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
