import {ComponentDriver} from 'react-component-driver';
import {buildPlayScreen} from './PlayScreen';
import LandmarkGetter from '../utils/LandmarkGetter';
import {
  getCorrectChoiceTestId,
  getCarouselViewTestId,
  getCarouselViewLoaderTestId,
} from '../testIds';
import {act} from 'react-test-renderer';
import {
  Country,
  INITIAL_LANDMARKS_AMOUNT,
  WRONG_CHOICES_AMOUNT,
} from '../constants/Game';
import ChoiceHistory, {HistoryItem, Storage} from '../utils/HistoryItem';
import {CHOICE_HISTORY} from '../constants/AsyncStorage';

const MOCK_IMAGE_URL = 'MOCK_IMAGE_URL';

const mockLandmark = {
  country: Country.France,
  imageUrl: MOCK_IMAGE_URL,
};

let landmarkGetter: LandmarkGetter;
let playScreen: PlayScreen;
const storage: Storage = {setItem: jest.fn(), getItem: jest.fn()};
const choiceHistory = new ChoiceHistory(storage);

beforeEach(() => {
  landmarkGetter = new LandmarkGetter(Promise.resolve(['1']));
  landmarkGetter.getLandmark = jest.fn(() => Promise.resolve(mockLandmark));
  playScreen = new PlayScreen(landmarkGetter, choiceHistory);
  storage.setItem = jest.fn();
  storage.getItem = jest.fn();
});

it('should render loader', async () => {
  playScreen.render();

  expect(playScreen.getLoader()).toBeDefined();
});

describe('Renders choices and images', () => {
  it('should render correct choice button', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
    });

    expect(landmarkGetter.getLandmark).toHaveBeenCalledTimes(
      INITIAL_LANDMARKS_AMOUNT,
    );
  });

  it('should render wrong choice buttons', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
    });

    expect(playScreen.getWrongChoiceButtons().length).toStrictEqual(
      WRONG_CHOICES_AMOUNT,
    );
  });

  it('should render all buttons not disabled', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
    });

    expect(playScreen.getWrongChoiceButtons().length).toStrictEqual(
      WRONG_CHOICES_AMOUNT,
    );
  });

  it('should render correct image url INITIAL_LANDMARKS_AMOUNT times', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
    });
    expect(playScreen.imagesWithUrl(MOCK_IMAGE_URL).length).toStrictEqual(
      INITIAL_LANDMARKS_AMOUNT,
    );
  });

  it('should enable all choice buttons', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
    });

    expect(playScreen.areChoiceButtonsEnabled()).toBe(true);
  });
});

describe('On choice press', () => {
  it('should save correct choice to storage', async () => {
    storage.getItem = jest.fn(() => Promise.resolve('[]'));

    await act(async () => {
      playScreen.render();
      await flushPromises();
      playScreen.tapCorrectChoice();
      await flushPromises();
    });

    const choice: HistoryItem = {
      id: '0',
      guess: Country.France,
      answer: Country.France,
      imgUrl: MOCK_IMAGE_URL,
    };

    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith(CHOICE_HISTORY);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(
      CHOICE_HISTORY,
      JSON.stringify([choice]),
    );
  });

  it('should save multiple correct choices to storage', async () => {
    const choice1: HistoryItem = {
      id: '0',
      guess: Country.France,
      answer: Country.France,
      imgUrl: MOCK_IMAGE_URL,
    };

    const choice2: HistoryItem = {
      id: '1',
      guess: Country.France,
      answer: Country.France,
      imgUrl: MOCK_IMAGE_URL,
    };

    storage.getItem = jest
      .fn()
      .mockResolvedValueOnce('[]')
      .mockResolvedValueOnce(JSON.stringify([choice1]));

    await act(async () => {
      playScreen.render();
      await flushPromises();
      playScreen.tapCorrectChoice().swipeLeft().tapCorrectChoice();
      await flushPromises();
    });

    expect(storage.getItem).toHaveBeenNthCalledWith(1, CHOICE_HISTORY);
    expect(storage.getItem).toHaveBeenNthCalledWith(2, CHOICE_HISTORY);
    expect(storage.getItem).toHaveBeenCalledWith(CHOICE_HISTORY);
    expect(storage.setItem).toHaveBeenNthCalledWith(
      1,
      CHOICE_HISTORY,
      JSON.stringify([choice1]),
    );
    expect(storage.setItem).toHaveBeenNthCalledWith(
      2,
      CHOICE_HISTORY,
      JSON.stringify([choice2, choice1]),
    );
  });

  it('should save wrong choice to storage', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
      playScreen.tapWrongChoice();
      await flushPromises();
    });

    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith(CHOICE_HISTORY);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it('should disable correct choice button after correct choice press', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
      playScreen.tapCorrectChoice();
      await flushPromises();
    });

    expect(playScreen.isCorrectChoiceButtonDisabled()).toBe(true);
  });

  it('should disable all choice buttons after wrong choice press', async () => {
    await act(async () => {
      playScreen.render();
      await flushPromises();
      playScreen.tapCorrectChoice();
      await flushPromises();
    });

    expect(playScreen.areWrongChoiceButtonsDisabled()).toBe(true);
  });
});

class PlayScreen extends ComponentDriver<{}> {
  private carouselViewIndex = 0;

  constructor(_landmarkGetter: LandmarkGetter, _choiceHistory: ChoiceHistory) {
    super(buildPlayScreen(_landmarkGetter, _choiceHistory));
  }

  swipeLeft() {
    this.carouselViewIndex++;
    return this;
  }

  getWrongChoiceButtons() {
    return this.filterByID(
      new RegExp(`CAROUSEL_VIEW_${this.carouselViewIndex}_WRONG_CHOICE`),
    );
  }

  getAllChoiceButtons() {
    return this.filterByID(
      new RegExp(`CAROUSEL_VIEW_${this.carouselViewIndex}`),
    );
  }

  areChoiceButtonsEnabled() {
    return this.getAllChoiceButtons().every((button) => !button.props.disabled);
  }

  areWrongChoiceButtonsDisabled() {
    return this.getWrongChoiceButtons().every(
      (button) => button.props.disabled,
    );
  }

  wrongChoiceExists() {
    return this.getWrongChoiceButtons().length > 0;
  }

  correctChoiceExists() {
    return !!this.getCorrectChoiceButton();
  }

  tapWrongChoice() {
    this.getWrongChoiceButtons()[0].props?.onPress();
    return this;
  }

  imagesWithUrl(url: string) {
    return this.filterByType('Image').filter(
      (image) => image.props.source.uri === url,
    );
  }

  tapCorrectChoice() {
    this.getCorrectChoiceButton()?.props.onPress();
    return this;
  }

  isCorrectChoiceButtonDisabled() {
    return !!this.getCorrectChoiceButton()?.props.disabled;
  }

  getLoader() {
    return this.getByID(getCarouselViewLoaderTestId(this.carouselViewIndex));
  }

  private getCorrectChoiceButton() {
    return this.getByID(
      getCorrectChoiceTestId(getCarouselViewTestId(this.carouselViewIndex)),
    );
  }
}
