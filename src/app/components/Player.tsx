"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "@/context/MusicContextProvider";
import defaultImg from "@/../public/default.png";
import { Vibrant } from "node-vibrant/browser";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import {
  FaBackwardStep,
  FaForwardStep,
  FaShuffle,
  FaHeart,
} from "react-icons/fa6";
import { MdOutlineLoop } from "react-icons/md";
import Link from "next/link";
import gsap from "gsap";
import { FaRegHeart } from "react-icons/fa";
import { MdFullscreen } from "react-icons/md";

const PlayerCover = () => {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState<number>(0);
  const music = useContext(MusicContext);
  const songImg = music?.currentSong?.img || defaultImg.src;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(to bottom, #000, #111)"
  );
  const [expanded, setExpanded] = useState(false);

  const handleMouseMove = () => {
    setIsMouseMoving(true);
    clearTimeout(timeoutRef.current as NodeJS.Timeout);
    timeoutRef.current = setTimeout(() => {
      setIsMouseMoving(false);
    }, 3000);
  };
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
    };
  }, []);
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

  useEffect(() => {
    if (!containerRef.current) return;
    if (!isMouseMoving) {
      containerRef.current.style.cursor = "none";
    } else {
      containerRef.current.style.cursor = "default";
    }
  }, [isMouseMoving]);
  useEffect(() => {
    if (!controlsRef.current) return;

    if (isMouseMoving) {
      gsap.to(controlsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        display: "block",
      });
    } else {
      gsap.to(controlsRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (controlsRef.current) {
            gsap.set(controlsRef.current, { display: "none" });
          }
        },
      });
    }
  }, [isMouseMoving]);

  useEffect(() => {
    if (!closeRef.current) return;

    if (isMouseMoving) {
      gsap.to(closeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        display: "block",
      });
    } else {
      gsap.to(closeRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (closeRef.current) {
            gsap.set(closeRef.current, { display: "none" });
          }
        },
      });
    }
  }, [isMouseMoving]);
  useEffect(() => {
    if (!textRef.current) return;

    if (!isMouseMoving) {
      gsap.to(textRef.current, {
        opacity: 1,
        y: -80,
        duration: 0.5,
        ease: "power2.in",
        display: "block",
      });
    } else {
      gsap.to(textRef.current, {
        opacity: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (textRef.current) {
            gsap.set(textRef.current, { display: "none" });
          }
        },
      });
    }
  }, [isMouseMoving]);

  const togglePlay = () => {
    if (!music) return;
    music.setIsPlaying(!music.isPlaying);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [music?.isPlaying]);

  const formatTime = (seconds?: any) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  const handleLike = (song: any) => {
    const storage = localStorage.getItem("likedsongs");
    if (!storage) {
      localStorage.setItem("likedsongs", JSON.stringify([song]));
      setIsLiked(true);
    } else {
      const likedSongs = JSON.parse(storage);
      const alreadyLiked = likedSongs.some((s: any) => s.url == song.url);
      if (alreadyLiked) {
        setIsLiked(true);
      } else {
        const setLike = localStorage.setItem(
          "likedsongs",
          JSON.stringify([...likedSongs, song])
        );
      }
    }
  };
  const checkIsLiked = () => {
    console.log("iam checking");
    const storage = localStorage.getItem("likedsongs");
    if (!storage) {
      return;
    } else {
      const likedSongs = JSON.parse(storage);
      const alreadyLiked = likedSongs.some(
        (s: any) => s.url == music?.currentSong?.url
      );
      if (alreadyLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  };

  useEffect(() => {
    checkIsLiked();
  }, [music?.currentSong]);
  const handleDislike = (song: any) => {
    const storage = localStorage.getItem("likedsongs");
    if (!storage) return;

    try {
      const likedSongs = JSON.parse(storage);
      const updatedSongs = likedSongs.filter((s: any) => s.url !== song.url);

      localStorage.setItem("likedsongs", JSON.stringify(updatedSongs));
      setIsLiked(false);
    } catch (err) {
      console.error("Error removing song from liked list:", err);
    }
  };

  useEffect(() => {
    if (expanded && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn("Fullscreen failed:", err);
      });
    }
  }, [expanded]);

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const audioElement = (
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
    />
  );

  if (!music?.currentSong) return null;

  if (!expanded) {
    return (
      <>
        {audioElement}
        <div className="fixed bottom-0 w-full py-2 md:py-3 bg-black backdrop-blur-2xl rounded-t-xl z-50">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center px-3 md:px-6 gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src={songImg}
                width={40}
                height={40}
                alt="mini cover"
                className="rounded-md shadow-md md:w-[50px] md:h-[50px]"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="font-semibold text-white text-xs md:text-sm truncate max-w-[120px] sm:max-w-[200px]">
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
                  <p className="text-gray-300 text-xs hover:cursor-pointer hover:underline truncate">
                    {music?.currentSong?.artist || "Unknown Artist"}
                  </p>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-3">
              <div className="flex flex-row gap-6 items-center justify-center">
                <FaShuffle
                  size={15}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    music?.shuffleActive
                      ? "bg-white text-black p-0.5 rounded-full size-4"
                      : "text-white/80"
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
                    size={35}
                    className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-0.5"
                  />
                ) : (
                  <FaPlayCircle
                    onClick={togglePlay}
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
                <MdOutlineLoop
                  size={20}
                  className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                />
                {isLiked ? (
                  <FaHeart
                    size={20}
                    onClick={() => handleDislike(music.currentSong)}
                    className="text-white/80 cursor-pointer transition-transform hover:scale-110 border-1 border-black"
                  />
                ) : (
                  <FaRegHeart
                    size={20}
                    onClick={() => handleLike(music.currentSong)}
                    className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                  />
                )}
              </div>
              <div className="w-full flex flex-row gap-3 items-center justify-center">
                <p className="text-sm font-light text-white">
                  {formatTime(music?.progress)}
                </p>

                <input
                  type="range"
                  min={0}
                  max={music?.currentSong?.duration ?? 0}
                  step={1}
                  value={isSeeking ? seekValue : music?.progress ?? 0}
                  className="slider"
                  style={
                    {
                      ["--progress" as any]: `${
                        music?.currentSong?.duration
                          ? ((isSeeking ? seekValue : music?.progress ?? 0) /
                              music?.currentSong?.duration) *
                            100
                          : 0
                      }%`,
                    } as React.CSSProperties
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSeekValue(val);
                    setIsSeeking(true);
                  }}
                  onMouseUp={(e) => {
                    const newTime = Number(
                      (e.target as HTMLInputElement).value
                    );
                    if (audioRef.current) {
                      audioRef.current.currentTime = newTime;
                    }
                    music?.setProgress?.(newTime);
                    setIsSeeking(false);
                  }}
                />
                <p className="text-sm font-light text-white">
                  {formatTime(music?.currentSong?.duration)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 md:gap-4">
              <div className="md:hidden">
                {music?.isPlaying ? (
                  <FaPauseCircle
                    onClick={togglePlay}
                    size={28}
                    className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                ) : (
                  <FaPlayCircle
                    onClick={togglePlay}
                    size={28}
                    className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
                  />
                )}
              </div>

              <div className="md:hidden">
                {isLiked ? (
                  <FaHeart
                    size={18}
                    onClick={() => handleDislike(music.currentSong)}
                    className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                  />
                ) : (
                  <FaRegHeart
                    size={18}
                    onClick={() => handleLike(music.currentSong)}
                    className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                  />
                )}
              </div>

              <MdFullscreen
                size={24}
                onClick={() => {
                  setExpanded(true);
                }}
                className="cursor-pointer hover:scale-110 transition-transform text-white"
              />
              <div className="hidden sm:block text-white/60 text-lg hover:text-white cursor-pointer">
                •••
              </div>
            </div>
          </div>

          <div className="md:hidden px-3 mt-2 flex items-center gap-2">
            <p className="text-xs font-light text-white min-w-[35px]">
              {formatTime(music?.progress)}
            </p>
            <input
              type="range"
              min={0}
              max={music?.currentSong?.duration ?? 0}
              step={1}
              value={isSeeking ? seekValue : music?.progress ?? 0}
              className="slider flex-1"
              style={
                {
                  ["--progress" as any]: `${
                    music?.currentSong?.duration
                      ? ((isSeeking ? seekValue : music?.progress ?? 0) /
                          music?.currentSong?.duration) *
                        100
                      : 0
                  }%`,
                } as React.CSSProperties
              }
              onChange={(e) => {
                const val = Number(e.target.value);
                setSeekValue(val);
                setIsSeeking(true);
              }}
              onMouseUp={(e) => {
                const newTime = Number((e.target as HTMLInputElement).value);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
                music?.setProgress?.(newTime);
                setIsSeeking(false);
              }}
              onTouchEnd={(e) => {
                const newTime = Number((e.target as HTMLInputElement).value);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
                music?.setProgress?.(newTime);
                setIsSeeking(false);
              }}
            />
            <p className="text-xs font-light text-white min-w-[35px] text-right">
              {formatTime(music?.currentSong?.duration)}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {audioElement}
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center "
        ref={containerRef}
        style={{
          background: bgGradient,
        }}
      >
        <button
          ref={closeRef}
          onClick={() => {
            setExpanded(false);
            exitFullscreen();
          }}
          className="absolute top-4 right-4 text-white text-lg bg-black/40 px-3 py-1 rounded-lg hover:bg-black/60 transition-colors cursor-pointer z-10"
        >
          ✕
        </button>

        <div className="flex items-center justify-center shadow-2xl mb-8">
          <Image
            src={songImg}
            alt={"songimage"}
            width={550}
            height={550}
            className="rounded-2xl shadow-xl object-cover"
          />
        </div>
        <div
          className="absolute bottom-0 w-full  px-5 flex flex-col"
          ref={textRef}
        >
          <h1
            className="text-2xl font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
"
          >
            {music.currentSong.title}
          </h1>
          <h1
            className="text-xl font-semibold text-gray-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
"
          >
            {music.currentSong.artist}
          </h1>
        </div>
        <div
          ref={controlsRef}
          className={`absolute bottom-0 w-full py-4 bg-black/95 backdrop-blur-2xl rounded-t-xl cursor-auto`}
        >
          <div className="fixed bottom-0 w-full py-2 md:py-3 bg-black backdrop-blur-2xl rounded-t-xl z-50">
            <div className="grid grid-cols-2 md:grid-cols-3 items-center px-3 md:px-6 gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Image
                  src={songImg}
                  width={40}
                  height={40}
                  alt="mini cover"
                  className="rounded-md shadow-md md:w-[50px] md:h-[50px]"
                />
                <div className="flex flex-col min-w-0">
                  <h1 className="font-semibold text-white text-xs md:text-sm truncate max-w-[120px] sm:max-w-[200px]">
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
                    <p className="text-gray-300 text-xs hover:cursor-pointer hover:underline truncate">
                      {music?.currentSong?.artist || "Unknown Artist"}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-3">
                <div className="flex flex-row gap-6 items-center justify-center">
                  <FaShuffle
                    size={15}
                    className={`cursor-pointer transition-transform hover:scale-110 ${
                      music?.shuffleActive
                        ? "bg-white text-black p-0.5 rounded-full size-4"
                        : "text-white/80"
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
                      size={35}
                      className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer p-0.5"
                    />
                  ) : (
                    <FaPlayCircle
                      onClick={togglePlay}
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
                  <MdOutlineLoop
                    size={20}
                    className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                  />
                  {isLiked ? (
                    <FaHeart
                      size={20}
                      onClick={() => handleDislike(music.currentSong)}
                      className="text-white/80 cursor-pointer transition-transform hover:scale-110 border-1 border-black"
                    />
                  ) : (
                    <FaRegHeart
                      size={20}
                      onClick={() => handleLike(music.currentSong)}
                      className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                    />
                  )}
                </div>
                <div className="w-full flex flex-row gap-3 items-center justify-center">
                  <p className="text-sm font-light text-white">
                    {formatTime(music?.progress)}
                  </p>

                  <input
                    type="range"
                    min={0}
                    max={music?.currentSong?.duration ?? 0}
                    step={1}
                    value={isSeeking ? seekValue : music?.progress ?? 0}
                    className="slider"
                    style={
                      {
                        ["--progress" as any]: `${
                          music?.currentSong?.duration
                            ? ((isSeeking ? seekValue : music?.progress ?? 0) /
                                music?.currentSong?.duration) *
                              100
                            : 0
                        }%`,
                      } as React.CSSProperties
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSeekValue(val);
                      setIsSeeking(true);
                    }}
                    onMouseUp={(e) => {
                      const newTime = Number(
                        (e.target as HTMLInputElement).value
                      );
                      if (audioRef.current) {
                        audioRef.current.currentTime = newTime;
                      }
                      music?.setProgress?.(newTime);
                      setIsSeeking(false);
                    }}
                  />
                  <p className="text-sm font-light text-white">
                    {formatTime(music?.currentSong?.duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 md:gap-4">
                <div className="md:hidden">
                  <FaBackwardStep
                    onClick={music?.playPrev}
                    size={20}
                    className={`text-white/80  ${
                      music?.currentIdx && music?.currentIdx > 0
                        ? "cursor-pointer hover:text-white transition-transform hover:scale-110"
                        : "cursor-not-allowed"
                    }`}
                  />
                </div>
                <div className="md:hidden">
                  {music?.isPlaying ? (
                    <FaPauseCircle
                      onClick={togglePlay}
                      size={28}
                      className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    />
                  ) : (
                    <FaPlayCircle
                      onClick={togglePlay}
                      size={28}
                      className="text-white bg-black rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    />
                  )}
                </div>
                <div className="md:hidden">
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
                </div>
                <div className="md:hidden">
                  {isLiked ? (
                    <FaHeart
                      size={18}
                      onClick={() => handleDislike(music.currentSong)}
                      className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                    />
                  ) : (
                    <FaRegHeart
                      size={18}
                      onClick={() => handleLike(music.currentSong)}
                      className="text-white/80 cursor-pointer transition-transform hover:scale-110"
                    />
                  )}
                </div>

                <div className="hidden sm:block text-white/60 text-lg hover:text-white cursor-pointer">
                  •••
                </div>
              </div>
            </div>

            <div className="md:hidden px-3 mt-2 flex items-center gap-2">
              <p className="text-xs font-light text-white min-w-[35px]">
                {formatTime(music?.progress)}
              </p>
              <input
                type="range"
                min={0}
                max={music?.currentSong?.duration ?? 0}
                step={1}
                value={isSeeking ? seekValue : music?.progress ?? 0}
                className="slider flex-1"
                style={
                  {
                    ["--progress" as any]: `${
                      music?.currentSong?.duration
                        ? ((isSeeking ? seekValue : music?.progress ?? 0) /
                            music?.currentSong?.duration) *
                          100
                        : 0
                    }%`,
                  } as React.CSSProperties
                }
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSeekValue(val);
                  setIsSeeking(true);
                }}
                onMouseUp={(e) => {
                  const newTime = Number((e.target as HTMLInputElement).value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                  music?.setProgress?.(newTime);
                  setIsSeeking(false);
                }}
                onTouchEnd={(e) => {
                  const newTime = Number((e.target as HTMLInputElement).value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = newTime;
                  }
                  music?.setProgress?.(newTime);
                  setIsSeeking(false);
                }}
              />
              <p className="text-xs font-light text-white min-w-[35px] text-right">
                {formatTime(music?.currentSong?.duration)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerCover;
