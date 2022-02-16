import React from 'react';
import {Opinions} from '.';
import {Question} from './FeedbackContext';
import {useTranslation} from '@atb/translations';
import ThemeText from '@atb/components/text';
import {Section, ActionItem} from '@atb/components/sections';

export interface RenderQuestionProps {
  selectedOpinion: Opinions;
  questions: Array<Question>;
  handleAnswerPress: (o: {questionId: number; answerId: number}) => void;
}

export const RenderQuestions = ({
  selectedOpinion,
  questions,
  handleAnswerPress,
}: RenderQuestionProps) => {
  const {language} = useTranslation();

  console.log('attempting to render questions: ', questions);

  return (
    <>
      {selectedOpinion === Opinions.Bad &&
        questions.map((question: Question) => (
          <>
            <ThemeText type="body__primary--bold">
              {language === 'nb'
                ? question.questionText.norwegian
                : question.questionText.english}
            </ThemeText>

            <Section withTopPadding withBottomPadding>
              {question.alternatives.map((alternative) => (
                <Section withPadding>
                  <ActionItem
                    text={
                      language === 'nb'
                        ? alternative.alternativeText.norwegian
                        : alternative.alternativeText.english
                    }
                    onPress={() =>
                      handleAnswerPress({
                        questionId: question.questionId,
                        answerId: alternative.alternativeId,
                      })
                    }
                    mode="check"
                    checked={alternative.checked}
                    type="compact"
                  />
                </Section>
              ))}
            </Section>
          </>
        ))}
    </>
  );
};

export default RenderQuestions;
