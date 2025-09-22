import axios from "axios";
interface Playlist {
  id: string;
  title: string;
  image: string;
}

interface TrendingSongsResponse {
  data: {
    results: Playlist[];
  };
}

interface SongUrlResponse {
  data: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTrendingSongs = async () => {
  try {
    const { data } = await axios.get<TrendingSongsResponse>(
      `${API_BASE_URL}/search/playlists?query=telugu&page=5&limit=1000`
    );
    console.log(data.data.results);
    return data.data.results;
  } catch (e) {
    console.error("Something went wrong while fetching trending songs:", e);
    throw e;
  }
};

export const getSongUrl = async (id: string): Promise<string> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/playlists?id=${id}&limit=100`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
