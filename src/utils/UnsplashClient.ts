import axios from 'axios';
// const fetch = require('node-fetch');

export const fetchImagePage = async (
  page: number,
  imagesPerPage: number,
): Promise<ImagePage> => {
  return (
    await axios.get<ImagePage>(
      `search/photos?query=landmark&page=${page}&per_page=${imagesPerPage}`,
    )
  ).data;
};

export const fetchImageInfo = async (id: string): Promise<ImageInfo> => {
  return (await axios.get<ImageInfo>(`photos/${id}`)).data;
};

interface ImageUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

interface ImagePage {
  results: {
    id: string;
    urls: ImageUrls;
  }[];
}

interface ImageInfo {
  location?: {
    country?: string;
  };
  urls: ImageUrls;
  user: {
    name: string;
    links: {
      html: string;
    }
  }
}
