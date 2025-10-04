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
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (!searchQuery.trim()) router.push("/");

    const delayDebounce = setTimeout(() => {
      router.push(`/?q=${encodeURIComponent(searchQuery)}`);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router]);
  return (
    <>
      <div className="w-full p-3 flex flex-row  items-center justify-between ">
        <div className="w-full flex flex-row gap-10 items-center">
          <div>
            <Link href={"/"}>
              <Image
                className="cursor-pointer"
                src={logo}
                alt="Description of remote image"
                width={70}
                height={70}
              />
            </Link>
          </div>
          <div className="w-1/2 relative group">
            <input
              className="w-full p-3 pl-12 pr-10 bg-stone-900 rounded-3xl text-white
             hover:bg-stone-800 hover:shadow-lg hover:shadow-indigo-500/40
             outline-none font-medium placeholder:text-gray-400 placeholder:font-normal
             transition-all duration-300 "
              type="text"
              placeholder="Any song you’d like to hear ?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={24}
              className="absolute left-3 top-3 text-gray-400 group-hover:text-white group-active:text-white"
            />
            {searchQuery.length > 0 && searchQuery != "" && (
              <X
                onClick={() => {
                  setSearchQuery("");
                  router.push("/");
                }}
                size={24}
                className="absolute right-5 top-3 text-gray-400 hover:text-white cursor-pointer"
              />
            )}
          </div>
        </div>
        <div className="flex flex-row gap-12">
          <button
            className="flex flex-row items-center gap-2 rounded-full px-2 py-1
                     text-white transition-colors cursor-pointer
                     hover:bg-accent hover:text-black"
          >
            <CircleArrowDown size={24} className="shrink-0" />
            <span className="text-nowrap font-medium text-md">Install App</span>
          </button>
          <div className=" flex flex-row gap-5 py-2">
            <abbr title="Notifications">
              <div className="cursor-pointer hover:scale-110">
                <Bell size={24} />
              </div>
            </abbr>
            <Link href={"/likedsongs"}>
              <div className="cursor-pointer hover:scale-110">
                <abbr title="liked songs">
                  <HeartIcon size={24} />
                </abbr>
              </div>
            </Link>

            <div className="cursor-pointer hover:scale-110">
              <abbr title="Account">
                <UserCircle size={24} />
              </abbr>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
