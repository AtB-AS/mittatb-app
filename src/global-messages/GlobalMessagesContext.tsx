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
import useInterval from '@atb/utils/use-interval';

type GlobalMessageContextState = {
  findGlobalMessages: (
    context: GlobalMessageContextType,
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
  const [upcomingGlobalMessages, setUpcomingGlobalMessages] = useState<
    GlobalMessageType[]
  >([]);
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
            setDisableInterval(false);
            const newGlobalMessages = mapToGlobalMessages(snapshot.docs);
            setGlobalMessages(newGlobalMessages.filter(isWithinTimeRange));
            await setLatestDismissedGlobalMessages(newGlobalMessages);
            const newUpcomingGlobalMessages = newGlobalMessages.filter(
              (gm) => gm.startDate && gm.startDate?.toMillis() > Date.now(),
            );
            setUpcomingGlobalMessages(newUpcomingGlobalMessages);
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

  const isWithinTimeRange = (globalMessage: GlobalMessageType) => {
    const now = Date.now();
    const startDate = globalMessage.startDate?.toMillis() ?? 0;
    const endDate = globalMessage.endDate?.toMillis() ?? 8640000000000000;

    return startDate <= now && endDate >= now;
  };

  const [disableInterval, setDisableInterval] = useState(false);
  var num = 0;
  useInterval(
    () => {
      num++;
      //Add count to console.log to see how many times this is called
      console.log('Interval called', num);
      if (upcomingGlobalMessages.some(isWithinTimeRange)) {
        const updatedGlobalMessages = globalMessages.filter(isWithinTimeRange);
        const filteredUpcomingGlobalMessages =
          upcomingGlobalMessages.filter(isWithinTimeRange);
        updatedGlobalMessages.push(...filteredUpcomingGlobalMessages);
        setUpcomingGlobalMessages(
          upcomingGlobalMessages.filter((gm) => {
            return !filteredUpcomingGlobalMessages.includes(gm);
          }),
        );
        setGlobalMessages(updatedGlobalMessages);
      } else if (globalMessages.some((gm) => !isWithinTimeRange(gm))) {
        setGlobalMessages(globalMessages.filter(isWithinTimeRange));
      }

      //disable interval if there are no upcoming messages and no active messages that are within its range
      if (
        upcomingGlobalMessages.length === 0 &&
        !globalMessages.some((gm) => isWithinTimeRange(gm))
      ) {
        setDisableInterval(true);
      }
    },
    1000,
    [globalMessages, upcomingGlobalMessages],
    disableInterval,
  );

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
    (context: GlobalMessageContextType) => {
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
