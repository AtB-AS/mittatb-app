import {FeedbackTexts, useTranslation} from '@atb/translations';
import {
  FeedbackQuestionsViewContext,
  useFeedbackQuestion,
} from './FeedbackContext';
import React, {useCallback, useEffect, useState} from 'react';
import {storage} from '@atb/storage';
import {APP_ORG, APP_VERSION} from '@env';
import firestore from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';
import {SubmittedComponent} from './SubmittedComponent';
import {View} from 'react-native';
import {RenderQuestion} from './RenderQuestions';
import {Button} from '@atb/components/button';
import {GoodOrBadQuestion} from './GoodOrBadQuestion';
import {StyleSheet, useThemeContext, Theme} from '@atb/theme';

export enum Opinions {
  Good = 'GOOD',
  Bad = 'BAD',
  NotClickedYet = 'NOTCLICKEDYET',
}

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];
const getInteractiveColor = (theme: Theme) => theme.color.interactive[0];

type VersionStats = {
  // answered is a number so that we know at which render the user answered
  answeredAtDisplayCount?: number;
  displayCount: number;
  surveyVersion: number;
  doNotShowAgain: boolean;
  viewContext: FeedbackQuestionsViewContext;
};

type FeedbackProps = {
  viewContext: FeedbackQuestionsViewContext;
  /** Metadata will be uploaded to Firestore and can be used to examine bugs and issues raised by users.
   *  An example could be a tripPattern if used with assistant / travel search. */
  metadata: any;
  /** If the avoidResetOnMetadataUpdate flag is given, interactions with the feedback component will
   * not be reset when metadata changes. Typically relevant when metadata is refreshed periodically. */
  avoidResetOnMetadataUpdate?: boolean;
};

export const Feedback = ({
  viewContext,
  metadata,
  avoidResetOnMetadataUpdate,
}: FeedbackProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const feedbackConfig = useFeedbackQuestion(viewContext);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [selectedAlternativeIds, setSelectedAlternativeIds] = useState<
    number[]
  >([]);
  const [versionStatsList, setVersionStatsList] = useState<VersionStats[]>([]);
  const [firebaseId, setFirebaseId] = useState<string>();

  const incrementCounterAndSetDisplayStats = async () => {
    if (feedbackConfig) {
      const defaultDisplayStatObject: VersionStats = {
        answeredAtDisplayCount: undefined,
        doNotShowAgain: false,
        displayCount: 1,
        surveyVersion: feedbackConfig.surveyVersion,
        viewContext: viewContext,
      };

      let versionStatsList: VersionStats[] = [];
      const fetchedVersionsStatsJson = await storage.get(
        '@ATB_feedback_display_stats',
      );
      if (fetchedVersionsStatsJson) {
        versionStatsList = JSON.parse(fetchedVersionsStatsJson);
      }
      versionStatsList = filterOutOldSurveyVersionStats(versionStatsList);

      const statsForCurrentSurveyVersionAndViewContext =
        findCurrentVersionStats(versionStatsList);

      if (statsForCurrentSurveyVersionAndViewContext) {
        statsForCurrentSurveyVersionAndViewContext.displayCount++;
      } else {
        versionStatsList.push(defaultDisplayStatObject);
      }

      setVersionStatsList(versionStatsList);
      storage.set(
        '@ATB_feedback_display_stats',
        JSON.stringify(versionStatsList),
      );
    }
  };

  useEffect(() => {
    incrementCounterAndSetDisplayStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Reset state whenever metadata changes, unless the data is periodically refreshed
    if (!avoidResetOnMetadataUpdate) {
      setSelectedAlternativeIds([]);
      setSelectedOpinion(Opinions.NotClickedYet);
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

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

  if (!feedbackConfig) return null;

  const filterOutOldSurveyVersionStats = (versionStatsList: VersionStats[]) => {
    const numberOfSurveyVersionsToKeep = 3;
    return versionStatsList.filter((vs) => {
      const isSameViewContext = vs.viewContext === feedbackConfig.viewContext;
      const isSurveyVersionOutdated =
        vs.surveyVersion <
        feedbackConfig.surveyVersion - numberOfSurveyVersionsToKeep;

      return !(isSameViewContext && isSurveyVersionOutdated);
    });
  };

  const setFeedbackAnswered = () => {
    const currentVersionStats = findCurrentVersionStats(versionStatsList);

    if (currentVersionStats) {
      if (currentVersionStats.answeredAtDisplayCount) {
        currentVersionStats.doNotShowAgain = true;
      }
      currentVersionStats.answeredAtDisplayCount =
        currentVersionStats.displayCount;
      storage.set(
        '@ATB_feedback_display_stats',
        JSON.stringify(versionStatsList),
      );
    }
  };

  const findCurrentVersionStats = (list: VersionStats[]) =>
    list.find(
      (entry: VersionStats) =>
        entry.surveyVersion === feedbackConfig.surveyVersion &&
        entry.viewContext === viewContext,
    );

  const submitFeedbackWithAlternatives = async () => {
    if (!currentVersionStats) return;

    try {
      const selectedAnswers = selectedAlternativeIds.map((altId) =>
        feedbackConfig.question?.alternatives.find(
          (alt) => alt.alternativeId === altId,
        ),
      );

      const appVersion = APP_VERSION;
      const organization = APP_ORG;
      const submitTime = Date.now();
      const displayCount = currentVersionStats.displayCount;
      const isReprompt = currentVersionStats.answeredAtDisplayCount;

      const dataToServer = {
        submitTime,
        appVersion,
        organization,
        selectedOpinion,
        viewContext,
        category: feedbackConfig,
        selectedAnswers,
        isReprompt,
        displayCount,
        metadata,
      };

      const db = firestore();
      await db.settings({ignoreUndefinedProperties: true});
      const submittedFeedbackDoc = await db
        .collection('feedback')
        .add(dataToServer);
      setFirebaseId(submittedFeedbackDoc.id);
    } catch (err: any) {
      Bugsnag.notify(err);
    } finally {
      setSubmitted(true);
      if (!feedbackConfig.alwaysShow) {
        setFeedbackAnswered();
      }
    }
  };

  const setDoNotShowAgain = () => {
    const currentVersionStats = findCurrentVersionStats(versionStatsList);
    if (currentVersionStats) {
      const currentVersionStatsCopy = {...currentVersionStats};
      currentVersionStatsCopy.doNotShowAgain = true;
      const versionStatsListCopy = [...versionStatsList].filter(
        (versionStat) =>
          !(
            versionStat.surveyVersion === feedbackConfig.surveyVersion &&
            versionStat.viewContext === feedbackConfig.viewContext
          ),
      );
      versionStatsListCopy.push(currentVersionStatsCopy);

      setVersionStatsList(versionStatsListCopy);
      storage.set(
        '@ATB_feedback_display_stats',
        JSON.stringify(versionStatsListCopy),
      );
    }
  };

  if (submitted) {
    const selectedTextAlternatives = selectedAlternativeIds.map(
      (altId) =>
        feedbackConfig.question?.alternatives.find(
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

  const currentVersionStats = findCurrentVersionStats(versionStatsList);

  if (!currentVersionStats) return null;

  if (!feedbackConfig.alwaysShow) {
    if (currentVersionStats.doNotShowAgain) return null;
    if (
      feedbackConfig.gracePeriodDisplayCount &&
      feedbackConfig.gracePeriodDisplayCount + 1 >
        currentVersionStats.displayCount
    ) {
      return null;
    }

    if (feedbackConfig.repromptDisplayCount) {
      if (currentVersionStats.answeredAtDisplayCount) {
        const shouldReprompt =
          currentVersionStats.displayCount -
            currentVersionStats.answeredAtDisplayCount >
          feedbackConfig.repromptDisplayCount;
        if (!shouldReprompt) return null;
      }
    } else if (currentVersionStats.answeredAtDisplayCount) {
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
          question={feedbackConfig.question}
        />

        {selectedOpinion !== Opinions.NotClickedYet && (
          <View style={styles.submitButtonView}>
            <Button
              text={t(FeedbackTexts.submitText.submitFeedback)}
              onPress={submitFeedbackWithAlternatives}
              mode="primary"
              interactiveColor={getInteractiveColor(theme)}
            />
          </View>
        )}
        {selectedOpinion === Opinions.NotClickedYet &&
          feedbackConfig.dismissable &&
          !feedbackConfig.alwaysShow && (
            <Button
              style={styles.submitButtonView}
              onPress={setDoNotShowAgain}
              text={t(FeedbackTexts.goodOrBadTexts.doNotShowAgain)}
              mode="tertiary"
              backgroundColor={getThemeColor(theme)}
            />
          )}
      </View>
    );

  return null;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    borderRadius: theme.border.radius.regular,
    padding: theme.spacing.xLarge,
  },
  infoBoxText: theme.typography.body__primary,
  centerText: {
    textAlign: 'center',
  },
  feedbackRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  spacing: {
    width: theme.spacing.medium,
  },
  questionText: {
    marginBottom: theme.spacing.xLarge,
    textAlign: 'center',
  },
  submitButtonView: {
    marginTop: theme.spacing.medium,
  },
  submittedView: {
    flex: 1,
    alignItems: 'center',
  },
}));
