import React from "react";
import Image from "next/image";
import Link from "next/link";
import { songDet } from "@/app/page";

const HomeSection = ({
  subtitle,
  title,
  data,
}: {
  title: string;
  subtitle?: string;
  data: songDet[];
}) => {
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <span className="text-sm md:text-base font-medium text-gray-400 mt-1">
            {subtitle}
          </span>
        )}

        <div
          className="w-full mt-5 grid 
          grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
          gap-4 sm:gap-5 place-items-center mr-5"
        >
          {data.map((playlists, idx) => (
            <Link
              href={{
                pathname: `/player/${playlists.id}`,
                query: {
                  img: playlists.image[2]?.url || playlists.image[0]?.url,
                },
              }}
              key={idx}
              className="w-full flex flex-col items-center group"
            >
              <div className="relative w-full max-w-[120px] sm:max-w-[120px] md:max-w-[240px] aspect-square">
                <Image
                  src={playlists.image[2]?.url || playlists.image[0]?.url}
                  alt={playlists.name}
                  fill
                  className="rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <p className="w-full truncate text-white text-center text-sm sm:text-base mt-3 line-clamp-1">
                {playlists.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
