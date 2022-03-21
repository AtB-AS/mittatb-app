import React, {createContext, useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';

export type FeedbackQuestionsViewContext = 'departures' | 'assistant';

export type CategoryType = {
  viewContext: FeedbackQuestionsViewContext;
  alwaysShow: boolean;
  dismissable: boolean;
  surveyVersion: number;
  gracePeriodDisplayCount: number;
  repromptDisplayCount: number;
  introText: LanguageString;
  question: QuestionType;
};

export type QuestionCategories = Partial<
  Record<FeedbackQuestionsViewContext, CategoryType>
>;

type LanguageString = {
  nb: string;
  en: string;
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

export type FeedbackQuestionsContextState = {
  categories: QuestionCategories;
};

const defaultFeedbackQuestionsState = {
  categories: {},
};

const FeedbackQuestionsContext = createContext<FeedbackQuestionsContextState>(
  defaultFeedbackQuestionsState,
);

const FeedbackQuestionsProvider: React.FC = ({children}) => {
  const [categories, setCategories] = useState<QuestionCategories>({});

  useEffect(() => {
    firestore()
      .collection('configuration')
      .doc('feedbackQuestions')
      .onSnapshot(
        (snapshot) => {
          const fetchedQuestions = snapshot.data() as Record<
            FeedbackQuestionsViewContext,
            string
          >;

          let newQuestions: QuestionCategories = {};
          try {
            for (let [viewContext, questions] of Object.entries(
              fetchedQuestions,
            )) {
              newQuestions[viewContext as FeedbackQuestionsViewContext] =
                JSON.parse(questions) as CategoryType;
            }
            setCategories(newQuestions);
          } catch (error: any) {
            Bugsnag.notify(error);
          }
        },
        (err) => {
          Bugsnag.notify(err);
        },
      );
  }, []);

  return (
    <FeedbackQuestionsContext.Provider value={{categories}}>
      {children}
    </FeedbackQuestionsContext.Provider>
  );
};

export function useFeedbackQuestionsState() {
  const context = useContext(FeedbackQuestionsContext);
  if (context === undefined) {
    throw new Error(
      'useFeedbackQuestionsState must be used within an FeedbackQuestionsProvider',
    );
  }
  return context;
}

export function useFeedbackQuestion(viewContext: FeedbackQuestionsViewContext) {
  const {categories} = useFeedbackQuestionsState();
  return categories[viewContext];
}

export default FeedbackQuestionsProvider;
