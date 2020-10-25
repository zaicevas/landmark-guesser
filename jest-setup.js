/* eslint-disable no-undef */

jest.setTimeout(10000);

jest.mock('react-native', () => {
  const React = jest.requireActual('react');
  const reactNative = jest.requireActual('react-native');

  reactNative.NativeModules.StatusBarManager.getHeight = jest.fn();
  reactNative.AccessibilityInfo.isScreenReaderEnabled = jest
    .fn()
    .mockResolvedValue(false);

  return new Proxy(reactNative, {
    get(obj, prop) {
      if (prop === 'TouchableOpacity') {
        return class MockTouchableOpacity extends React.Component {
          render() {
            return React.createElement('MockTouchableOpacity', this.props);
          }
        };
        // TODO: find out why functional component throws error
        // return (props) => {
        //   return React.createElement('MockTouchableOpacity', props);
        // };
      }
      return obj[prop];
    },
  });
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
