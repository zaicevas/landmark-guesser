import AsyncStorage from '@react-native-community/async-storage';
import {fetchImagePage} from './UnsplashClient';
import {IMAGE_IDS} from '../constants/AsyncStorage';

export const cacheInitialImageIds = async (
  pages: number,
  imagesPerPage: number,
): Promise<string[]> => {
  const cachedIds = await getCachedImageIds();
  const alreadyCached = cachedIds.length === pages * imagesPerPage;

  if (!alreadyCached) {
    const ids = await fetchImageIds(pages, imagesPerPage);
    AsyncStorage.setItem(IMAGE_IDS, JSON.stringify(ids));
    console.log(`Cached ${ids.length} image ids`);
    return ids;
  }
  return cachedIds;
};

const getCachedImageIds = async (): Promise<string[]> => {
  const ids = await AsyncStorage.getItem(IMAGE_IDS);
  return JSON.parse(ids || '[]');
};

const fetchImageIds = async (
  pages: number,
  imagesPerPage: number,
): Promise<string[]> => {
  const imageIds: Promise<string[]>[] = [];
  for (let i = 0; i < pages; i++)
    imageIds.push(getSingleImagePage(i + 1, imagesPerPage));
  return (await Promise.all(imageIds)).flat();
};

const getSingleImagePage = async (index: number, imagesPerPage: number) => {
  const response = await fetchImagePage(index, imagesPerPage);
  return response.results.map((img) => img.id);
};
