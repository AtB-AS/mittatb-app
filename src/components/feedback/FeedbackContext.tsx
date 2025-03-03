import React, {createContext, useContext, useEffect, useState} from 'react';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

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

interface Props {
  children: React.ReactNode;
}

export const FeedbackQuestionsContextProvider = ({children}: Props) => {
  const [categories, setCategories] = useState<FeedbackConfiguration[]>([]);
  const {feedback_questions} = useRemoteConfigContext();

  useEffect(() => {
    setCategories(feedback_questions ? feedback_questions : []);
  }, [feedback_questions]);

  return (
    <FeedbackQuestionsContext.Provider value={categories}>
      {children}
    </FeedbackQuestionsContext.Provider>
  );
};

function useFeedbackQuestionsContext() {
  const context = useContext(FeedbackQuestionsContext);
  if (context === undefined) {
    throw new Error(
      'useFeedbackQuestionsContext must be used within an FeedbackQuestionsContextProvider',
    );
  }
  return context;
}

export function useFeedbackQuestion(viewContext: FeedbackQuestionsViewContext) {
  const allCategories = useFeedbackQuestionsContext();
  return allCategories.find((category) => category.viewContext === viewContext);
}
