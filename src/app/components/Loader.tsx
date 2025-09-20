import React from "react";
import Image from "next/image";
import LoaderGif from "../../../public/Equalizer.gif";
const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image src={LoaderGif} alt="loader" className="w-54 h-54 object-cover" />
    </div>
  );
};

export default Loader;
