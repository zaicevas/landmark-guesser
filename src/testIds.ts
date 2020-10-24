export const LOGO_IMAGE = 'LOGO_IMAGE';
export const PLAY_BUTTON = 'PLAY_BUTTON';
export const HISTORY_BUTTON = 'HISTORY_BUTTON';
export const PLAY_SCREEN = 'PLAY_SCREEN';
export const CORRECT_CHOICE = 'CORRECT_CHOICE';
export const HISTORY_LIST = 'HISTORY_LIST';

export const getCarouselViewTestId = (index: number) =>
  `CAROUSEL_VIEW_${index}`;

export const getCarouselViewLoaderTestId = (index: number) =>
  `CAROUSEL_VIEW_${index}_LOADER`;

export const getCorrectChoiceTestId = (carouselViewTestId: string) =>
  `${carouselViewTestId}_CORRECT_CHOICE`;

export const getWrongChoiceTestId = (
  carouselViewTestId: string,
  index: number,
) => `${carouselViewTestId}_WRONG_CHOICE_${index}`;
