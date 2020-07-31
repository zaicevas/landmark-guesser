import React, {useState, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {HISTORY_LIST} from '../testIds';
import HistoryListItem from '../components/HistoryListItem';
import {HistoryItem} from '../utils/HistoryItem';
import ChoiceHistory from '../utils/HistoryItem';

// TODO: loader
export const buildHistoryScreen = (choiceHistory: ChoiceHistory) => {
  const HistoryScreen = () => {
    const [guesses, setGuesses] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const retrieveHistory = async () => {
        const cachedGuesses = await choiceHistory.getChoicesHistory();
        setGuesses(cachedGuesses);
        setIsLoading(false);
      };

      retrieveHistory();
    }, []);

    const renderItem = useCallback(
      ({item}) => <HistoryListItem item={item} />,
      [],
    );

    if (isLoading)
      return (
        <SafeAreaView style={styles.loadingContainer} testID={HISTORY_LIST}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      );

    return (
      <SafeAreaView style={styles.scrollContainer} testID={HISTORY_LIST}>
        <FlatList
          data={guesses}
          testID={HISTORY_LIST}
          keyExtractor={(item: HistoryItem) => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  };
  return () => <HistoryScreen />;
};

interface Styles {
  scrollContainer: ViewStyle;
  loadingContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});
