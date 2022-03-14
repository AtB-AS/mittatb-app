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
import {APP_ORG, APP_VERSION} from '@env';
import storage from '@atb/storage';

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
  /** Metadata will be uploaded to Firestore and can be used to examine bugs and issues raised by users.
   *  Should include a tripPattern if used with assistant, or a quayDataList if used with departures. */
  metadata: TripPattern | SectionListData<Quay>[];
  /** The allowList array may be provided to decide when the Feedback component should be visible.
   * Example: [2, 5] will make the component render only the second and the fifth time it is called.  */
  allowList?: number[];
  /** If the onlyOneFeedbackForEachAppVersion prop is given, users that have provided feedback will no
   * longer be prompted to give feedback in this viewContext, until a new appVersion is installed.  */
  onlyOneFeedbackForEachAppVersionInThisViewContext?: boolean;
};

type VersionStats = {
  answered: boolean;
  count: number;
  version: string;
  viewContext: FeedbackQuestionsViewContext;
};

export const Feedback = ({
  viewContext,
  metadata,
  allowList,
  onlyOneFeedbackForEachAppVersionInThisViewContext,
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
    const defaultDisplayStatObject = {
      answered: false,
      count: 0,
      version: APP_VERSION,
      viewContext: viewContext,
    };

    let displayStatsJSON: VersionStats[] = [];
    let fetchedDisplayStats = await storage.get('@ATB_feedback_display_stats');

    if (fetchedDisplayStats === null) {
      displayStatsJSON.push(defaultDisplayStatObject);
    } else {
      displayStatsJSON = JSON.parse(fetchedDisplayStats);
    }

    const statsForCurrentVersionAndViewContext = displayStatsJSON.find(
      (entry: VersionStats) =>
        entry.version === APP_VERSION && entry.viewContext === viewContext,
    );

    if (statsForCurrentVersionAndViewContext) {
      statsForCurrentVersionAndViewContext.count++;
    } else {
      const isDisplayStatsForCurrentAppVersionsButOtherViewContexts =
        displayStatsJSON.find(
          (entry: VersionStats) => entry.version === APP_VERSION,
        );

      if (isDisplayStatsForCurrentAppVersionsButOtherViewContexts) {
        displayStatsJSON.push(defaultDisplayStatObject);
      }
      // If the app has been updated, this line makes sure to delete displayStats for previous and no longer relevant versions
      else {
        displayStatsJSON = [defaultDisplayStatObject];
      }
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
    const statsForCurrentVersionAndViewContext = newObject.find(
      (entry) =>
        entry.version === APP_VERSION && entry.viewContext === viewContext,
    );
    if (statsForCurrentVersionAndViewContext) {
      statsForCurrentVersionAndViewContext.answered = true;
    }

    storage.set('@ATB_feedback_display_stats', JSON.stringify(newObject));
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
      const displayCount = statsForCurrentVersionAndViewContext
        ? statsForCurrentVersionAndViewContext.count + 1
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
        metadata,
      };

      await firestore().collection('feedback').add(dataToServer);
    } catch (err: any) {
      Bugsnag.notify(err);
    } finally {
      setSubmitted(true);
      if (onlyOneFeedbackForEachAppVersionInThisViewContext) {
        setFeedbackAnswered();
      }
    }
  };

  useEffect(() => {
    // New Trip pattern, reset state.
    if (viewContext === 'assistant') {
      setSelectedAlternativeIds([]);
      setSelectedOpinion(Opinions.NotClickedYet);
      setSubmitted(false);
    }
  }, [metadata]);

  if (submitted) return <SubmittedComponent />;
  if (!category) return null;

  if (!displayStats || displayStats.length < 1) return null;
  const statsForCurrentVersionAndViewContext = displayStats.find(
    (entry: VersionStats) =>
      entry.version === APP_VERSION && entry.viewContext === viewContext,
  );

  if (!statsForCurrentVersionAndViewContext) return null;
  if (statsForCurrentVersionAndViewContext.answered) return null;

  if (allowList) {
    if (!allowList.includes(statsForCurrentVersionAndViewContext.count + 1)) {
      return null;
    }
  }

  // Ensures that we do not ask for feedback before data is presented to user
  if (metadata)
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
