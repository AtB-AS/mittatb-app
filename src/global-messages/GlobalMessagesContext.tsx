import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import {mapToGlobalMessages} from './converters';
import {
  addDismissedMessageInStore,
  getDismissedMessagesFromStore,
  setDismissedMessagesInStore,
} from '@atb/global-messages/storage';
import {
  GlobalMessageContextType,
  GlobalMessageRaw,
  GlobalMessageType,
} from '@atb/global-messages/types';

type GlobalMessageContextState = {
  findGlobalMessages: (
    context?: GlobalMessageContextType,
  ) => GlobalMessageType[];
  dismissedGlobalMessages: GlobalMessageType[];
  addDismissedGlobalMessages: (dismissedMessage: GlobalMessageType) => void;
  resetDismissedGlobalMessages: () => void;
};

const defaultGlobalMessageState = {
  findGlobalMessages: () => [],
  dismissedGlobalMessages: [],
  addDismissedGlobalMessages: () => {},
  resetDismissedGlobalMessages: () => {},
};
const GlobalMessagesContext = createContext<GlobalMessageContextState>(
  defaultGlobalMessageState,
);

const GlobalMessagesContextProvider: React.FC = ({children}) => {
  const [globalMessages, setGlobalMessages] = useState<GlobalMessageType[]>([]);
  const [dismissedGlobalMessages, setDismissedGlobalMessages] = useState<
    GlobalMessageType[]
  >([]);
  useEffect(
    () =>
      firestore()
        .collection<GlobalMessageRaw>('globalMessagesV2')
        .where('active', '==', true)
        .where('context', 'array-contains-any', [
          'app-ticketing',
          'app-departures',
          'app-assistant',
        ])
        .onSnapshot(
          async (snapshot) => {
            const newGlobalMessages = mapToGlobalMessages(snapshot.docs);
            setGlobalMessages(newGlobalMessages);
            await setLatestDismissedGlobalMessages(newGlobalMessages);
          },
          (err) => {
            console.warn(err);
          },
        ),
    [],
  );

  const isCurrentlyActive = (
    dismissedMessageId: string,
    globalMessages: GlobalMessageType[],
  ) => {
    return globalMessages.map((gm) => gm.id).indexOf(dismissedMessageId) > -1;
  };

  const setLatestDismissedGlobalMessages = async (
    globalMessages: GlobalMessageType[],
  ) => {
    const dismissedGlobalMessages = await getDismissedMessagesFromStore();
    const currentlyActiveDismissedMessages = dismissedGlobalMessages
      ? dismissedGlobalMessages.filter((dgm: GlobalMessageType) =>
          isCurrentlyActive(dgm.id, globalMessages),
        )
      : [];
    setDismissedMessagesInStore(currentlyActiveDismissedMessages);
    setDismissedGlobalMessages(currentlyActiveDismissedMessages);
  };

  const addDismissedGlobalMessages = async (
    dismissedMessage: GlobalMessageType,
  ) => {
    const dismissedGlobalMessages = await addDismissedMessageInStore(
      dismissedMessage,
    );
    setDismissedGlobalMessages(dismissedGlobalMessages);
  };

  const resetDismissedGlobalMessages = async () => {
    await setDismissedMessagesInStore([]);
    setDismissedGlobalMessages([]);
    console.warn('Reset dismissed messages');
  };

  const findGlobalMessages = useCallback(
    (context?: GlobalMessageContextType) => {
      if (!context) {
        return globalMessages.filter((a) =>
          a.context.some((cont) => cont.includes('app')),
        );
      }
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

export {GlobalMessagesContextProvider};
