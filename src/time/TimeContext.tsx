import {useInterval} from '@atb/utils/use-interval';
import {clock, startNativeModule as start} from '@entur-private/abt-token-state-react-native-lib';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {useServerTimeEnabled} from '@atb/time';

type TimeContextState = {
  /**
   * The current time in milliseconds, updated every 2.5 seconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  serverNow: number;
};

const TimeContext = createContext<TimeContextState | undefined>(undefined);

// The number of milliseconds the device time is ahead of server time.
let serverDiff = 0;

/**
 * Returns the current time in milliseconds.
 */
export const getServerNow = () => Date.now() - serverDiff;

export const TimeContextProvider: React.FC = ({children}) => {
  const [clockIsRunning, setClockIsRunning] = useState(false);
  const [serverNow, setServerNow] = useState(Date.now());
  const [serverTimeEnabled] = useServerTimeEnabled();

  useEffect(() => {
    if (serverTimeEnabled) {
      start([], [], {
        autoStart: true,
        maxDelayInMilliSeconds: 1000,
        parallelizationCount: 3,
        host: 'time.google.com',
      }).then(() => setClockIsRunning(true));
    }
  }, [serverTimeEnabled]);

  useInterval(
    () => {
      if (serverTimeEnabled && clockIsRunning) {
        clock.currentTimeMillis().then((ms) => {
          serverDiff = Date.now() - ms;
          setServerNow(ms);
        });
      } else {
        serverDiff = 0;
        setServerNow(Date.now());
      }
    },
    [clockIsRunning, serverTimeEnabled],
    2500,
    false,
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
