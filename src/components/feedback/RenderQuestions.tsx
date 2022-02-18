import React from 'react';
import {Opinions} from '.';
import {QuestionType, AlternativeType, CategoryType} from './FeedbackContext';
import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {Section} from '@atb/components/sections';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
      <ThemeText type="body__primary--bold">
        {question.questionText[language]}
      </ThemeText>

      <Section withTopPadding withBottomPadding>
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
      </Section>
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
  const {language} = useTranslation();
  const styles = useAlternativeStyle();
  const {topContainer} = useSectionItem({...props});
  const checked = selectedAlternativeIds.includes(alternative.alternativeId);

  return (
    <Section>
      <TouchableOpacity
        onPress={() => handleAnswerPress(alternative.alternativeId)}
      >
        <View
          style={
            checked
              ? [topContainer, styles.alternativeBox, styles.checked]
              : [topContainer, styles.alternativeBox]
          }
        >
          <ThemeText type="body__primary">
            {alternative.alternativeText[language]}
          </ThemeText>
        </View>
      </TouchableOpacity>
    </Section>
  );
}

const useAlternativeStyle = StyleSheet.createThemeHook((theme) => ({
  alternativeBox: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacings.medium,
    marginBottom: theme.spacings.small,
    paddingTop: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
    backgroundColor: theme.colors.background_0.backgroundColor,
    borderWidth: 2,
    borderRadius: theme.border.radius.regular,
    borderColor: theme.colors.background_0.backgroundColor,
  },
  checked: {
    backgroundColor: hexToRgba(theme.colors.primary_1.backgroundColor, 0.2),
    borderColor: theme.colors.primary_2.backgroundColor,
  },
}));
