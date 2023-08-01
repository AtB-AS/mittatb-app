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
  GlobalMessageContextEnum,
  GlobalMessageRaw,
  GlobalMessageType,
  Rule,
  RuleOperator,
  RuleVariables,
} from '@atb/global-messages/types';

type GlobalMessageContextState = {
  findGlobalMessages: (
    context: GlobalMessageContextEnum | 'all',
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
        .where(
          'context',
          'array-contains-any',
          Object.values(GlobalMessageContextEnum),
        )
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
      context: GlobalMessageContextEnum | 'all',
      ruleVariables: RuleVariables = {},
    ) => {
      return globalMessages.filter((gm) => {
        const withSameContext = gm.context.find(
          (c) => c === context || context === 'all',
        );
        if (!withSameContext) return false;

        if (gm.rules?.length) {
          const passRules = gm.rules.every((rule) =>
            checkRule(rule, ruleVariables),
          );
          if (!passRules) return false;
        }

        return true;
      });
    },
    [globalMessages],
  );

  const checkRule = (
    globalMessageRule: Rule,
    localVariables: RuleVariables,
  ): boolean => {
    const {
      operator,
      value: ruleValue,
      variable: variableName,
      passOnUndefined,
    } = globalMessageRule;
    if (!(variableName in localVariables)) return false;
    const localValue = localVariables[variableName as keyof RuleVariables];
    if (!localValue) return !!passOnUndefined;
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
