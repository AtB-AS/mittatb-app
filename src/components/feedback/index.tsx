import React, {useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section, ActionItem} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';

type Props = {
  questions: Array<Question>;
};

export type Alternative = {
  alternativeText: string;
  checked: boolean;
};

export type Question = {
  questionText: string;
  alternatives?: Array<Alternative>;
};

const SuccessComponent = () => (
  <ThemeText>Takk for din tilbakemelding!</ThemeText>
);

export enum Opinions {
  Good = 'GOOD',
  Bad = 'BAD',
  NotClickedYet = 'NOTCLICKEDYET',
}

interface GoodOrBadProps {
  setSelectedOpinion: (e: Opinions) => void;
  checkedItem: Opinions;
}

const GoodOrBadQuestion = ({
  setSelectedOpinion,
  checkedItem,
}: GoodOrBadProps) => (
  <>
    <ThemeText>Hva syntes du om reiseforslaget?</ThemeText>

    <Section withTopPadding withBottomPadding>
      <Section withPadding>
        <ActionItem
          text={'Bra'}
          onPress={() => setSelectedOpinion(Opinions.Good)}
          mode="check"
          checked={checkedItem === Opinions.Good}
          type="compact"
        />
      </Section>

      <Section withPadding>
        <ActionItem
          text={'Dårlig'}
          onPress={() => setSelectedOpinion(Opinions.Bad)}
          mode="check"
          checked={checkedItem === Opinions.Bad}
          type="compact"
        />
      </Section>
    </Section>
  </>
);

export const Feedback = ({questions}: Props) => {
  const styles = useThemeStyles();
  const {theme} = useTheme();

  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [receivedFeedback, setReceivedFeedback] = useState({
    addedQuestions: [
      {
        questionText: '',
        answers: [''],
      },
    ],
  });

  const handleAnswerPress = (clickedAnswer: string) => {
    // Her må det skje noe med alternativene som er valgt
    console.log(clickedAnswer);
  };

  const submitFeedback = () => {
    console.log('feedback submitted');
  };

  return (
    <View style={styles.container}>
      {submitted ? (
        <SuccessComponent />
      ) : (
        <GoodOrBadQuestion
          setSelectedOpinion={setSelectedOpinion}
          checkedItem={selectedOpinion}
        />
      )}

      {selectedOpinion === Opinions.Bad &&
        questions.map((question: Question) => (
          <>
            <ThemeText>{question.questionText}</ThemeText>

            <Section withTopPadding withBottomPadding>
              {question.alternatives?.map((alternative) => (
                <Section withPadding>
                  <ActionItem
                    text={alternative.alternativeText}
                    onPress={() =>
                      handleAnswerPress(alternative.alternativeText)
                    }
                    mode="check"
                    type="compact"
                  />
                </Section>
              ))}
            </Section>
          </>
        ))}

      <Section withBottomPadding>
        <Button
          text="Send tilbakemelding"
          onPress={submitFeedback}
          mode="primary"
          color="secondary_1"
        />
      </Section>
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
