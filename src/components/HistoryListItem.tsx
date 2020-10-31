import React from 'react';
import {
  ListItem,
  Text,
  Colors,
  Image,
  BorderRadiuses,
} from 'react-native-ui-lib';
import {ImageStyle, ViewStyle, StyleSheet, TextStyle} from 'react-native';
import {HistoryItem} from '../utils/HistoryItem';

const getColor = (isGuessCorrect: boolean) => ({
  green10: isGuessCorrect,
  orange40: !isGuessCorrect,
});

const HistoryListItem = React.memo(({item}: HistoryListItemProps) => (
  <ListItem
    activeBackgroundColor={Colors.purple70}
    activeOpacity={0.1}
    height={77.5}>
    <ListItem.Part left>
      <Image source={{uri: item.imgUrl}} style={styles.image} />
    </ListItem.Part>
    <ListItem.Part middle column containerStyle={styles.border}>
      <ListItem.Part>
        <Text
          {...getColor(item.answer === item.guess)}
          text60
          style={styles.text}
          numberOfLines={1}>
          {item.answer}
        </Text>
      </ListItem.Part>
      {item.answer !== item.guess && (
        <ListItem.Part>
          <Text style={styles.text} text90 dark40 numberOfLines={1}>
            You guessed:{' '}
            <Text style={styles.text} text90 dark10 numberOfLines={1}>
              {item.guess}
            </Text>
          </Text>
        </ListItem.Part>
      )}
    </ListItem.Part>
  </ListItem>
));

interface HistoryListItemProps {
  item: HistoryItem;
}

interface Style {
  image: ImageStyle;
  border: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14,
    backgroundColor: Colors.purple70,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.dark60,
    paddingRight: 17,
  },
  text: {
    flex: 1,
    marginRight: 10,
  },
});

export default HistoryListItem;
