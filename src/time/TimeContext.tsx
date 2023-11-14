import {useInterval} from '@atb/utils/use-interval';
import {clock} from '@entur-private/abt-time-react-native-lib';
import React, {createContext, useContext, useState} from 'react';

type TimeContextState = {
  /**
   * The current time in milliseconds, updated every 2.5 seconds. This is based
   * on server time when possible, and can be safely used for checking the
   * validity of fare contracts.
   */
  now: number;
};

const TimeContext = createContext<TimeContextState | undefined>(undefined);

export const TimeContextProvider: React.FC = ({children}) => {
  const [now, setNow] = useState(Date.now());
  useInterval(() => clock.currentTimeMillis().then(setNow), 2500);

  return (
    <TimeContext.Provider
      value={{
        now,
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
