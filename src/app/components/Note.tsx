import React from "react";

const Note = ({ handleGoback, handleUnderStand }: any) => {
  return (
    <div className="max-w-[500px] bg-black text-white p-8">
      <p>
        Notice: The music data displayed on this website is fetched from an
        unofficial API source. The content belongs to its original copyright
        owners and is shown only for demonstration and learning purposes. No
        copyrighted material is stored, distributed, or used commercially. If
        you are the owner of any content and want it removed, please contact us.
      </p>
      <div className="w-full flex gap-2 justify-end mt-4  ">
        <button
          className="text-center text-black bg-white p-2"
          onClick={handleGoback}
        >
          Go back
        </button>
        <button
          className="text-center text-black bg-white p-2"
          onClick={handleUnderStand}
        >
          I,Understand
        </button>
      </div>
    </div>
  );
};

export default Note;
