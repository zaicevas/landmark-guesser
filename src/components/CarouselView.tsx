import React, {useState, useRef} from 'react';
import {View, Image, LoaderScreen, Colors, Button} from 'react-native-ui-lib';
import {ImageStyle, StyleSheet} from 'react-native';
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

    const {imageUrl: imgUrl, country: correctAnswer} = landmark;
    const choices = useRef(getChoices(correctAnswer));

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
        <View marginT-30 paddingH-60>
          {choices.current.map((answer, index) => (
            <Button
              {...colorProps[index]}
              text70
              label={answer}
              key={answer}
              marginB-20
              disabled={hasChosen}
              onPress={
                answer === correctAnswer
                  ? () => {
                      onCorrectAnswer(landmark);
                      setHasChosen(true);
                    }
                  : () => {
                      onWrongAnswer(landmark, answer);
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

const colorKeys = ['bg-blue30', 'bg-orange30', 'bg-yellow30', 'bg-dark30'];
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
