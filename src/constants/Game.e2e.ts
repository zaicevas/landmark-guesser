/* eslint-disable @typescript-eslint/camelcase */
export const INITIAL_LANDMARKS_AMOUNT = 1;
export const LANDMARKS_INCREMENT_AMOUNT = 3;
export const WRONG_CHOICES_AMOUNT = 3;
export const CACHED_PAGES = 1;
export const CACHED_IMAGES_PER_PAGE = 1;

export enum Country {
  Greece = 'Greece',
  France = 'France',
  The_Netherlands = 'The Netherlands',
  Iceland = 'Iceland',
  Nowhere_Land = 'Nowhere Land',
}

export type Landmark = {imageUrl: string; country: Country};

export const ERROR_LANDMARK: Landmark = {
  imageUrl: 'https://i.ytimg.com/vi/kSZjsGjBqqI/maxresdefault.jpg',
  country: Country.Nowhere_Land,
};
