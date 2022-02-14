import React, {useEffect, useState} from 'react';
import {SectionListData, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section, ActionItem} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@atb/api/types/trips';
import {Quay} from '@atb/api/types/departures';
import {useTranslation} from '@atb/translations';
import {
  FeedbackQuestionsContext,
  Question,
  useFeedbackQuestionsState,
} from './FeedbackContext';
import GoodOrBadButton from './GoodOrBadButton';

const SubmittedComponent = () => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();

  return (
    <ThemeText type="body__primary--bold">
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

interface GoodOrBadQuestionProps {
  feedbackQuestionsContext: FeedbackQuestionsContext | undefined;
  setSelectedOpinion: (e: Opinions) => void;
  selectedOpinion: Opinions;
}

const GoodOrBadQuestion = ({
  setSelectedOpinion,
  selectedOpinion,
  feedbackQuestionsContext,
}: GoodOrBadQuestionProps) => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();

  return (
    <>
      <ThemeText type="heading__component" style={styles.centerText}>
        {feedbackQuestionsContext === 'departures' &&
          (language === 'nb'
            ? 'Hva syntes du om avgangsvisningen?'
            : 'What do you think of the departure screen?')}
        {feedbackQuestionsContext === 'assistant' &&
          (language === 'nb'
            ? 'Hva syntes du om reiseforslaget?'
            : 'What do you think of this trip plan?')}
      </ThemeText>

      <View style={styles.feedbackRow}>
        <Section withPadding>
          <GoodOrBadButton
            opinion={Opinions.Good}
            checked={selectedOpinion === Opinions.Good}
            setSelectedOpinion={setSelectedOpinion}
          />
        </Section>

        <Section withPadding>
          <GoodOrBadButton
            opinion={Opinions.Bad}
            checked={selectedOpinion === Opinions.Bad}
            setSelectedOpinion={setSelectedOpinion}
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
            <ThemeText type="body__primary--bold">
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
  quayListData?: SectionListData<Quay>[];
  isSearching?: boolean;
  isEmptyResult?: boolean;
  feedbackQuestionsContext?: FeedbackQuestionsContext;
};

export const Feedback = ({
  tripPatterns,
  quayListData,
  feedbackQuestionsContext,
  isSearching,
  isEmptyResult,
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
  }, [quayListData, tripPatterns]);

  if (submitted) return <SubmittedComponent />;

  if (!questions || isSearching || isEmptyResult) return null;

  if (quayListData || tripPatterns)
    return (
      <View style={styles.container}>
        <GoodOrBadQuestion
          feedbackQuestionsContext={feedbackQuestionsContext}
          setSelectedOpinion={setSelectedOpinion}
          selectedOpinion={selectedOpinion}
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
