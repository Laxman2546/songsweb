"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "@/context/MusicContextProvider";
import defaultImg from "@/../public/default.png";
import { Vibrant } from "node-vibrant/browser";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { FaBackwardStep, FaForwardStep, FaShuffle } from "react-icons/fa6";
import { MdOutlineLoop } from "react-icons/md";
import Link from "next/link";
import "../songplayer/range.css";

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
  const formatTime = (seconds?: any) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        document.activeElement?.getAttribute("contenteditable") === "true";
      if (isTyping) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === "k") {
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [music?.isPlaying]);

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
          onClick={togglePlay}
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
            onEnded={() => {
              music?.setIsPlaying(false);
              music?.playNext?.();
            }}
            onTimeUpdate={() =>
              music?.setProgress(audioRef.current?.currentTime || 0)
            }
          ></audio>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-6 items-center justify-center">
              <FaShuffle
                size={15}
                className={`${
                  music?.shuffleActive
                    ? "bg-white text-black p-0.5 rounded-full size-4"
                    : ""
                }`}
                onClick={music?.toggleShuffle}
              />
              <FaBackwardStep
                onClick={music?.playPrev}
                size={20}
                className={`text-white/80  ${
                  music?.currentIdx && music?.currentIdx > 0
                    ? "cursor-pointer hover:text-white transition-transform hover:scale-110"
                    : "cursor-not-allowed"
                }`}
              />
              {music?.isPlaying ? (
                <FaPauseCircle
                  onClick={togglePlay}
                  tabIndex={0}
                  onKeyUp={(e) => {
                    if (
                      e.key === " " ||
                      e.key === "Space" ||
                      e.code === "Space" ||
                      e.keyCode === 32
                    ) {
                      console.log("pressed");
                      togglePlay();
                    }
                  }}
                  size={35}
                  className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-0.5"
                />
              ) : (
                <FaPlayCircle
                  onClick={togglePlay}
                  tabIndex={0}
                  onKeyUp={(e) => {
                    if (
                      e.key === " " ||
                      e.key === "Space" ||
                      e.code === "Space" ||
                      e.keyCode === 32
                    ) {
                      console.log("pressed");
                      togglePlay();
                    }
                  }}
                  size={35}
                  className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-0.5"
                />
              )}

              <FaForwardStep
                onClick={music?.playNext}
                size={20}
                className={`text-white/80  ${
                  music?.queue.length &&
                  music.currentIdx == music?.queue.length - 1
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:text-white transition-transform hover:scale-110"
                }`}
              />
              <MdOutlineLoop size={20} />
            </div>
            <div className="w-full flex flex-row gap-3 items-center justify-center">
              <p className="text-sm font-light text-white">
                {formatTime(music?.progress)}
              </p>

              <input
                type="range"
                min={0}
                max={music?.currentSong?.duration ?? 0}
                value={music?.progress ?? 0}
                className="slider"
                style={{
                  "--progress": `${
                    music?.currentSong?.duration
                      ? ((music?.progress ?? 0) /
                          music?.currentSong?.duration) *
                        100
                      : 0
                  }%`,
                }}
                onChange={(e) => {
                  const newTime = Number(e.target.value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                  music?.setProgress?.(newTime);
                }}
              />

              <p className="text-sm font-light text-white">
                {formatTime(music?.currentSong?.duration)}
              </p>
            </div>
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
