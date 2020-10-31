import React, {useState, useRef} from 'react';
import {View, Image, LoaderScreen, Colors, Button} from 'react-native-ui-lib';
import {ImageStyle, StyleSheet, Linking} from 'react-native';
import Layout from '../constants/Layout';
import {WRONG_CHOICES_AMOUNT, Landmark, Country} from '../constants/Game';
import {getRandomInt} from '../utils';
import {generateChoices} from '../utils/Country';
import {getCorrectChoiceTestId, getWrongChoiceTestId} from '../testIds';

const getChoices = (correctAnswer: Country) => {
  const choices = generateChoices(WRONG_CHOICES_AMOUNT, correctAnswer);
  choices.splice(getRandomInt(WRONG_CHOICES_AMOUNT + 1), 0, correctAnswer);
  return choices;
};

const CarouselView = React.memo(
  ({
    landmark,
    isLoading,
    onCorrectAnswer,
    onWrongAnswer,
    testID,
  }: CarouselViewProps) => {
    const [hasChosen, setHasChosen] = useState(false);
    const [hasChosenCorrectAnswer, setHasChosenCorrectAnswer] = useState(false);
    const [choice, setChoice] = useState<Country | null>(null);

    const {imageUrl: imgUrl, country: correctAnswer} = landmark;
    const choices = useRef(getChoices(correctAnswer));

    const openAuthorLink = () => {
      // @TODO: implement error toas
      Linking.openURL(
        `${
          landmark.authorUrl as string
        }?utm_source=where-is-this&utm_medium=referral`,
      ).catch(() => console.log('Cant open author link'));
    };

    if (isLoading)
      return (
        <View center paddingT-20>
          <View style={styles.place}>
            <LoaderScreen
              testID={`${testID}_LOADER`}
              color={Colors.red10}
              message="Loading..."
            />
          </View>
        </View>
      );

    const getDisabledBackgroundColor = (answer: Country) => {
      if (!hasChosen) return undefined;
      if (hasChosenCorrectAnswer && answer !== correctAnswer) return undefined;
      if (hasChosenCorrectAnswer && answer === correctAnswer)
        return Colors.green30;
      if (!hasChosenCorrectAnswer && answer === choice) return Colors.red30;
      if (!hasChosenCorrectAnswer && answer === correctAnswer)
        return Colors.green30;
    };

    return (
      <View paddingT-10>
        <View center>
          <Image
            style={styles.place}
            source={{
              uri: imgUrl,
            }}
          />
        </View>
        <View center>
          <Button
            link
            text80
            label={`Author: ${landmark.authorName} (Unsplash)`}
            marginT-20
            onPress={openAuthorLink}
          />
        </View>
        <View marginT-30 paddingH-60>
          {choices.current.map((answer, index) => (
            <Button
              {...colorProps[index]}
              text70
              label={answer}
              key={answer}
              marginB-20
              disabled={hasChosen}
              disabledBackgroundColor={getDisabledBackgroundColor(answer)}
              onPress={
                answer === correctAnswer
                  ? () => {
                      onCorrectAnswer(landmark);
                      setHasChosenCorrectAnswer(true);
                      setChoice(answer);
                      setHasChosen(true);
                    }
                  : () => {
                      onWrongAnswer(landmark, answer);
                      setHasChosenCorrectAnswer(false);
                      setChoice(answer);
                      setHasChosen(true);
                    }
              }
              testID={
                answer === correctAnswer
                  ? getCorrectChoiceTestId(testID)
                  : getWrongChoiceTestId(testID, index)
              }
            />
          ))}
        </View>
      </View>
    );
  },
);

const colorKeys = ['bg-orange30', 'bg-blue30', 'bg-yellow30', 'bg-dark30'];
const colorProps = colorKeys.map((colorKey) => ({[colorKey]: true}));

interface CarouselViewProps {
  landmark: Landmark;
  isLoading: boolean;
  onCorrectAnswer: (landmark: Landmark) => void;
  onWrongAnswer: (landmark: Landmark, choice: Country) => void;
  testID: string;
}

interface Styles {
  place: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  place: {
    width: Layout.width * 0.8,
    height: Layout.height * 0.38,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default CarouselView;
