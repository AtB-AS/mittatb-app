import React, {useEffect, useState, useCallback} from 'react';
import {SectionListData, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@atb/api/types/trips';
import {Quay} from '@atb/api/types/departures';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import {
  FeedbackQuestionsViewContext,
  useFeedbackQuestion,
} from './FeedbackContext';
import GoodOrBadButton from './GoodOrBadButton';
import {RenderQuestion} from './RenderQuestions';
import firestore from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG} from '@env';
import storage from '@atb/storage';

const APP_VERSION = 'fewfew';

const SubmittedComponent = () => {
  const styles = useFeedbackStyles();
  const {t} = useTranslation();

  return (
    <View style={[styles.container, styles.submittedView]}>
      <ThemeText
        type="body__primary--bold"
        style={[styles.questionText, styles.centerText]}
      >
        {t(FeedbackTexts.submittedText.thanks)}
      </ThemeText>
      <ThemeText>🎉</ThemeText>
    </View>
  );
};

export enum Opinions {
  Good = 'GOOD',
  Bad = 'BAD',
  NotClickedYet = 'NOTCLICKEDYET',
}

interface GoodOrBadQuestionProps {
  viewContext: FeedbackQuestionsViewContext;
  setSelectedOpinion: (e: Opinions) => void;
  selectedOpinion: Opinions;
}

const GoodOrBadQuestion = ({
  setSelectedOpinion,
  selectedOpinion,
  viewContext,
}: GoodOrBadQuestionProps) => {
  const styles = useFeedbackStyles();
  const {language} = useTranslation();
  const category = useFeedbackQuestion(viewContext);

  if (!category) {
    return null;
  }

  return (
    <>
      <ThemeText
        type="heading__component"
        style={[styles.questionText, styles.centerText]}
      >
        {category.introText[language]}
      </ThemeText>

      <View style={styles.feedbackRow} accessibilityRole="radiogroup">
        <GoodOrBadButton
          opinion={Opinions.Good}
          checked={selectedOpinion === Opinions.Good}
          setSelectedOpinion={setSelectedOpinion}
        />

        <View style={styles.spacing} accessibilityRole="none" />

        <GoodOrBadButton
          opinion={Opinions.Bad}
          checked={selectedOpinion === Opinions.Bad}
          setSelectedOpinion={setSelectedOpinion}
        />
      </View>
    </>
  );
};

type FeedbackProps = {
  viewContext: FeedbackQuestionsViewContext;
  tripPattern?: TripPattern;
  quayListData?: SectionListData<Quay>[];
  isSearching?: boolean;
  isEmptyResult?: boolean;
  /** The allowList array may be provided to decide when the Feedback component should be visible.
   * Example: [2, 5] will make the component render only the second and the fifth time it is called.  */
  allowList?: number[];
};

type VersionStats = {
  answered: boolean;
  count: number;
  version: string;
};

export const Feedback = ({
  viewContext,
  tripPattern,
  quayListData,
  allowList,
}: FeedbackProps) => {
  const styles = useFeedbackStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const category = useFeedbackQuestion(viewContext);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [selectedAlternativeIds, setSelectedAlternativeIds] = useState<
    number[]
  >([]);
  const [displayStats, setDisplayStats] = useState<VersionStats[]>([]);

  const incrementCounterAndSetDisplayStats = async () => {
    const defaultArray = [
      {
        answered: false,
        count: 0,
        version: APP_VERSION,
      },
    ];

    let displayStatsJSON = null;
    let fetchedDisplayStats = await storage.get('@ATB_feedback_display_stats');

    if (fetchedDisplayStats === null) {
      displayStatsJSON = defaultArray;
    } else {
      displayStatsJSON = JSON.parse(fetchedDisplayStats);
    }

    const statsForCurrentVersion = displayStatsJSON.find(
      (entry: VersionStats) => entry.version === APP_VERSION,
    );

    if (statsForCurrentVersion) {
      statsForCurrentVersion.count++;
    } else {
      displayStatsJSON = defaultArray;
    }

    setDisplayStats(displayStatsJSON);
    storage.set(
      '@ATB_feedback_display_stats',
      JSON.stringify(displayStatsJSON),
    );
  };

  useEffect(() => {
    incrementCounterAndSetDisplayStats();
  }, []);

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

  const setFeedbackAnswered = () => {
    const newObject = [...displayStats];
    const statsForCurrentVersion = newObject.find(
      (entry) => entry.version === APP_VERSION,
    );
    if (statsForCurrentVersion) {
      statsForCurrentVersion.answered = true;
    }
    try {
      storage.set('@ATB_feedback_display_stats', JSON.stringify(newObject));
    } catch (err: any) {
      Bugsnag.notify(err);
    }
  };

  const submitFeedbackWithAlternatives = async () => {
    try {
      const selectedAnswers = selectedAlternativeIds.map((altId) =>
        category?.question?.alternatives.find(
          (alt) => alt.alternativeId === altId,
        ),
      );

      const appVersion = APP_VERSION;
      const organization = APP_ORG;
      const submitTime = Date.now();
      const displayCount = statsForCurrentVersion
        ? statsForCurrentVersion.count + 1
        : -1;

      const dataToServer = {
        submitTime,
        appVersion,
        organization,
        selectedOpinion,
        viewContext,
        category,
        selectedAnswers,
        displayCount,
      };

      await firestore().collection('feedback').add(dataToServer);
    } catch (err: any) {
      Bugsnag.notify(err);
    } finally {
      setSubmitted(true);
      setFeedbackAnswered();
    }
  };

  useEffect(() => {
    // New Trip pattern, reset state.
    setSelectedAlternativeIds([]);
    setSelectedOpinion(Opinions.NotClickedYet);
    setSubmitted(false);
  }, [tripPattern]);

  if (submitted) return <SubmittedComponent />;
  if (!category) return null;

  if (!displayStats || displayStats.length < 1) return null;
  const statsForCurrentVersion = displayStats.find(
    (entry) => entry.version === APP_VERSION,
  );

  if (!statsForCurrentVersion) return null;
  if (statsForCurrentVersion.answered) return null;

  if (allowList) {
    if (!allowList.includes(statsForCurrentVersion.count + 1)) {
      return null;
    }
  }

  if (quayListData || tripPattern)
    return (
      <View style={styles.container}>
        <GoodOrBadQuestion
          viewContext={viewContext}
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

        {selectedOpinion !== Opinions.NotClickedYet && (
          <View style={styles.submitButtonView}>
            <Button
              text={t(FeedbackTexts.submitText.submitFeedback)}
              onPress={submitFeedbackWithAlternatives}
              mode="primary"
              color="background_accent"
            />
          </View>
        )}
      </View>
    );

  return null;
};

const useFeedbackStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    borderRadius: theme.border.radius.regular,
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
    marginVertical: theme.spacings.medium,
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
  spacing: {
    width: theme.spacings.medium,
  },
  questionText: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.large,
  },
  submitButtonView: {
    marginTop: theme.spacings.medium,
  },
  submittedView: {
    flex: 1,
    alignItems: 'center',
  },
}));

export default Feedback;
