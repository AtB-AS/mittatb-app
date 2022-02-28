import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import Bugsnag from '@bugsnag/react-native';

export type FeedbackQuestionsMode = 'departures' | 'assistant';

export type CategoryType = {
  mode: FeedbackQuestionsMode;
  introText: LanguageString;
  question: QuestionType;
};

export type QuestionCategories = Partial<
  Record<FeedbackQuestionsMode, CategoryType>
>;

type LanguageString = {
  nb: string;
  en: string;
};

export type QuestionType = {
  questionText: LanguageString;
  questionId: number;
  alternatives: AlternativeType[];
  mode: FeedbackQuestionsMode;
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
            FeedbackQuestionsMode,
            string
          >;

          let newQuestions: QuestionCategories = {};
          try {
            for (let [mode, questions] of Object.entries(fetchedQuestions)) {
              newQuestions[mode as FeedbackQuestionsMode] = JSON.parse(
                questions,
              ) as CategoryType;
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

export function useFeedbackQuestion(mode: FeedbackQuestionsMode) {
  const {categories} = useFeedbackQuestionsState();
  return categories[mode];
}

export default FeedbackQuestionsProvider;
