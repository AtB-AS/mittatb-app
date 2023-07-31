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
  Rule,
  RuleOperator,
  RuleVariables,
} from '@atb/global-messages/types';

type GlobalMessageContextState = {
  findGlobalMessages: (
    context: GlobalMessageContextType | 'all',
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
    (
      context: GlobalMessageContextType | 'all',
      ruleVariables?: RuleVariables,
    ) => {
      if (context === 'all') {
        return globalMessages;
      }
      return globalMessages.filter((gm) => {
        const withSameContext = gm.context.find((c) => c === context);
        if (!ruleVariables) return withSameContext;
        const passRules = gm.rules?.every((rule) =>
          matchRule(ruleVariables, rule),
        );
        return withSameContext && passRules;
      });
    },
    [globalMessages],
  );

  const matchRule = (
    localVariables: RuleVariables,
    externalRule: Rule,
  ): boolean => {
    const {operator, value: ruleValue, variable} = externalRule;
    const localValue = localVariables[variable];
    if (!localValue) return false;
    switch (operator) {
      case RuleOperator.equalTo:
        if (['string', 'number', 'boolean'].includes(typeof localValue))
          return localValue === ruleValue;
        return false;
      case RuleOperator.notEqualTo:
        if (['string', 'number', 'boolean'].includes(typeof localValue))
          return localValue !== ruleValue;
        return false;
      case RuleOperator.greaterThan:
        if (['string', 'number'].includes(typeof localValue))
          return localValue > ruleValue;
        return false;
      case RuleOperator.lessThan:
        if (['string', 'number'].includes(typeof localValue))
          return localValue < ruleValue;
        return false;
      case RuleOperator.greaterThanOrEqualTo:
        if (['string', 'number'].includes(typeof localValue))
          return localValue >= ruleValue;
        return false;
      case RuleOperator.lessThanOrEqualTo:
        if (['string', 'number'].includes(typeof localValue))
          return localValue <= ruleValue;
        return false;
      case RuleOperator.arrayContains:
        if (Array.isArray(localValue))
          return localValue.includes(ruleValue as any);
        return false;
      default:
        return false;
    }
  };

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
