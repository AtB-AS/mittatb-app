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
} from './storage';
import {
  GlobalMessageContextEnum,
  GlobalMessageRaw,
  GlobalMessageType,
} from './types';
import {checkRules, RuleVariables} from '@atb/rule-engine/rules';

type GlobalMessageContextState = {
  findGlobalMessages: (
    context: GlobalMessageContextEnum,
    ruleVariables?: RuleVariables,
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
  const setLatestDismissedGlobalMessages = useCallback(
    async (globalMessages: GlobalMessageType[]) => {
      const dismissedGlobalMessages = await getDismissedMessagesFromStore();
      const currentlyActiveDismissedMessages = dismissedGlobalMessages
        ? dismissedGlobalMessages.filter((dgm: GlobalMessageType) =>
            isCurrentlyActive(dgm.id, globalMessages),
          )
        : [];
      setDismissedMessagesInStore(currentlyActiveDismissedMessages);
      setDismissedGlobalMessages(currentlyActiveDismissedMessages);
    },
    [],
  );

  useEffect(
    () =>
      firestore()
        .collection<GlobalMessageRaw>('globalMessagesV2')
        .where('active', '==', true)
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
    [setLatestDismissedGlobalMessages],
  );

  const isCurrentlyActive = (
    dismissedMessageId: string,
    globalMessages: GlobalMessageType[],
  ) => {
    return globalMessages.map((gm) => gm.id).indexOf(dismissedMessageId) > -1;
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
    (context: GlobalMessageContextEnum, ruleVariables: RuleVariables = {}) => {
      return globalMessages.filter((gm) => {
        const withSameContext = gm.context.find((c) => c === context);
        if (!withSameContext) return false;
        if (gm.rules?.length) {
          const passRules = checkRules(gm.rules, ruleVariables);
          if (!passRules) return false;
        }

        return true;
      });
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

export function useGlobalMessagesContext() {
  const context = useContext(GlobalMessagesContext);
  if (context === undefined) {
    throw new Error(
      'useGlobalMessagesState must be used within an GlobalMessagesContextProvider',
    );
  }
  return context;
}

export {GlobalMessagesContextProvider};
