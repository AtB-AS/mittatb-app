import React from 'react';
import {Opinions} from '.';
import {Question, Alternative} from './FeedbackContext';
import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {Section, ActionItem} from '@atb/components/sections';
import {View} from 'react-native';

export interface RenderQuestionProps {
  selectedOpinion: Opinions;
  selectedAlternativeIds: number[];
  question: Question;
  handleAnswerPress: (o: {questionId: number; alternativeId: number}) => void;
}

export const RenderQuestions = ({
  selectedOpinion,
  selectedAlternativeIds,
  question,
  handleAnswerPress,
}: RenderQuestionProps) => {
  const {language} = useTranslation();

  if (!question) {
    return null;
  }

  if (selectedOpinion === Opinions.Good) {
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
  alternative: Alternative;
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

export default RenderQuestions;
