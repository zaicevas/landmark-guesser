jest.mock('react-native-navigation');
jest.mock('@react-native-community/async-storage', () => ({}));

import {Navigation} from 'react-native-navigation';
import {ComponentDriver} from 'react-component-driver';

import HomeScreen from './HomeScreen';
import {HISTORY_BUTTON, PLAY_BUTTON} from '../testIds';
import Screen from '../constants/Screen';
import {HomeScreenProps} from './HomeScreen';

describe('HomeScreen', () => {
  describe('on History Button Press', () => {
    beforeEach(() => new HomeScreenDriver().tapHistory());

    it.only('opens history screen', () => {
      expect(navigatedTo(Screen.HISTORY)).toBe(true);
    });

    it('does not open play screen', () => {
      expect(navigatedTo(Screen.PLAY)).toBe(false);
    });
  });

  it('opens play screen', () => {
    new HomeScreenDriver().tapPlay();
    expect(navigatedTo(Screen.PLAY)).toBe(true);
  });
});

function navigatedTo(screen: Screen) {
  return (
    (Navigation.push as jest.Mock).mock.calls.pop()[1].component.name === screen
  );
}

class HomeScreenDriver extends ComponentDriver<HomeScreenProps> {
  constructor() {
    super(HomeScreen);
  }
  tapHistory() {
    this.getByID(HISTORY_BUTTON)!.props.onPress();
  }
  tapPlay() {
    this.getByID(PLAY_BUTTON)!.props.onPress();
  }
}
