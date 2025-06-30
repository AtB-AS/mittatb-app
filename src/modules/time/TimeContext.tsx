import {useInterval} from '@atb/utils/use-interval';
import React, {createContext, useContext, useState} from 'react';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {client} from '@atb/api';
import {logToBugsnag} from '@atb/utils/bugsnag-utils';
import {z} from 'zod';

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

type Props = {
  children: React.ReactNode;
};

const TimeResponse = z.object({
  timestamp: z.string(),
  timestampMs: z.number(),
});

export const TimeContextProvider = ({children}: Props) => {
  const [serverNow, setServerNow] = useState(Date.now());
  const {isServerTimeEnabled} = useFeatureTogglesContext();

  useInterval(
    async () => {
      if (isServerTimeEnabled) {
        try {
          const response = await client.get('/identity/v1/time');
          const timeResponse = TimeResponse.safeParse(response?.data).data;
          if (timeResponse?.timestampMs) {
            serverDiff = Date.now() - timeResponse.timestampMs;
            setServerNow(timeResponse.timestampMs);
          }
        } catch (error) {
          logToBugsnag('Error fetching server time: ', {error});
        }
      } else {
        serverDiff = 0;
        setServerNow(Date.now());
      }
    },
    [isServerTimeEnabled],
    60 * 1000,
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

export function useTimeContext() {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error(
      'useTimeContextState must be used within a TimeContextProvider',
    );
  }
  return context;
}
