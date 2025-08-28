import React, {createContext, useContext, useEffect, useState} from 'react';
import {z} from 'zod';
import {useInterval} from '@atb/utils/use-interval';
import {useServerTimeQuery} from './use-server-time-query';

type TimeContextState = {
  /**
   * The current time in milliseconds, updated every second. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  serverNow: number;
};

const TimeContext = createContext<TimeContextState | undefined>(undefined);

/**
 * The number of milliseconds the device time is ahead of server time.
 */
let serverTimeOffsetGlobal = 0;

/**
 * Returns the current UNIX time in milliseconds.
 */
export const getServerNowGlobal = () => Date.now() - serverTimeOffsetGlobal;

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

  const {data} = useServerTimeQuery();
  useEffect(() => {
    const timeData = TimeResult.safeParse(data).data;
    if (timeData?.timestampMs) {
      serverTimeOffsetGlobal = timeData.timestampMs - Date.now();
    }
  }, [data]);

  useInterval(
    () => setServerNow(Date.now() - serverTimeOffsetGlobal),
    [],
    1000,
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
