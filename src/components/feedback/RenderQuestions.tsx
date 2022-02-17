import React from 'react';
import {Opinions} from '.';
import {QuestionType, AlternativeType, CategoryType} from './FeedbackContext';
import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {Section, ActionItem} from '@atb/components/sections';
import {View} from 'react-native';

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
}: AlternativeItemProps) {
  const {language} = useTranslation();

  return (
    <Section withPadding>
      <ActionItem
        text={alternative.alternativeText[language]}
        onPress={() => handleAnswerPress(alternative.alternativeId)}
        mode="check"
        checked={selectedAlternativeIds.includes(alternative.alternativeId)}
        type="compact"
      />
    </Section>
  );
}
