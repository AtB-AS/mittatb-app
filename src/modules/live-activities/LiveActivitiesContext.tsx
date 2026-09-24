import React, {createContext, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {NativeLiveActivities} from '@atb/modules/native';
import {useLiveActivityRegistration} from './use-live-activity-registration';
import type {LiveActivityWithPushToken} from './types';

type LiveActivitiesContextState = {
  /**
   * Whether the native module is there to start activities with. See
   * `NativeLiveActivities.areActivitiesEnabled()` for user preference.
   */
  isAvailable: boolean;
  activities: LiveActivityWithPushToken[];
  pushToStartToken: string | undefined;
};

const LiveActivitiesContext = createContext<
  LiveActivitiesContextState | undefined
>(undefined);

type Props = {
  children: React.ReactNode;
};

export const LiveActivitiesContextProvider = ({children}: Props) => {
  const activities = useLiveActivityRegistration();

  const [pushToStartToken, setPushToStartToken] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (!NativeLiveActivities) return;

    // TODO: This could be set up as a reactive value native side, so we don't
    // have to both listen and fetch updates here.
    const subscription = NativeLiveActivities.onPushToStartTokenUpdate(
      (token) => setPushToStartToken(token.pushToken),
    );
    NativeLiveActivities.getPushToStartToken().then(
      (token) => token && setPushToStartToken(token),
    );
    return () => subscription.remove();
  }, []);

  return (
    <LiveActivitiesContext.Provider
      value={{
        isAvailable: Platform.OS === 'ios' && !!NativeLiveActivities,
        activities,
        pushToStartToken,
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
