import {Navigation} from 'react-native-navigation';
import Screen from './constants/Screen';
import LandmarkGetter from './utils/LandmarkGetter';
import {CACHED_IMAGES_PER_PAGE, CACHED_PAGES} from './constants/Game';
import {cacheInitialImageIds} from './utils/ImageIdCache';
import AsyncStorage from '@react-native-community/async-storage';
import ChoiceHistory from './utils/HistoryItem';

export const navigate = (
  name: Screen,
  componentId: string,
  withTopbar = true,
) => {
  const optionsWithTopbar = {
    topBar: {
      visible: true,
      title: {
        text: name,
      },
    },
  };

  Navigation.push(componentId, {
    component: {
      name,
      options: withTopbar ? {...optionsWithTopbar} : undefined,
    },
  });
};

const registerScreens = (imageIds: Promise<string[]>) => {
  const choiceHistory = new ChoiceHistory(AsyncStorage);

  Navigation.registerComponent(
    Screen.HOME,
    () => require('./screens/HomeScreen').default,
  );
  Navigation.registerComponent(Screen.HISTORY, () =>
    require('./screens/HistoryScreen').buildHistoryScreen(choiceHistory),
  );
  Navigation.registerComponent(Screen.PLAY, () =>
    require('./screens/PlayScreen').buildPlayScreen(
      new LandmarkGetter(imageIds),
      choiceHistory,
    ),
  );
};

export const launch = () => {
  const cachedImageIds = cacheInitialImageIds(
    CACHED_PAGES,
    CACHED_IMAGES_PER_PAGE,
  );
  registerScreens(cachedImageIds);

  const root = {
    stack: {
      children: [
        {
          component: {
            name: Screen.HOME,
            backButton: {
              visible: false,
            },
          },
        },
      ],
    },
  };

  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
      root,
    });

    Navigation.setDefaultOptions({
      topBar: {
        visible: false,
      },
      layout: {
        orientation: ['portrait'],
      },
    });
  });
};
