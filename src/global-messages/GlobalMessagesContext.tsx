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
            console.log('newGlobalMessages', newGlobalMessages);
            console.log('newUpcomingGlobalMessages', newUpcomingGlobalMessages);
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

  // Checks if any global messages should be removed or added based on their time interval, also disables the interval
  // if there are no upcoming global messages or active global messages with a specified end date
  const updateGlobalMessages = () => {
    console.warn('Interval fired', globalMessages, upcomingGlobalMessages);
    const withinTimeRange = upcomingGlobalMessages.filter(isWithinTimeRange);
    const updatedGlobalMessages = globalMessages
      .filter(isWithinTimeRange)
      .concat(withinTimeRange);
    const updatedUpcomingGlobalMessages = upcomingGlobalMessages.filter(
      (gm) => !withinTimeRange.includes(gm),
    );

    if (
      withinTimeRange.length ||
      globalMessages.some((gm) => !isWithinTimeRange(gm))
    ) {
      setGlobalMessages(updatedGlobalMessages);
      setUpcomingGlobalMessages(updatedUpcomingGlobalMessages);
    }
    const noEndDate = globalMessages.every((gm) => !gm.endDate);
    setDisableInterval(
      (globalMessages.length && noEndDate) ||
        (updatedUpcomingGlobalMessages.length === 0 &&
          !updatedGlobalMessages.some(isWithinTimeRange)),
    );
  };

  useInterval(
    updateGlobalMessages,
    2500,
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
