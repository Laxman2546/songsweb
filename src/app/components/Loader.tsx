import React from "react";
import Image from "next/image";
import LoaderGif from "../../../public/Equalizer.gif";
const Loader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Image src={LoaderGif} alt="loader" />
      <h1 className="text-center">Loading Songs...</h1>
    </div>
  );
};

export default Loader;
