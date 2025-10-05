"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState, useRef } from "react";
import { Vibrant } from "node-vibrant/browser";
import defaultImg from "../../../public/default.png";
import { MusicContext } from "@/context/MusicContextProvider";
import Marquee from "react-fast-marquee";
const DetailsComponent = ({
  playlistData,
  playName,
  playlistDescribe,
  count,
  image,
  type,
}: {
  playlistData: any;
  playName: string;
  playlistDescribe: string;
  count: string;
  image: string;
  type: string;
}) => {
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(to bottom, #000, #111)"
  );
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!image) return;
    Vibrant.from(image)
      .getPalette()
      .then((palette: any) => {
        if (palette.Vibrant && palette.DarkMuted) {
          const color1 = palette.LightVibrant.hex;
          setBgGradient(`linear-gradient(to bottom, ${color1}, black)`);
        }
      });
  }, [image]);

  const cleanSongName = (songName?: string): string => {
    if (!songName) return "";
    let s = String(songName);
    s = s.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    const safePercent = s.replace(/%(?![0-9A-Fa-f]{2})/g, "%25");
    try {
      return decodeURIComponent(safePercent);
    } catch {
      return safePercent;
    }
  };

  const durationMin = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const countData = (count: number) =>
    new Intl.NumberFormat("en-US").format(count);

  const songContext = useContext(MusicContext);
  if (!songContext) {
    throw new Error("MusicContext must be used within MusicContextProvider");
  }
  const { playSong } = songContext;
  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;
    const checkOverflow = () => {
      const isOver =
        textRef.current!.scrollWidth > containerRef.current!.clientWidth;
      setIsOverflowing(isOver);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [playlistData]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div
        className="w-full p-6 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-5 rounded-t-2xl"
        style={{ background: bgGradient }}
      >
        {image && (
          <Image
            src={image}
            width={240}
            height={240}
            className="rounded-md w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 object-cover"
            alt="playlist image"
          />
        )}
        <div className="w-full flex flex-col gap-2 text-left">
          <p className="text-gray-200 text-sm md:text-base font-medium uppercase">
            {type}
          </p>
          <h1 className="text-white font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            {decodeURIComponent(playName)}
          </h1>
          <p className="text-gray-200 text-base md:text-lg font-light italic">
            {cleanSongName(playlistDescribe)}
          </p>
          <p className="text-gray-300 text-sm md:text-base">{count} Songs</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 p-4 sm:p-8 md:p-12 mb-24">
        <div className="hidden sm:flex flex-row items-center justify-between text-gray-400 italic text-sm border-b border-gray-700 pb-2">
          <div className="flex flex-row items-center gap-10 pl-3">
            <p>#</p>
            <p>Title</p>
          </div>
          <div className="flex flex-row items-center justify-center gap-6">
            {(type === "Playlist" || type === "Album") && <p>Count</p>}
            <p className="w-32">Album</p>
            <p>Duration</p>
          </div>
        </div>

        {playlistData?.map((playlists: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-row items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gray-500 transition-all duration-200"
          >
            <div className="flex flex-row items-center gap-3 sm:gap-6 w-3/4 sm:w-2/3">
              <p className="hidden sm:block text-gray-300 w-6 text-sm sm:text-base">
                {idx + 1}
              </p>
              <Image
                src={playlists.image[1]?.url || defaultImg}
                width={50}
                height={50}
                className="rounded-md object-cover"
                alt="song image"
              />
              <div
                className="w-full flex flex-col text-left sm:text-left overflow-hidden whitespace-nowrap"
                ref={containerRef}
              >
                <span
                  ref={textRef}
                  className="relative block text-white font-medium text-sm sm:text-lg cursor-pointer hover:underline"
                  onClick={() =>
                    playSong(
                      {
                        url: playlists.downloadUrl[3]?.url,
                        title: cleanSongName(playlists.name),
                        artist: playlists.artists.primary[0]?.name || "Unknown",
                        img:
                          playlists.image[2]?.url ||
                          playlists.image[1]?.url ||
                          defaultImg.src,
                        duration: playlists.duration,
                        artistId: playlists.artists.primary[0]?.id,
                        currentIdx: idx,
                      },
                      playlistData.map((p: any, i: number) => ({
                        url: p.downloadUrl[3]?.url,
                        title: cleanSongName(p.name),
                        artist: p.artists.primary[0]?.name || "Unknown",
                        img:
                          p.image[2]?.url || p.image[1]?.url || defaultImg.src,
                        duration: p.duration,
                        artistId: p.artists.primary[0]?.id,
                        currentIdx: i,
                      })),
                      idx
                    )
                  }
                >
                  {isOverflowing ? (
                    <Marquee gradient={false} speed={20} pauseOnHover>
                      {cleanSongName(playlists.name) || "unknown"}
                    </Marquee>
                  ) : (
                    cleanSongName(playlists.name) || "unknown"
                  )}
                </span>

                <Link
                  href={{
                    pathname: `/artist/${encodeURIComponent(
                      playlists.artists.primary[0]?.name || "unknown"
                    )}`,
                    query: {
                      id: playlists.artists.primary[0]?.id || "741999",
                    },
                  }}
                >
                  <p className="text-gray-300 text-left text-xs sm:text-sm hover:underline">
                    {playlists.artists.primary[0]?.name || "unknown"}
                  </p>
                </Link>
              </div>
            </div>

            <div className="  flex flex-row items-end sm:items-center gap-4 text-gray-300 text-sm sm:text-base">
              {(type === "Playlist" || type === "Album") && (
                <p className="hidden sm:block">
                  {countData(playlists.playCount)}
                </p>
              )}
              <Link href={{ pathname: `/album/${playlists.album.id}` }}>
                <p className="hidden sm:block sm:w-40 truncate hover:underline">
                  {cleanSongName(playlists.album.name || "unknown")}
                </p>
              </Link>
              <p>{durationMin(playlists.duration)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsComponent;
