/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

export function proxy(ui, mocks) {
  return new Proxy(ui, {
    get(obj, key) {
      return key in mocks ? mocks[key]() : obj[key];
    },
  });
}

jest.setTimeout(10000);

jest.mock('react-native', () => {
  const {proxy} = require('./proxy');
  const React = jest.requireActual('react');
  const reactNative = jest.requireActual('react-native');

  reactNative.NativeModules.StatusBarManager.getHeight = jest.fn();
  reactNative.AccessibilityInfo.isScreenReaderEnabled = jest
    .fn()
    .mockResolvedValue(false);

  return proxy(reactNative, {
    TouchableOpacity: () => (props) =>
      React.createElement('MockTouchableOpacity', props),
  });

  // return new Proxy(reactNative, {
  //   get(obj, prop) {
  //     if (prop === 'TouchableOpacity') {
  //       return class MockTouchableOpacity extends React.Component {
  //         render() {
  //           return React.createElement('MockTouchableOpacity', this.props);
  //         }
  //       };
  //       // TODO: find out why functional component throws error
  //       // return (props) => {
  //       //   return React.createElement('MockTouchableOpacity', props);
  //       // };
  //     }
  //     return obj[prop];
  //   },
  // });
});

jest.mock('react-native-ui-lib', () => {
  const React = require('React');
  const ui = jest.requireActual('react-native-ui-lib');
  const {proxy} = require('./proxy');

  function noRender(name, x = ui) {
    return class extends x[name] {
      static displayName = name;
      render() {
        return React.createElement(name, this.props);
      }
    };
  }

  return proxy(ui, {
    Toast: () => 'Mock Toast',
  });
});

jest.mock('react-native-reanimated', () =>
  jest.requireActual('./node_modules/react-native-reanimated/mock'),
);

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    /* Other */
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

global.flushPromises = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
    if (setTimeout.mock) {
      if (ms !== undefined) {
        jest.runTimersToTime(ms);
      } else {
        jest.runAllTimers();
      }
    }
  });
};
