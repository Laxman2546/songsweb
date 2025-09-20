import axios from "axios";

export const getTrendingSongs = async () => {
  try {
    const getSongs = await axios.get(
      "https://trending-page.onrender.com/feed/trending?type=music&region=IN"
    );
    return getSongs;
  } catch (e) {
    console.log(e, "something went wrong while fetchhing songs");
  }
};
