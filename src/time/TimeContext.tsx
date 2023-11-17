import {useInterval} from '@atb/utils/use-interval';
import {clock, start} from '@entur-private/abt-time-react-native-lib';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type TimeContextState = {
  /**
   * The current time in milliseconds, updated every 2.5 seconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  serverNow: number;
  /**
   * Returns server time in milliseconds, based on the difference between
   * the previous serverNow and device time.
   */
  getServerNow: () => number;
};

const TimeContext = createContext<TimeContextState | undefined>(undefined);

export const TimeContextProvider: React.FC = ({children}) => {
  const [clockIsRunning, setClockIsRunning] = useState(false);
  const [serverNow, setServerNow] = useState(Date.now());

  // The number of milliseconds the local clock is ahead of the server clock.
  const [clientServerDiff, setClientServerDiff] = useState<number>();

  const getServerNow = useCallback(() => {
    return Date.now() - (clientServerDiff || 0);
  }, [clientServerDiff]);

  useEffect(() => {
    start({
      autoStart: true,
      maxDelayInMilliSeconds: 1000,
      parallelizationCount: 3,
      host: 'time.google.com',
    }).then(() => setClockIsRunning(true));
  }, []);
  useInterval(
    () =>
      clock.currentTimeMillis().then((ms) => {
        setClientServerDiff(Date.now() - ms);
        setServerNow(ms);
      }),
    2500,
    [],
    !clockIsRunning,
    true,
  );

  return (
    <TimeContext.Provider
      value={{
        serverNow,
        getServerNow,
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
