import React, {createContext, useContext, useEffect, useState} from 'react';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export type FeedbackQuestionsViewContext = 'departures' | 'assistant';

export type FeedbackConfiguration = {
  viewContext: FeedbackQuestionsViewContext;
  alwaysShow: boolean;
  dismissable: boolean;
  surveyVersion: number;
  gracePeriodDisplayCount: number;
  repromptDisplayCount: number;
  introText: LanguageString;
  question: QuestionType;
};

type LanguageString = {
  nb: string;
  en: string;
  nn: string;
};

export type QuestionType = {
  questionText: LanguageString;
  questionId: number;
  alternatives: AlternativeType[];
  viewContext: FeedbackQuestionsViewContext;
};

export type AlternativeType = {
  alternativeId: number;
  alternativeText: LanguageString;
};

const FeedbackQuestionsContext = createContext<FeedbackConfiguration[]>([]);

export const FeedbackQuestionsProvider: React.FC = ({children}) => {
  const [categories, setCategories] = useState<FeedbackConfiguration[]>([]);
  const {feedback_questions} = useRemoteConfig();

  useEffect(() => {
    setCategories(feedback_questions ? feedback_questions : []);
  }, [feedback_questions]);

  return (
    <FeedbackQuestionsContext.Provider value={categories}>
      {children}
    </FeedbackQuestionsContext.Provider>
  );
};

function useFeedbackQuestionsState() {
  const context = useContext(FeedbackQuestionsContext);
  if (context === undefined) {
    throw new Error(
      'useFeedbackQuestionsState must be used within an FeedbackQuestionsProvider',
    );
  }
  return context;
}

export function useFeedbackQuestion(viewContext: FeedbackQuestionsViewContext) {
  const allCategories = useFeedbackQuestionsState();
  return allCategories.find((category) => category.viewContext === viewContext);
}
