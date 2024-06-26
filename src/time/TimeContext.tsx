import {useInterval} from '@atb/utils/use-interval';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import React, {createContext, useContext, useState} from 'react';
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
  const [serverNow, setServerNow] = useState(Date.now());
  const [serverTimeEnabled] = useServerTimeEnabled();

  useInterval(
    () => {
      if (serverTimeEnabled) {
        mobileTokenClient.currentTimeMillis().then((ms) => {
          serverDiff = Date.now() - ms;
          setServerNow(ms);
        });
      } else {
        serverDiff = 0;
        setServerNow(Date.now());
      }
    },
    [serverTimeEnabled],
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
