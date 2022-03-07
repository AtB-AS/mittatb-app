import React, {useEffect, useState, useCallback} from 'react';
import {SectionListData, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import Button from '../button';
import {TripPattern} from '@atb/api/types/trips';
import {Quay} from '@atb/api/types/departures';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import {FeedbackQuestionsMode, useFeedbackQuestion} from './FeedbackContext';
import GoodOrBadButton from './GoodOrBadButton';
import {RenderQuestion} from './RenderQuestions';
import firestore from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';
import {APP_ORG, APP_VERSION} from '@env';
import storage from '@atb/storage';

const WHITELIST_ARRAY = [2, 4, 8, 24, 48, 96, 254];

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
  mode: FeedbackQuestionsMode;
  tripPattern?: TripPattern;
  quayListData?: SectionListData<Quay>[];
  isSearching?: boolean;
  isEmptyResult?: boolean;
};

type versionStats = {
  answered: boolean;
  count: number;
  version: string;
};

export const Feedback = ({mode, tripPattern, quayListData}: FeedbackProps) => {
  const styles = useFeedbackStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
  const category = useFeedbackQuestion(mode);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(
    Opinions.NotClickedYet,
  );
  const [selectedAlternativeIds, setSelectedAlternativeIds] = useState<
    number[]
  >([]);
  const [displayStats, setDisplayStats] = useState<versionStats[]>([]);

  const displayCountType = mode === 'departures' ? 'whitelist' : 'always';

  const getDisplayStatsFromStorage = async () => {
    const resetArray = [
      {
        answered: false,
        count: 0,
        version: APP_VERSION,
      },
    ];

    let count = null;

    try {
      count = await storage.get('@ATB_feedback_display_stats');
    } catch {
      count = [];
    } finally {
      let newStats = null;

      if (typeof count === 'string') {
        newStats = JSON.parse(count);
        const statsForCurrentVersion = newStats.find(
          (entry: versionStats) => entry.version === APP_VERSION,
        );

        if (statsForCurrentVersion) {
          statsForCurrentVersion.count++;
        } else {
          newStats = resetArray;
        }
      } else {
        newStats = resetArray;
      }
      setDisplayStats(newStats);
      try {
        storage.set('@ATB_feedback_display_stats', JSON.stringify(newStats));
      } catch (err: any) {
        Bugsnag.notify(err);
      }
    }
  };

  useEffect(() => {
    getDisplayStatsFromStorage();
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

      const dataToServer = {
        submitTime,
        appVersion,
        organization,
        selectedOpinion,
        mode,
        category,
        selectedAnswers,
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

  if (displayCountType === 'whitelist') {
    if (!WHITELIST_ARRAY.includes(statsForCurrentVersion.count + 1))
      return null;
  }

  if (quayListData || tripPattern)
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
