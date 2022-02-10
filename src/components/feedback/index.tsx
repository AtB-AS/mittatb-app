import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section, ActionItem} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@atb/api/types/trips';
import {useTranslation} from '@atb/translations';
import {
  FeedbackQuestionsContext,
  Question,
  useFeedbackQuestionsState,
} from './FeedbackContext';

const SubmittedComponent = () => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();

  return (
    <ThemeText style={styles.centerText}>
      {language === 'nb'
        ? 'Takk for tilbakemeldingen!'
        : 'Thanks for the feedback!'}
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
  const {language} = useTranslation();

  return (
    <>
      <ThemeText style={styles.centerText}>
        {language === 'nb'
          ? 'Hva syntes du om reiseforslaget?'
          : 'What do you think of this trip plan?'}
      </ThemeText>

      <View style={styles.feedbackRow}>
        <Section withPadding>
          <ActionItem
            text={language === 'nb' ? 'Bra' : 'Good'}
            onPress={() => setSelectedOpinion(Opinions.Good)}
            mode="check"
            checked={checkedItem === Opinions.Good}
            type="compact"
          />
        </Section>

        <Section withPadding>
          <ActionItem
            text={language === 'nb' ? 'Dårlig' : 'Bad'}
            onPress={() => setSelectedOpinion(Opinions.Bad)}
            mode="check"
            checked={checkedItem === Opinions.Bad}
            type="compact"
          />
        </Section>
      </View>
    </>
  );
};

interface RenderQuestionProps {
  selectedOpinion: Opinions;
  questions: Array<Question>;
  handleAnswerPress: (o: {questionId: number; answerId: number}) => void;
}

export const RenderQuestions = ({
  selectedOpinion,
  questions,
  handleAnswerPress,
}: RenderQuestionProps) => {
  const {language} = useTranslation();

  console.log('attempting to render questions: ', questions);

  return (
    <>
      {selectedOpinion === Opinions.Bad &&
        questions.map((question: Question) => (
          <>
            <ThemeText>
              {language === 'nb'
                ? question.questionText.norwegian
                : question.questionText.english}
            </ThemeText>

            <Section withTopPadding withBottomPadding>
              {question.alternatives.map((alternative) => (
                <Section withPadding>
                  <ActionItem
                    text={
                      language === 'nb'
                        ? alternative.alternativeText.norwegian
                        : alternative.alternativeText.english
                    }
                    onPress={() =>
                      handleAnswerPress({
                        questionId: question.questionId,
                        answerId: alternative.alternativeId,
                      })
                    }
                    mode="check"
                    checked={alternative.checked}
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

type FeedbackProps = {
  tripPatterns?: TripPattern[];
  departures?: string;
  feedbackQuestionsContext?: FeedbackQuestionsContext;
};

export const Feedback = ({
  tripPatterns,
  departures,
  feedbackQuestionsContext,
}: FeedbackProps) => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();
  const {theme} = useTheme();
  const {findQuestions} = useFeedbackQuestionsState();

  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [questions, setQuestions] = useState<Array<Question>>();

  useEffect(() => {
    const fetchedQuestions = feedbackQuestionsContext
      ? findQuestions(feedbackQuestionsContext)
      : undefined;
    setQuestions(fetchedQuestions);
  }, []);

  type handleAnswerPressProps = {
    questionId: number;
    answerId: number;
  };

  const handleAnswerPress = ({
    questionId,
    answerId,
  }: handleAnswerPressProps) => {
    console.log(
      `Alternative ${answerId} registered for question ${questionId}`,
    );

    const copiedState = questions?.slice();
    const questionInQuestion = copiedState?.find(
      (question) => question.questionId === questionId,
    );

    if (questionInQuestion) {
      const alternativeInQuestion = questionInQuestion.alternatives.find(
        (alternative) => alternative.alternativeId === answerId,
      );
      if (alternativeInQuestion) {
        alternativeInQuestion.checked = !alternativeInQuestion.checked;
      }
    }

    setQuestions(copiedState);
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

        {questions && (
          <RenderQuestions
            selectedOpinion={selectedOpinion}
            handleAnswerPress={handleAnswerPress}
            questions={questions}
          />
        )}

        <Section withBottomPadding>
          <Button
            text={language === 'nb' ? 'Send tilbakemelding' : 'Submit feedback'}
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
