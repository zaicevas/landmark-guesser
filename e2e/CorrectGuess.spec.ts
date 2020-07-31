import {by, expect, device, element} from 'detox';
import {
  PLAY_BUTTON,
  HISTORY_BUTTON,
  HISTORY_LIST,
  getCorrectChoiceTestId,
  getCarouselViewTestId,
} from '../src/testIds';
import {CORRECT_TOAST_TEXT} from '../src/constants/Toast';
import {Country} from '../src/constants/Game';

describe('CorrectGuess', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should be able to guess correctly and see entry in history', async () => {
    await element(by.id(PLAY_BUTTON)).tap();
    await element(
      by.id(getCorrectChoiceTestId(getCarouselViewTestId(0))),
    ).tap();
    await waitFor(
      element(by.label(buildToastLabel(CORRECT_TOAST_TEXT))),
    ).toBeVisible();
    await navigateBack();
    await element(by.id(HISTORY_BUTTON)).tap();
    await expect(
      element(by.text(Country.France).withAncestor(by.id(HISTORY_LIST))),
    ).toBeVisible();
  });
});

const buildToastLabel = (message: string) => `notification ${message}`;

const navigateBack = async () => {
  await element(by.traits(['button']).withAncestor(by.type('UINavigationBar')))
    .atIndex(0)
    .tap();
};
