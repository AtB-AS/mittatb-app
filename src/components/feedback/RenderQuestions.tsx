import React from 'react';
import {Opinions} from '.';
import {QuestionType, AlternativeType} from './FeedbackContext';
import {useTranslation, FeedbackTexts} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useSectionItem} from '../sections/section-utils';
import hexToRgba from 'hex-to-rgba';

export interface RenderQuestionProps {
  selectedOpinion: Opinions;
  selectedAlternativeIds: number[];
  question: QuestionType;
  handleAnswerPress: (o: {questionId: number; alternativeId: number}) => void;
}

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
        <ThemeText type="body__primary--bold">
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
    <TouchableOpacity
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
        <ThemeText type="body__primary">
          {alternative.alternativeText[language]}
        </ThemeText>
      </View>
    </TouchableOpacity>
  );
}

const useAlternativeStyle = StyleSheet.createThemeHook((theme) => ({
  alternativeBox: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    paddingVertical: theme.spacings.medium,
    backgroundColor: theme.interactive.interactive_2.default.background,
    borderWidth: theme.border.width.medium,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.interactive.interactive_2.default.background,
  },
  checked: {
    backgroundColor: hexToRgba(
      theme.interactive.interactive_2.active.background,
      0.2,
    ),
    borderColor: theme.interactive.interactive_2.outline.background,
  },
  questionTitleView: {
    marginTop: theme.spacings.xLarge,
    marginBottom: theme.spacings.xLarge,
  },
}));
