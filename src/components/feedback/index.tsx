import React, {useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import {
  FeedbackQuestionsViewContext,
  useFeedbackQuestion,
} from './FeedbackContext';
import GoodOrBadButton from './GoodOrBadButton';
import SubmittedComponent from './SubmittedComponent';
import {RenderQuestion} from './RenderQuestions';
import firestore from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG, APP_VERSION} from '@env';
import storage from '@atb/storage';

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
   *  An example could be a tripPattern if used with assistant / travel search. */
  metadata: any;
  /** The allowList array may be provided to decide when the Feedback component should be visible.
   * Example: [2, 5] will make the component render only the second and the fifth time it is called. */
  allowList?: number[];
  /** If the onlyOneFeedbackForEachSurveyVersionInThisViewContext prop is given, users that have provided
   * feedback will no longer be prompted to give feedback in this viewContext, until a new surveyVersion
   * is available. */
  onlyOneFeedbackForEachSurveyVersionInThisViewContext?: boolean;
  /** If the avoidResetOnMetadataUpdate flag is given, interactions with the feedback component will
   * not be reset when metadata changes. Typically relevant when metadata is refreshed periodically. */
  avoidResetOnMetadataUpdate?: boolean;
};

type VersionStats = {
  answered: boolean;
  count: number;
  surveyVersion: number;
  doNotShowAgain: boolean;
  viewContext: FeedbackQuestionsViewContext;
};

export const Feedback = ({
  viewContext,
  metadata,
  allowList,
  avoidResetOnMetadataUpdate,
  onlyOneFeedbackForEachSurveyVersionInThisViewContext,
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
  const [firebaseId, setFirebaseId] = useState<string>();

  useEffect(() => {
    incrementCounterAndSetDisplayStats();
  }, []);

  useEffect(() => {
    // Reset state whenever metadata changes, unless the data is periodically refreshed
    if (!avoidResetOnMetadataUpdate) {
      setSelectedAlternativeIds([]);
      setSelectedOpinion(Opinions.NotClickedYet);
      setSubmitted(false);
    }
  }, [metadata]);

  if (!category) return null;

  const incrementCounterAndSetDisplayStats = async () => {
    if (category) {
      const defaultDisplayStatObject = {
        answered: false,
        doNotShowAgain: false,
        count: 0,
        surveyVersion: category.surveyVersion,
        viewContext: viewContext,
      };

      let displayStatsJSON: VersionStats[] = [];
      let fetchedDisplayStats = await storage.get(
        '@ATB_feedback_display_stats',
      );

      if (fetchedDisplayStats === null) {
        displayStatsJSON.push(defaultDisplayStatObject);
      } else {
        displayStatsJSON = JSON.parse(fetchedDisplayStats);
      }

      const statsForCurrentSurveyVersionAndViewContext = displayStatsJSON.find(
        (entry: VersionStats) =>
          entry.surveyVersion === category.surveyVersion &&
          entry.viewContext === viewContext,
      );

      if (statsForCurrentSurveyVersionAndViewContext) {
        statsForCurrentSurveyVersionAndViewContext.count++;
      } else {
        const removeOldSurveyVersionStats = () => {
          const arrayWithoutThisViewContext = displayStatsJSON.filter(
            (statObject) => statObject.viewContext !== viewContext,
          );

          const numberOfSurveyVersionsToKeep = 3;
          const arrayWithReasonablyNewElementsFromThisViewContext =
            displayStatsJSON.filter(
              (statObject) =>
                statObject.surveyVersion >
                category.surveyVersion - numberOfSurveyVersionsToKeep,
            );

          arrayWithReasonablyNewElementsFromThisViewContext.forEach(
            (displayStatObject) =>
              arrayWithoutThisViewContext.push(displayStatObject),
          );

          displayStatsJSON = arrayWithoutThisViewContext;
        };

        removeOldSurveyVersionStats();
        displayStatsJSON.push(defaultDisplayStatObject);
      }
      setDisplayStats(displayStatsJSON);
      storage.set(
        '@ATB_feedback_display_stats',
        JSON.stringify(displayStatsJSON),
      );
    }
  };

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
    if (category) {
      const newObject = [...displayStats];
      const statsForCurrentSurveyVersionAndViewContext = newObject.find(
        (entry) =>
          entry.surveyVersion === category.surveyVersion &&
          entry.viewContext === viewContext,
      );
      if (statsForCurrentSurveyVersionAndViewContext) {
        statsForCurrentSurveyVersionAndViewContext.answered = true;
        storage.set('@ATB_feedback_display_stats', JSON.stringify(newObject));
      }
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
      const displayCount = statsForCurrentSurveyVersionAndViewContext?.count
        ? statsForCurrentSurveyVersionAndViewContext.count + 1
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

      const submittedFeedbackDoc = await firestore()
        .collection('feedback')
        .add(dataToServer);
      setFirebaseId(submittedFeedbackDoc.id);
    } catch (err: any) {
      Bugsnag.notify(err);
    } finally {
      setSubmitted(true);
      if (onlyOneFeedbackForEachSurveyVersionInThisViewContext) {
        setFeedbackAnswered();
      }
    }
  };

  const setDoNotShowAgain = () => {
    const newArray = [...displayStats];
    const currentVersionStats = newArray.find(
      (versionStat) => versionStat.surveyVersion === category?.surveyVersion,
    );
    if (currentVersionStats) {
      currentVersionStats.doNotShowAgain = true;
      storage.set('@ATB_feedback_display_stats', JSON.stringify(newArray));
      setDisplayStats(newArray);
    }
  };

  if (submitted) {
    const selectedTextAlternatives = selectedAlternativeIds.map(
      (altId) =>
        category?.question?.alternatives.find(
          (alt) => alt.alternativeId === altId,
        )?.alternativeText.nb,
    );

    return (
      <SubmittedComponent
        viewContext={viewContext}
        opinion={selectedOpinion}
        selectedTextAlternatives={selectedTextAlternatives}
        firebaseId={firebaseId}
      />
    );
  }

  if (!displayStats || displayStats.length < 1) return null;
  const statsForCurrentSurveyVersionAndViewContext = displayStats.find(
    (entry: VersionStats) =>
      entry.surveyVersion === category.surveyVersion &&
      entry.viewContext === viewContext,
  );

  if (!statsForCurrentSurveyVersionAndViewContext) return null;
  if (statsForCurrentSurveyVersionAndViewContext.answered) return null;
  if (statsForCurrentSurveyVersionAndViewContext.doNotShowAgain) return null;

  if (allowList) {
    if (
      !allowList.includes(statsForCurrentSurveyVersionAndViewContext.count + 1)
    ) {
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
        {selectedOpinion === Opinions.NotClickedYet && category.dismissable && (
          <View style={styles.submitButtonView}>
            <ThemeText
              style={styles.centerText}
              type="body__tertiary"
              onPress={setDoNotShowAgain}
            >
              {t(FeedbackTexts.goodOrBadTexts.doNotShowAgain)}
            </ThemeText>
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
