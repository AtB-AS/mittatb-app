import React, {createContext, useContext, useEffect, useState} from 'react';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {z} from 'zod';
import {useServerTimeQuery} from './use-server-time-query';

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

/** https://github.com/AtB-AS/identity/blob/main/identity-service/src/handlers/identity/mod.rs#L53 */
const TimeResult = z.object({
  timestamp: z.string(),
  timestampMs: z.number(),
});

export const TimeContextProvider = ({children}: Props) => {
  const [serverNow, setServerNow] = useState(Date.now());
  const {isServerTimeEnabled} = useFeatureTogglesContext();

  const {data} = useServerTimeQuery(isServerTimeEnabled);
  useEffect(() => {
    const timeData = TimeResult.safeParse(data).data;
    if (timeData?.timestampMs) {
      serverDiff = Date.now() - timeData.timestampMs;
      setServerNow(timeData.timestampMs);
    } else {
      serverDiff = 0;
      setServerNow(Date.now());
    }
  }, [data]);

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
