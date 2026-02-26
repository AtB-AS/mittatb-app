import React from 'react';
import {Opinions} from './Feedback';
import {QuestionType, AlternativeType} from './FeedbackContext';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSectionItem} from '@atb/components/sections';
import {NativeButton} from '@atb/components/native-button';
import {Theme} from '@atb/theme/colors';

export interface RenderQuestionProps {
  selectedOpinion: Opinions;
  selectedAlternativeIds: number[];
  question: QuestionType;
  handleAnswerPress: (o: {questionId: number; alternativeId: number}) => void;
}

const getInteractiveColor = (theme: Theme) => theme.color.interactive[2];

export const RenderQuestion = ({
  selectedOpinion,
  selectedAlternativeIds,
  question,
  handleAnswerPress,
}: RenderQuestionProps) => {
  const {language} = useTranslation();
  const styles = useAlternativeStyle();

  if (!question) {
    return null;
  }

  if (
    selectedOpinion === Opinions.Good ||
    selectedOpinion === Opinions.NotClickedYet
  ) {
    return null;
  }

  return (
    <View>
      <View style={styles.questionTitleView}>
        <ThemeText typography="body__m__strong">
          {question.questionText[language]}
        </ThemeText>
      </View>

      {question.alternatives.map((alternative) => (
        <AlternativeItem
          key={alternative.alternativeId}
          selectedAlternativeIds={selectedAlternativeIds}
          alternative={alternative}
          handleAnswerPress={(alternativeId: number) =>
            handleAnswerPress({
              questionId: question.questionId,
              alternativeId,
            })
          }
        />
      ))}
    </View>
  );
};

type AlternativeItemProps = {
  selectedAlternativeIds: number[];
  alternative: AlternativeType;
  handleAnswerPress: (alternativeId: number) => void;
};
function AlternativeItem({
  selectedAlternativeIds,
  alternative,
  handleAnswerPress,
  ...props
}: AlternativeItemProps) {
  const {language, t} = useTranslation();
  const styles = useAlternativeStyle();
  const {topContainer} = useSectionItem({...props});
  const isChecked = selectedAlternativeIds.includes(alternative.alternativeId);

  return (
    <NativeButton
      onPress={() => handleAnswerPress(alternative.alternativeId)}
      accessibilityRole="checkbox"
      accessibilityState={{checked: isChecked}}
      accessibilityHint={`${alternative.alternativeText[language]} ${
        isChecked
          ? t(FeedbackTexts.alternatives.a11yHints.checked)
          : t(FeedbackTexts.alternatives.a11yHints.unchecked)
      }`}
    >
      <View
        style={
          isChecked
            ? [topContainer, styles.alternativeBox, styles.checked]
            : [topContainer, styles.alternativeBox]
        }
      >
        <ThemeText typography="body__m">
          {alternative.alternativeText[language]}
        </ThemeText>
      </View>
    </NativeButton>
  );
}

const useAlternativeStyle = StyleSheet.createThemeHook((theme) => ({
  alternativeBox: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    paddingVertical: theme.spacing.medium,
    backgroundColor: getInteractiveColor(theme).default.background,
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: getInteractiveColor(theme).default.background,
  },
  checked: {
    backgroundColor: getInteractiveColor(theme).active.background,
    borderColor: getInteractiveColor(theme).outline.background,
  },
  questionTitleView: {
    marginTop: theme.spacing.xLarge,
    marginBottom: theme.spacing.xLarge,
  },
}));
