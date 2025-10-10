import React from "react";
import Image from "next/image";
import Link from "next/link";
import { songDet } from "@/app/page";
const HomeSection = ({
  subtitle,
  title,
  data,
}: {
  title: String;
  subtitle?: String;
  data: songDet[];
}) => {
  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <span className="text-xs font-medium text-gray-400">{subtitle}</span>
        )}

        <div className="w-full mt-5 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6  gap-5 items-center justify-center">
          {data.map((playlists, idx) => (
            <Link
              href={{
                pathname: `/player/${playlists.id}`,
                query: {
                  img: playlists.image[2].url || playlists.image[0].url,
                },
              }}
              key={idx}
            >
              <div className="flex flex-col gap-5 cursor-pointer">
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
      </div>
    </div>
  );
};

export default HomeSection;
