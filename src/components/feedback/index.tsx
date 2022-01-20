import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import React from 'react';

type Props = {
  questions: Array<Question>;
};

export enum QuestionTypes {
  GoodOrBad = 'GOODORBAD',
  TextAlternatives = 'TEXTALTERNATIVES',
}

export type Question = {
  questionType: QuestionTypes;
  questionText: string;
  alternatives?: Array<string>;
};

export const Feedback = ({questions}: Props) => {
  // const styles = useThemeStyles();

  return (
    <View>
      {questions.map((question: any) => (
        <ThemeText>{question.questionText}</ThemeText>
      ))}
    </View>
  );
};

/*
const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  infoBoxText: theme.typography.body__primary,
}));
*/

export default Feedback;
