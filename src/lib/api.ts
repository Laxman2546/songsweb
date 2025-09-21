import axios from "axios";
interface songResponse {
  link: string;
  data: { songs: string };
}
const BASE_URL = process.env.url;
export const getTrendingSongs = async () => {
  try {
    const getSongs = await axios.get(
      `${BASE_URL}/search/playlists?query=telugu&page=5&limit=1000`
    );
    console.log(getSongs.data.data.results);
    return getSongs.data.data.results;
  } catch (e) {
    console.log(e, "something went wrong while fetchhing songs");
  }
};

export const getSongurl = async (id: String): Promise<string | undefined> => {
  try {
    const { data } = await axios.get<songResponse>(
      `https://jiosavan-api-with-playlist.vercel.app/api/playlists?id=${id}&limit=100`
    );
    console.log(data.data.songs);
    return data.data.songs;
  } catch (e) {
    console.log("something went wrong with the image", e);
  }
};
