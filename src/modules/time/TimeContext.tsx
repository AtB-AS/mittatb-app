import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {z} from 'zod';
import {useInterval} from '@atb/utils/use-interval';
import {useServerTimeQuery} from './use-server-time-query';
import {ONE_SECOND_MS} from '@atb/utils/durations';

const TEN_SECONDS_MS = ONE_SECOND_MS * 10;

type TimeContextState = {
  /**
   * The current time in milliseconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  getServerNow: () => number;
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
  const serverNowRef = useRef(Date.now());

  const {data} = useServerTimeQuery();
  useEffect(() => {
    const timeData = TimeResult.safeParse(data).data;
    if (timeData?.timestampMs) {
      serverTimeOffsetGlobal = timeData.timestampMs - Date.now();
    }
  }, [data]);

  useInterval(
    () => {
      serverNowRef.current = Date.now() + serverTimeOffsetGlobal;
    },
    // NOTE: When we get new server time data, we need to reset this interval.
    // This is due to a bug in React Native that causes intervals to stop
    // running when device time is set back in time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
    1000,
    false,
    true,
  );

  const getServerNow = useCallback(() => {
    return serverNowRef.current;
  }, []);

  return (
    <TimeContext.Provider
      value={{
        getServerNow,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
};

/**
 * Returns the current time in milliseconds. This is based
 * on server time when possible, and can be safely used for checking the
 * validity of fare contracts.
 *
 * @param updateInterval - The interval at which to update the time in milliseconds. Defaults to 10 seconds.
 * @returns The current time in milliseconds.
 * @throws An error if the function is used outside of a TimeContextProvider.
 */
export function useTimeContext(updateInterval: number = TEN_SECONDS_MS) {
  const context = useContext(TimeContext);
  if (context === undefined) {
    throw new Error('useTimeContext must be used within a TimeContextProvider');
  }

  const [serverNow, setServerNow] = useState(context.getServerNow());
  useInterval(
    () => {
      setServerNow(context.getServerNow());
    },
    [context],
    updateInterval,
    false,
    true,
  );

  return {serverNow};
}
