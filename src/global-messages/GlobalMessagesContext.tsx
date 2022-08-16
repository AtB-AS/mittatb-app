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
  context: GlobalMessageContext;
};

export type GlobalMessageContext =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

type GlobalMessageContextState = {
  findGlobalMessage: (
    context: GlobalMessageContext,
  ) => GlobalMessage | undefined;
};

const defaultGlobalMessageState = {
  findGlobalMessage: () => undefined,
};

const GlobalMessagesContext = createContext<GlobalMessageContextState>(
  defaultGlobalMessageState,
);

const GlobalMessagesContextProvider: React.FC = ({children}) => {
  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([]);
  const [error, setError] = useState(false);

  useEffect(
    () =>
      firestore()
        .collection('alerts-v2')
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

  const findGlobalMessage = useCallback(
    (context: GlobalMessageContext) => {
      return globalMessages.filter((a) => a.context === context)[0];
    },
    [globalMessages],
  );

  return (
    <GlobalMessagesContext.Provider
      value={{
        findGlobalMessage,
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
