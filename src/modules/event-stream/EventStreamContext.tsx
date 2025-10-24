import {createContext, useContext} from 'react';
import {useSetupEventStream} from './use-setup-event-stream';
import {StreamEventLog} from './types';

interface EventStreamContextValue {
  eventLog: StreamEventLog;
}

export const EventStreamContext = createContext<EventStreamContextValue>({
  eventLog: [],
});

export function useEventStreamContext() {
  const context = useContext(EventStreamContext);
  if (context === undefined) {
    throw new Error(
      'useEventStreamContext must be used within a EventStreamContextProvider',
    );
  }
  return context;
}

type Props = {
  children: React.ReactNode;
};

export const EventStreamContextProvider = ({children}: Props) => {
  const {eventLog} = useSetupEventStream();

  return (
    <EventStreamContext.Provider
      value={{
        eventLog,
      }}
    >
      {children}
    </EventStreamContext.Provider>
  );
};
