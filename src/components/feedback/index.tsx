import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section, ActionItem} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@entur/sdk';

type FeedbackProps = {
  questions: Array<Question>;
  tripPatterns: TripPattern[];
  departures?: string;
};

export type Alternative = {
  alternativeId: number;
  alternativeText: string;
};

export type Question = {
  questionText: string;
  questionId: number;
  alternatives?: Array<Alternative>;
};

const SubmittedComponent = () => {
  const styles = useFeedbackStyles();
  return (
    <ThemeText style={styles.centerText}>
      Takk for din tilbakemelding!
    </ThemeText>
  );
};

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
}: GoodOrBadProps) => {
  const styles = useFeedbackStyles();

  return (
    <>
      <ThemeText style={styles.centerText}>
        Hva syntes du om reiseforslaget?
      </ThemeText>

      <Section style={styles.feedbackRow} withTopPadding withBottomPadding>
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
};

interface RenderQuestionProps {
  selectedOpinion: Opinions;
  questions: Array<Question>;
  handleAnswerPress: (answer: string) => void;
}

export const RenderQuestions = ({
  selectedOpinion,
  questions,
  handleAnswerPress,
}: RenderQuestionProps) => {
  return (
    <>
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
                    checked={false}
                    type="compact"
                  />
                </Section>
              ))}
            </Section>
          </>
        ))}
    </>
  );
};

export const Feedback = ({
  questions,
  tripPatterns,
  departures,
}: FeedbackProps) => {
  const styles = useFeedbackStyles();
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
    console.log('Submitting AssistantFeedback');
    setSubmitted(true);
  };

  useEffect(() => {
    setSelectedOpinion(Opinions.NotClickedYet);
    setSubmitted(false);
  }, [departures, tripPatterns]);

  if (submitted) return <SubmittedComponent />;

  if (departures || tripPatterns)
    return (
      <View style={styles.container}>
        <GoodOrBadQuestion
          setSelectedOpinion={setSelectedOpinion}
          checkedItem={selectedOpinion}
        />

        <RenderQuestions
          selectedOpinion={selectedOpinion}
          handleAnswerPress={handleAnswerPress}
          questions={questions}
        />

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

  return null;
};

const useFeedbackStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  infoBoxText: theme.typography.body__primary,
  centerText: {
    textAlign: 'center',
  },
  feedbackRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacings.small,
  },
}));

export default Feedback;
