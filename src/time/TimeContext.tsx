import {useInterval} from '@atb/utils/use-interval';
import {clock, start} from '@entur-private/abt-time-react-native-lib';
import React, {createContext, useContext, useEffect, useState} from 'react';

type TimeContextState = {
  /**
   * The current time in milliseconds, updated every 2.5 seconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  serverNow: number;
};

const TimeContext = createContext<TimeContextState | undefined>(undefined);

export const TimeContextProvider: React.FC = ({children}) => {
  const [clockIsRunning, setClockIsRunning] = useState(false);
  const [serverNow, setServerNow] = useState(Date.now());

  useEffect(() => {
    start({
      autoStart: true,
      maxDelayInMilliSeconds: 1000,
      parallelizationCount: 3,
      host: 'time.google.com',
    }).then(() => setClockIsRunning(true));
  }, []);
  useInterval(
    () => clock.currentTimeMillis().then(setServerNow),
    2500,
    [],
    !clockIsRunning,
    true,
  );

  return (
    <TimeContext.Provider
      value={{
        serverNow,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

export function useTimeContextState() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error(
      'useTimeContextState must be used within a TimeContextProvider',
    );
  }
  return context;
}
