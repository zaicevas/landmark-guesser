import React, {useState, useEffect, useCallback, useRef} from 'react';
import {SafeAreaView, StyleSheet, ViewStyle} from 'react-native';
import {Colors, View, Carousel, Toast} from 'react-native-ui-lib';
import PageControl from '../components/PageControl';
import CarouselView from '../components/CarouselView';
import Layout from '../constants/Layout';
import {
  Landmark,
  LANDMARKS_INCREMENT_AMOUNT,
  INITIAL_LANDMARKS_AMOUNT,
  ERROR_LANDMARK,
  Country,
} from '../constants/Game';
import LandmarkGetter from '../utils/LandmarkGetter';
import {PLAY_SCREEN, getCarouselViewTestId} from '../testIds';
import {
  TOAST_TIMEOUT,
  CORRECT_TOAST_TEXT,
  ERROR_TOAST_TEXT,
} from '../constants/Toast';
import ChoiceHistory from '../utils/HistoryItem';
import {isSmallDevice} from '../utils/responsive';

interface CarouselMethods {
  goToNextPage: () => void;
  goToPage: (nextPageIndex: number, animated?: boolean) => void;
}

export const buildPlayScreen = (
  landmarkGetter: LandmarkGetter,
  choiceHistory: ChoiceHistory,
) => {
  const PlayScreen = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [numOfPages, setNumOfPages] = useState(INITIAL_LANDMARKS_AMOUNT);
    const [landmarks, setLandmarks] = useState<Landmark[]>([]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [chosenPages, setChosenPages] = useState<
      {id: number; isCorrect: boolean}[]
    >([]);

    const carousel = useRef<CarouselMethods>();

    const onCorrectAnswer = useCallback(
      (landmark: Landmark) => {
        carousel.current?.goToNextPage();
        choiceHistory.addChoiceToHistory(landmark, landmark.country);
        setShowSuccessToast(true);
        setChosenPages((prevChosenPages) => [
          ...prevChosenPages,
          {id: currentPage, isCorrect: true},
        ]);
      },
      [currentPage],
    );

    const onWrongAnswer = useCallback(
      (landmark: Landmark, choice: Country) => {
        choiceHistory.addChoiceToHistory(landmark, choice);
        setChosenPages((prevChosenPages) => [
          ...prevChosenPages,
          {id: currentPage, isCorrect: false},
        ]);
        setShowErrorToast(true);
      },
      [currentPage],
    );

    const stopShowingSuccessToast = useCallback(
      () => setShowSuccessToast(false),
      [],
    );

    const stopShowingErrorToast = useCallback(
      () => setShowErrorToast(false),
      [],
    );

    useEffect(() => {
      const getInitialLandmarks = async () => {
        for (let i = 0; i < INITIAL_LANDMARKS_AMOUNT; i++) {
          const newLandmark = await landmarkGetter.getLandmark();
          setLandmarks((previousLandmarks) => [
            ...previousLandmarks,
            newLandmark,
          ]);
        }
      };
      getInitialLandmarks();
    }, []);

    const changePage = async (newPageIndex: number) => {
      setCurrentPage(newPageIndex);

      console.log('newPageIndex: ', newPageIndex);
      console.log('numOfPages - 3: ', numOfPages - 3);
      if (newPageIndex >= numOfPages - 3) {
        console.log('fetching new images');
        setNumOfPages(numOfPages + LANDMARKS_INCREMENT_AMOUNT);
        for (let i = 0; i < LANDMARKS_INCREMENT_AMOUNT; i++) {
          const newLandmark = await landmarkGetter.getLandmark();
          setLandmarks((previousLandmarks) => [
            ...previousLandmarks,
            newLandmark,
          ]);
        }
      }
    };

    return (
      <SafeAreaView style={styles.container} testID={PLAY_SCREEN}>
        <Toast
          visible={showSuccessToast}
          position={'top'}
          autoDismiss={TOAST_TIMEOUT}
          onDismiss={stopShowingSuccessToast}
          message={CORRECT_TOAST_TEXT}
          centerMessage
          backgroundColor={Colors.green30}
        />
        <Toast
          visible={showErrorToast}
          position={'top'}
          autoDismiss={TOAST_TIMEOUT}
          onDismiss={stopShowingErrorToast}
          message={ERROR_TOAST_TEXT}
          centerMessage
          backgroundColor={Colors.red30}
        />
        <View flex dark80 style={styles.container}>
          <Carousel
            containerStyle={styles.page}
            onChangePage={changePage}
            ref={carousel}>
            {generateCarouselViews(
              numOfPages,
              landmarks,
              onCorrectAnswer,
              onWrongAnswer,
            )}
          </Carousel>
        </View>
        <View>
          <PageControl
            setColorOnIndex={(index: number) => {
              const chosenPage = chosenPages.find((page) => page.id === index);
              let backgroundColor: string;
              if (currentPage === index) {
                backgroundColor = 'black';
              } else if (chosenPage && chosenPage.isCorrect) {
                backgroundColor = Colors.green30;
              } else if (chosenPage && !chosenPage.isCorrect) {
                backgroundColor = Colors.red30;
              } else if (!chosenPage && index !== currentPage) {
                backgroundColor = 'white';
              }
              return {
                backgroundColor: backgroundColor!,
                borderColor: 'black',
              };
            }}
            containerStyle={[styles.pageControl, styles.absoluteContainer]}
            limitShownPages
            numOfPages={numOfPages}
            currentPage={currentPage}
            color={Colors.dark10}
            size={Layout.width * 0.05}
            onPagePress={(index) => carousel.current?.goToPage(index)}
          />
        </View>
      </SafeAreaView>
    );
  };
  return () => <PlayScreen />;
};

const generateCarouselViews = (
  amount: number,
  landmarks: Landmark[],
  onCorrectAnswer: (landmark: Landmark) => void,
  onWrongAnswer: (landmark: Landmark, choice: Country) => void,
) => {
  const carouselViews = [];
  for (let i = 0; i < amount; i++) {
    carouselViews.push(
      <CarouselView
        testID={getCarouselViewTestId(i)}
        key={landmarks[i]?.imageUrl || i}
        isLoading={landmarks.length - 1 < i}
        landmark={landmarks[i] || ERROR_LANDMARK}
        onCorrectAnswer={onCorrectAnswer}
        onWrongAnswer={onWrongAnswer}
      />,
    );
  }
  return carouselViews;
};

interface PlayScreenProps {
  landmarkGetter: LandmarkGetter;
}

interface Styles {
  container: ViewStyle;
  page: ViewStyle;
  pageControl: ViewStyle;
  absoluteContainer: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  page: {
    flex: 1,
  },
  pageControl: {
    zIndex: 1,
  },
  absoluteContainer: {
    position: 'absolute',
    bottom: isSmallDevice() ? 8 : 16,
    left: 0,
    right: 0,
  },
});
