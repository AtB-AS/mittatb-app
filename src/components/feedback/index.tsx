import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section, ActionItem} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';

type Props = {
  questions: Array<Question>;
};

export enum QuestionTypes {
  GoodOrBad = 'GOODORBAD',
  TextAlternatives = 'TEXTALTERNATIVES',
}

export type Alternative = {
  alternativeText: string;
  checked: boolean;
};

export type Question = {
  questionType: QuestionTypes;
  questionText: string;
  alternatives: Array<Alternative>;
};

const submitFeedback = () => {
  console.log('feedback submitted');
};

export const Feedback = ({questions}: Props) => {
  const styles = useThemeStyles();
  const {theme} = useTheme();

  const [receivedFeedback, setReceivedFeedback] = useState({
    addedQuestions: [
      {
        questionText: '',
        answers: [''],
      },
    ],
  });

  const handleAnswerPress = (clickedAnswer: string) => {
    console.log(clickedAnswer);
  };

  console.log(questions[0].alternatives);

  return (
    <View style={styles.container}>
      {questions.map((question: Question) => (
        <>
          <ThemeText>{question.questionText}</ThemeText>

          <Section withTopPadding withBottomPadding>
            {question.alternatives.map((alternative) => (
              <ActionItem
                text={alternative.alternativeText}
                onPress={() => handleAnswerPress(alternative.alternativeText)}
                mode="check"
                type="compact"
              />
            ))}
          </Section>
        </>
      ))}

      <Button
        text="Send tilbakemelding"
        onPress={submitFeedback}
        mode="primary"
        color="secondary_1"
      />
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  infoBoxText: theme.typography.body__primary,
}));

export default Feedback;
