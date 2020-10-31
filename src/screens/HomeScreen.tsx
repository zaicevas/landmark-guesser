import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import {View, Button, Image} from 'react-native-ui-lib';
import {navigate} from '../Navigation';
import Screen from '../constants/Screen';
import Layout from '../constants/Layout';
import {LOGO_IMAGE, PLAY_BUTTON, HISTORY_BUTTON} from '../testIds';

const HomeScreen = ({componentId}: HomeScreenProps) => {
  const navigateToHistory = () => navigate(Screen.HISTORY, componentId);

  const navigateToPlay = () => navigate(Screen.PLAY, componentId);

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <ScrollView>
        <View flex paddingH-25>
          <View center paddingT-20>
            <Image
              testID={LOGO_IMAGE}
              style={styles.logo}
              source={require('../../assets/logo.jpeg')}
            />
          </View>
          <View marginT-40>
            <Button
              text70
              bg-orange30
              label="Play Infinite Mode"
              onPress={navigateToPlay}
              testID={PLAY_BUTTON}
            />
            <Button
              text70
              bg-blue30
              label="History"
              marginT-20
              onPress={navigateToHistory}
              testID={HISTORY_BUTTON}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export interface HomeScreenProps {
  componentId: string;
}

interface Styles {
  scrollContainer: ViewStyle;
  logo: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logo: {
    width: Layout.width * 0.8,
    height: Layout.height * 0.4,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default HomeScreen;
