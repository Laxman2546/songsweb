"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "@/context/MusicContextProvider";
import defaultImg from "@/../public/default.png";
import { Vibrant } from "node-vibrant/browser";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { FaBackwardStep, FaForwardStep } from "react-icons/fa6";
import Link from "next/link";

const PlayerCover = () => {
  const music = useContext(MusicContext);
  const songImg = music?.currentSong?.img || defaultImg.src;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(to bottom, #000, #111)"
  );
  

  useEffect(() => {
    if (!songImg) return;

    Vibrant.from(songImg)
      .getPalette()
      .then((palette: any) => {
        if (palette.LightVibrant && palette.DarkMuted) {
          const color1 = palette.LightVibrant.hex;
          const color2 = palette.DarkMuted.hex;
          setBgGradient(`linear-gradient(to top, ${color1}, black)`);
        }
      })
      .catch(() => {
        setBgGradient("linear-gradient(to bottom, #000, #111)");
      });
  }, [songImg]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (music?.isPlaying) {
      audio.play().catch((err) => console.warn("Autoplay failed:", err));
    } else {
      audio.pause();
    }
  }, [music?.isPlaying, music?.currentSong]);

  const togglePlay = () => {
    if (!music) return;
    music.setIsPlaying(!music.isPlaying);
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center rounded-t-3xl"
      style={{
        background: bgGradient,
        height: "calc(100vh - 100px)",
      }}
    >
      <div className=" flex items-center justify-center shadow-2xl mb-24">
        <Image
          src={songImg}
          alt={"songimage"}
          width={450}
          height={360}
          className="rounded-2xl shadow-xl object-cover"
        />
      </div>

      <div className="absolute bottom-0 w-full py-3 bg-black backdrop-blur-2xl rounded-t-xl">
        <div className="grid grid-cols-3 items-center px-6">
          <div className="flex items-center gap-3">
            <Image
              src={songImg}
              width={50}
              height={50}
              alt="mini cover"
              className="rounded-md shadow-md"
            />
            <div className="flex flex-col">
              <h1 className="font-semibold text-white text-sm truncate max-w-[250px]">
                {music?.currentSong?.title || "Unknown Title"}
              </h1>
              <Link
                href={{
                  pathname: `/artist/${encodeURIComponent(
                    music?.currentSong?.artist
                      ? music.currentSong.artist
                      : "unknown"
                  )}`,
                  query: {
                    id: music?.currentSong?.artistId
                      ? music.currentSong.artistId
                      : "741999",
                  },
                }}
              >
                <p className="text-gray-300 text-xs hover:cursor-pointer hover:underline">
                  {music?.currentSong?.artist || "Unknown Artist"}
                </p>
              </Link>
            </div>
          </div>
          <audio
            ref={audioRef}
            src={music?.currentSong?.url || ""}
            preload="metadata"
            controls={false}
            onEnded={() => music?.setIsPlaying(false)}
          ></audio>
          <input
          type="range"
          />
          <div className="flex flex-row gap-6 items-center justify-center">
            <FaBackwardStep
              onClick={music?.playPrev}
              size={28}
              className={`text-white/80  ${
                music?.currentIdx && music?.currentIdx > 0
                  ? "cursor-pointer hover:text-white transition-transform hover:scale-110"
                  : "cursor-not-allowed"
              }`}
            />
            {music?.isPlaying ? (
              <FaPauseCircle
                onClick={togglePlay}
                size={52}
                className="text-black bg-white rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-1"
              />
            ) : (
              <FaPlayCircle
                onClick={togglePlay}
                size={52}
                className="text-black bg-white rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-1"
              />
            )}

            <FaForwardStep
              onClick={music?.playNext}
              size={28}
              className={`text-white/80  ${
                music?.queue.length &&
                music.currentIdx == music?.queue.length - 1
                  ? "cursor-not-allowed"
                  : "cursor-pointer hover:text-white transition-transform hover:scale-110"
              }`}
            />
          </div>

          <div className="flex items-center justify-end text-white/60  text-lg hover:text-white cursor-pointer">
            •••
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCover;
