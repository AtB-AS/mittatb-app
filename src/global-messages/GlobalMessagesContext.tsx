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
import {LanguageAndText} from '@atb/reference-data/types';
import {Statuses} from '@atb/theme';

export type GlobalMessage = {
  id: string;
  active: boolean;
  title?: LanguageAndText[];
  body: LanguageAndText[];
  type: Statuses;
  context: GlobalMessageContext[];
};

export type GlobalMessageContext =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

type GlobalMessageContextState = {
  findGlobalMessages: (context: GlobalMessageContext) => GlobalMessage[];
};

const defaultGlobalMessageState = {
  findGlobalMessages: () => [],
};

const GlobalMessagesContext = createContext<GlobalMessageContextState>(
  defaultGlobalMessageState,
);

const GlobalMessagesContextProvider: React.FC = ({children}) => {
  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([]);
  const [error, setError] = useState(false);

  console.log('global messages', globalMessages);

  useEffect(
    () =>
      firestore()
        .collection('globalMessages')
        .where('active', '==', true)
        .onSnapshot(
          (snapshot) => {
            const globalMessages = (
              snapshot as FirebaseFirestoreTypes.QuerySnapshot<GlobalMessage>
            ).docs.map<GlobalMessage>((d) => d.data());
            setGlobalMessages(globalMessages);
            setError(false);
          },
          (err) => {
            console.warn(err);
            setError(true);
          },
        ),
    [],
  );

  const findGlobalMessages = useCallback(
    (context: GlobalMessageContext) => {
      return globalMessages.filter((a) => {
        if (!a.context) return false;
        if (typeof a.context === 'string') {
          return a.context === context;
        }
        return a.context.find((cont) => cont === context);
      });
    },
    [globalMessages],
  );

  return (
    <GlobalMessagesContext.Provider
      value={{
        findGlobalMessages,
      }}
    >
      {children}
    </GlobalMessagesContext.Provider>
  );
};

export function useGlobalMessagesState() {
  const context = useContext(GlobalMessagesContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalMessagesState must be used within an GlobalMessagesContextProvider',
    );
  }
  return context;
}

export default GlobalMessagesContextProvider;
