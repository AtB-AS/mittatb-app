import React, {createContext, useContext} from 'react';
import {Platform} from 'react-native';
import {NativeLiveActivities} from '@atb/modules/native';
import {useLiveActivityRegistration} from './use-live-activity-registration';
import type {LiveActivityWithApnsToken} from './types';

type LiveActivitiesContextState = {
  /**
   * Whether the native module is there to start activities with. See
   * `NativeLiveActivities.areActivitiesEnabled()` for user preference.
   */
  isAvailable: boolean;
  activities: LiveActivityWithApnsToken[];
};

const LiveActivitiesContext = createContext<
  LiveActivitiesContextState | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

export const LiveActivitiesContextProvider = ({children}: Props) => {
  const activities = useLiveActivityRegistration();

  return (
    <LiveActivitiesContext.Provider
      value={{
        isAvailable: Platform.OS === 'ios' && !!NativeLiveActivities,
        activities,
      }}
    >
      {children}
    </LiveActivitiesContext.Provider>
  );
};

export function useLiveActivitiesContext() {
  const context = useContext(LiveActivitiesContext);
  if (context === undefined) {
    throw new Error(
      'useLiveActivitiesContext must be used within a LiveActivitiesContextProvider',
    );
  }
  return context;
}
