/* eslint-disable @typescript-eslint/camelcase */
export const INITIAL_LANDMARKS_AMOUNT = 2;
export const LANDMARKS_INCREMENT_AMOUNT = 3;
export const WRONG_CHOICES_AMOUNT = 3;
export const CACHED_PAGES = 1;
export const CACHED_IMAGES_PER_PAGE = 30;

export enum Country {
  Greece = 'Greece',
  France = 'France',
  The_Netherlands = 'The Netherlands',
  Netherlands = 'The Netherlands',
  Germany = 'Germany',
  South_Korea = 'South Korea',
  India = 'India',
  Iceland = 'Iceland',
  Bangladesh = 'Bangladesh',
  China = 'China',
  Malaysia = 'Malaysia',
  Egypt = 'Egypt',
  Indonesia = 'Indonesia',
  Australia = 'Australia',
  Italy = 'Italy',
  Spain = 'Spain',
  Peru = 'Peru',
  Japan = 'Japan',
  Mexico = 'Mexico',
  Portugal = 'Portugal',
  Canada = 'Canada',
  Turkey = 'Turkey',
  Croatia = 'Croatia',
  United_Arab_Emirates = 'United Arab Emirates',
  Vietnam = 'Vietnam',
  Hungary = 'Hungary',
  Thailand = 'Thailand',
  Pakistan = 'Pakistan',
  Guatemala = 'Guatemala',
  Singapore = 'Singapore',
  Singapour = 'Singapore',
  Switzerland = 'Switzerland',
  Sweden = 'Sweden',
  Austria = 'Austria',
  Finland = 'Finland',
  Denmark = 'Denmark',
  UK = 'UK',
  US = 'USA',
  United_Kingdom = 'UK',
  USA = 'USA',
  United_States = 'USA',
  United_States_of_America = 'USA',
  Estados_Unidos = 'USA',
  Russia = 'Russia',
  Russland = 'Russia',
  Nowhere_Land = 'Nowhere Land',
}

export type Landmark = {imageUrl: string; country: Country};

export const ERROR_LANDMARK: Landmark = {
  imageUrl: 'https://i.ytimg.com/vi/kSZjsGjBqqI/maxresdefault.jpg',
  country: Country.Nowhere_Land,
};
