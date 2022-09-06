import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import {LanguageAndText} from '@atb/reference-data/types';
import {Statuses} from '@atb/theme';
import {mapToGlobalMessages} from './converters';
import {
  addDismissedMessageInStore,
  getDismissedMessagesFromStore,
  setDismissedMessagesInStore,
} from '@atb/global-messages/storage';

export type GlobalMessage = {
  id: string;
  active: boolean;
  title?: LanguageAndText[];
  body: LanguageAndText[];
  type: Statuses;
  context: GlobalMessageContext[];
  isDismissable?: boolean;
};

export type GlobalMessageContext =
  | 'app-assistant'
  | 'app-departures'
  | 'app-ticketing'
  | 'web-ticketing'
  | 'web-overview';

type GlobalMessageContextState = {
  findGlobalMessages: (context: GlobalMessageContext) => GlobalMessage[];
  dismissedGlobalMessages: GlobalMessage[];
  addDismissedGlobalMessages: (dismissedMessage: GlobalMessage) => void;
  resetDismissedGlobalMessages: () => void;
};

const defaultGlobalMessageState = {
  findGlobalMessages: () => [],
  dismissedGlobalMessages: [],
  addDismissedGlobalMessages: (dismissedMessage: GlobalMessage) => {},
  resetDismissedGlobalMessages: () => {},
};
const GlobalMessagesContext = createContext<GlobalMessageContextState>(
  defaultGlobalMessageState,
);

const GlobalMessagesContextProvider: React.FC = ({children}) => {
  const [globalMessages, setGlobalMessages] = useState<GlobalMessage[]>([]);
  const [dismissedGlobalMessages, setDismissedGlobalMessages] = useState<
    GlobalMessage[]
  >([]);
  const [error, setError] = useState(false);
  useEffect(
    () =>
      firestore()
        .collection('globalMessages')
        .where('active', '==', true)
        .where('context', 'array-contains-any', [
          'app-ticketing',
          'app-departures',
          'app-assistant',
        ])
        .onSnapshot(
          async (snapshot) => {
            const globalMessages = mapToGlobalMessages(snapshot.docs);
            setGlobalMessages(globalMessages);
            await setLatestDismissedGlobalMessages(globalMessages);
            setError(false);
          },
          (err) => {
            console.warn(err);
            setError(true);
          },
        ),
    [],
  );

  const isCurrentlyActive = (
    dismissedMessageId: string,
    globalMessages: GlobalMessage[],
  ) => {
    return globalMessages.map((gm) => gm.id).indexOf(dismissedMessageId) > -1;
  };

  const setLatestDismissedGlobalMessages = async (
    globalMessages: GlobalMessage[],
  ) => {
    const dismissedGlobalMessages = await getDismissedMessagesFromStore();
    const currentlyActiveDismissedMessages = dismissedGlobalMessages
      ? dismissedGlobalMessages.filter((dgm: GlobalMessage) =>
          isCurrentlyActive(dgm.id, globalMessages),
        )
      : [];
    setDismissedMessagesInStore(currentlyActiveDismissedMessages);
    setDismissedGlobalMessages(currentlyActiveDismissedMessages);
  };

  const addDismissedGlobalMessages = async (
    dismissedMessage: GlobalMessage,
  ) => {
    const dismissedGlobalMessages = await addDismissedMessageInStore(
      dismissedMessage,
    );
    setDismissedGlobalMessages(dismissedGlobalMessages);
  };

  const resetDismissedGlobalMessages = async () => {
    await setDismissedMessagesInStore([]);
    setDismissedGlobalMessages([]);
  };

  const findGlobalMessages = useCallback(
    (context: GlobalMessageContext) => {
      return globalMessages.filter((a) =>
        a.context.find((cont) => cont === context),
      );
    },
    [globalMessages],
  );

  return (
    <GlobalMessagesContext.Provider
      value={{
        findGlobalMessages,
        dismissedGlobalMessages,
        addDismissedGlobalMessages,
        resetDismissedGlobalMessages,
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
