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
      `${API_BASE_URL}/search/playlists?query=telugu&page=1&limit=1000`
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
export const getArtist = async (artistName: string): Promise<string> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/search/artists?query=${artistName}&page=0&limit=1000`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getArtistSongsbyID = async (
  id: any,
  page: number
): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/artists/${id}/songs?page=${page}&sortBy=popularity&sortOrder=desc`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getAlbumSongsbyID = async (id: any): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/albums?id=${id}`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getQuerySongs = async (query: any): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/search/songs?query=${query}&page=1&limit=10000`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getAlbums = async (query: any): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/search/albums?query=${query}&page=1&limit=10000`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getArtists = async (query: any): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/search/artists?query=${query}&page=1&limit=500`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
export const getPlaylists = async (query: any): Promise<string | any> => {
  try {
    const { data } = await axios.get<SongUrlResponse>(
      `${API_BASE_URL}/search/playlists?query=${query}&page=1&limit=500`
    );
    return data.data;
  } catch (e) {
    console.error("Something went wrong while fetching the song URL:", e);
    throw e;
  }
};
