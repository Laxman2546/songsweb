"use client";
import Image from "next/image";
import logo from "../../../public/logo.png";
import {
  Bell,
  CircleArrowDown,
  HeartIcon,
  Search,
  UserCircle,
  X,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!searchQuery.trim()) router.push("/");

    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim())
        router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router]);

  return (
    <nav className="w-full px-4 py-3 bg-transparent flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-4 w-full md:w-auto">
        <Link href={"/"}>
          <Image
            className="cursor-pointer"
            src={logo}
            alt="App Logo"
            width={55}
            height={55}
          />
        </Link>

        <div className="hidden sm:block w-full md:w-[400px] relative group">
          <input
            className="w-full p-2 pl-10 pr-10 bg-stone-900 rounded-3xl text-white
             hover:bg-stone-800 hover:shadow-lg hover:shadow-indigo-500/40
             outline-none font-medium placeholder:text-gray-400 placeholder:font-normal
             transition-all duration-300 text-sm sm:text-base"
            type="text"
            placeholder="Any song you’d like to hear?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={20}
            className="absolute left-3 top-2.5 text-gray-400 group-hover:text-white"
          />
          {searchQuery && (
            <X
              onClick={() => {
                setSearchQuery("");
                router.push("/");
              }}
              size={20}
              className="absolute right-4 top-2.5 text-gray-400 hover:text-white cursor-pointer"
            />
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-row items-center gap-8">
        <a href="https://nanimusic.vercel.app/" target="_blank">
          <button className="flex flex-row items-center gap-2 rounded-full px-2 py-1 text-white transition-colors cursor-pointer hover:bg-accent hover:text-black">
            <CircleArrowDown size={24} className="shrink-0" />
            <span className="text-nowrap font-medium text-md ">
              Install App
            </span>
          </button>
        </a>
        <div className="flex flex-row items-center gap-6 text-white">
          <Link href={"/notifications"}>
            <abbr title="Notifications">
              <Bell
                size={22}
                className="cursor-pointer hover:scale-110 transition"
              />
            </abbr>
          </Link>
          <Link href={"/likedsongs"}>
            <abbr title="Liked Songs">
              <HeartIcon
                size={22}
                className="cursor-pointer hover:scale-110 transition"
              />
            </abbr>
          </Link>
          <abbr title="Account">
            <UserCircle
              size={24}
              className="cursor-pointer hover:scale-110 transition"
            />
          </abbr>
        </div>
      </div>

      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black p-4 flex flex-col gap-4 md:hidden border-t border-stone-800 z-50">
          <div className="relative group">
            <input
              className="w-full p-2 pl-10 pr-10 bg-stone-800 rounded-3xl text-white
             outline-none font-medium placeholder:text-gray-400 transition-all duration-300"
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={20}
              className="absolute left-3 top-2.5 text-gray-400 group-hover:text-white"
            />
          </div>

          <Link href="/likedsongs" onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center gap-2 text-white pl-5 font-semibold">
              <HeartIcon size={20} /> Liked Songs
            </div>
          </Link>
          <a href="https://nanimusic.vercel.app/" target="_blank">
            <button className="flex items-center gap-2 text-white pl-5 font-semibold">
              <CircleArrowDown size={20} /> Install App
            </button>
          </a>
          <Link href={"/notifications"}>
            <div className="flex items-center gap-2 text-white pl-5 font-semibold">
              <Bell size={20} /> Notifications
            </div>
          </Link>
          <div className="flex items-center gap-2 text-white pl-5 font-semibold">
            <UserCircle size={20} /> Account
          </div>
        </div>
      )}
    </nav>
  );
}
