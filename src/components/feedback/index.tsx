import React, {useEffect, useState, useCallback} from 'react';
import {SectionListData, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {Section} from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@atb/api/types/trips';
import {Quay} from '@atb/api/types/departures';
import {useTranslation} from '@atb/translations';
import {FeedbackQuestionsMode, useFeedbackQuestion} from './FeedbackContext';
import GoodOrBadButton from './GoodOrBadButton';
import {RenderQuestion} from './RenderQuestions';

const SubmittedComponent = () => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();

  return (
    <ThemeText type="body__primary--bold" style={styles.centerText}>
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
  mode: FeedbackQuestionsMode;
  setSelectedOpinion: (e: Opinions) => void;
  selectedOpinion: Opinions;
}

const GoodOrBadQuestion = ({
  setSelectedOpinion,
  selectedOpinion,
  mode,
}: GoodOrBadQuestionProps) => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();
  const category = useFeedbackQuestion(mode);

  if (!category) {
    return null;
  }

  return (
    <>
      <ThemeText type="heading__component" style={styles.centerText}>
        {category.introText[language]}
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

type FeedbackProps = {
  tripPatterns?: TripPattern[];
  quayListData?: SectionListData<Quay>[];
  isSearching?: boolean;
  isEmptyResult?: boolean;
  mode: FeedbackQuestionsMode;
};

export const Feedback = ({
  tripPatterns,
  quayListData,
  mode,
  isSearching,
  isEmptyResult,
}: FeedbackProps) => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();
  const {theme} = useTheme();
  const category = useFeedbackQuestion(mode);

  // @TODO Change model to only have one question.

  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [selectedAlternativeIds, setSelectedAlternativeIds] = useState<
    number[]
  >([]);

  const toggleSelectedAlternativeId = useCallback(
    (alternativeId: number) => {
      if (selectedAlternativeIds.includes(alternativeId)) {
        setSelectedAlternativeIds(
          selectedAlternativeIds.filter((id) => id !== alternativeId),
        );
      } else {
        setSelectedAlternativeIds([...selectedAlternativeIds, alternativeId]);
      }
    },
    [selectedAlternativeIds],
  );

  const submitFeedbackWithAlternatives = () => {
    const selectedAnswers = selectedAlternativeIds.map((altId) =>
      category?.question?.alternatives.find(
        (alt) => alt.alternativeId === altId,
      ),
    );

    // Send to server
    const dataToServer = {
      selectedOpinion,
      mode,
      category,
      selectedAnswers,
    };

    console.log('Submitted to server:', dataToServer);

    setSubmitted(true);
  };

  useEffect(() => {
    setSelectedAlternativeIds([]);
    setSelectedOpinion(Opinions.NotClickedYet);
    setSubmitted(false);
  }, [quayListData, tripPatterns]);

  if (!category || isSearching || isEmptyResult) return null;
  if (submitted) return <SubmittedComponent />;

  if (quayListData || tripPatterns)
    return (
      <View style={styles.container}>
        <GoodOrBadQuestion
          mode={mode}
          setSelectedOpinion={setSelectedOpinion}
          selectedOpinion={selectedOpinion}
        />

        <RenderQuestion
          selectedOpinion={selectedOpinion}
          selectedAlternativeIds={selectedAlternativeIds}
          handleAnswerPress={({alternativeId}) =>
            toggleSelectedAlternativeId(alternativeId)
          }
          question={category.question}
        />

        <Section withBottomPadding>
          <Button
            text={language === 'nb' ? 'Send tilbakemelding' : 'Submit feedback'}
            onPress={submitFeedbackWithAlternatives}
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
