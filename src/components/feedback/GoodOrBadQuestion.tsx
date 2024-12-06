import {useTranslation} from '@atb/translations';
import {
  FeedbackQuestionsViewContext,
  useFeedbackQuestion,
} from './FeedbackContext';
import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import {GoodOrBadButton} from './GoodOrBadButton';
import React from 'react';
import {Opinions} from './Feedback';
import {StyleSheet} from '@atb/theme';

type GoodOrBadQuestionProps = {
  viewContext: FeedbackQuestionsViewContext;
  setSelectedOpinion: (e: Opinions) => void;
  selectedOpinion: Opinions;
};

export const GoodOrBadQuestion = ({
  setSelectedOpinion,
  selectedOpinion,
  viewContext,
}: GoodOrBadQuestionProps) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const category = useFeedbackQuestion(viewContext);

  if (!category) {
    return null;
  }

  return (
    <>
      <ThemeText typography="heading__component" style={styles.questionText}>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
}));
