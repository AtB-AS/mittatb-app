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

export type FeedbackQuestionsContext = 'departures' | 'assistant';

export type Question = {
  questionText: {
    norwegian: string;
    english: string;
  };
  questionId: number;
  alternatives: Array<Alternative>;
  context: FeedbackQuestionsContext;
};

export type Alternative = {
  alternativeId: number;
  alternativeText: {
    norwegian: string;
    english: string;
  };
  checked: boolean;
};

export type FeedbackQuestionsContextState = {
  findQuestions: (
    context: FeedbackQuestionsContext,
  ) => Array<Question> | undefined;
};

const defaultFeedbackQuestionsState = {
  findQuestions: () => undefined,
};

const FeedbackQuestionsContext = createContext<FeedbackQuestionsContextState>(
  defaultFeedbackQuestionsState,
);

const FeedbackQuestionsProvider: React.FC = ({children}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState(false);

  useEffect(
    () =>
      firestore()
        .collection('configuration')
        .doc('feedbackQuestions')
        .onSnapshot(
          (snapshot) => {
            const fetchedQuestions = (
              snapshot as FirebaseFirestoreTypes.QueryDocumentSnapshot<{
                assistant: Array<Question>;
              }>
            ).get('assistant');

            const jsonQuestions = JSON.parse(String(fetchedQuestions));
            console.log('fetchedQuestions:', jsonQuestions);
            setQuestions(jsonQuestions);
          },
          (err) => {
            console.warn(err);
            setError(true);
          },
        ),
    [],
  );

  const findQuestions = useCallback(
    (context: FeedbackQuestionsContext) => {
      return questions;
      // return questions.filter((a) => a.context === context);
    },
    [questions],
  );

  return (
    <FeedbackQuestionsContext.Provider
      value={{
        findQuestions,
      }}
    >
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

export default FeedbackQuestionsProvider;
