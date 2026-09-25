import {useEffect, useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import Bugsnag from '@bugsnag/react-native';
import {registerLiveActivity, unregisterLiveActivity} from '@atb/api/journey';
import {NativeLiveActivities, type LiveActivityInfo} from '@atb/modules/native';
import {useAuthContext} from '@atb/modules/auth';
import type {LiveActivityWithApnsToken} from './types';
import {useNotificationsContext} from '../notifications';

const REGISTRATION_RETRIES = 3;

/**
 * Keeps the backend's Live Activity registrations in sync with the activities
 * ActivityKit is running, for as long as the app is alive.
 *
 * An activity is registered once it has a push token, which is what the backend
 * pushes updates to. Tokens rotate, and an activity outlives the app process, so
 * the native module reports both the activities it already knows about at
 * startup and every later change.
 *
 * Registrations are keyed by token on the backend, so a rotated token is
 * registered anew and the token it replaced is unregistered. Ending an activity
 * unregisters it too, best-effort: the backend prunes registrations on its own,
 * and this only runs while the app does.
 */
export const useLiveActivityRegistration = (): LiveActivityWithApnsToken[] => {
  const {authStatus} = useAuthContext();
  const {fcmToken} = useNotificationsContext();
  const isAuthenticated = authStatus === 'authenticated';

  const [activities, setActivities] = useState<
    Record<string, LiveActivityWithApnsToken>
  >({});
  /** Mirrors `activities`, so the event handlers can read it without resubscribing. */
  const activitiesRef = useRef<Record<string, LiveActivityWithApnsToken>>({});
  /** Tokens no longer in use: replaced by a rotation, or belonging to an ended activity. */
  const [staleTokens, setStaleTokens] = useState<string[]>([]);
  /** Tokens already sent to the backend, so reconciling twice registers once. */
  const registeredTokens = useRef(new Set<string>());

  const {mutate: register} = useMutation({
    mutationFn: registerLiveActivity,
    retry: REGISTRATION_RETRIES,
  });
  const {mutate: unregister} = useMutation({
    mutationFn: unregisterLiveActivity,
    retry: REGISTRATION_RETRIES,
  });

  useEffect(() => {
    if (!NativeLiveActivities) return;

    const onPushToken = ({activityId, tripId, apnsToken}: LiveActivityInfo) => {
      if (!apnsToken) return;
      const previous = activitiesRef.current[activityId];
      if (previous?.apnsToken === apnsToken) return;

      activitiesRef.current = {
        ...activitiesRef.current,
        [activityId]: {activityId, tripId, apnsToken},
      };
      setActivities(activitiesRef.current);
      if (previous) setStaleTokens((tokens) => [...tokens, previous.apnsToken]);
    };

    const onEnded = ({activityId, apnsToken}: LiveActivityInfo) => {
      const previous = activitiesRef.current[activityId];
      if (previous) {
        const remaining = {...activitiesRef.current};
        delete remaining[activityId];
        activitiesRef.current = remaining;
        setActivities(remaining);
      }

      const staleToken = apnsToken ?? previous?.apnsToken;
      if (staleToken) setStaleTokens((tokens) => [...tokens, staleToken]);
    };

    // Events emitted before this point are lost — activities are observed
    // natively from app start, well before React mounts — so start from the
    // activities the native module already knows about.
    NativeLiveActivities.getActiveActivities()
      .then((active) => active.forEach(onPushToken))
      .catch((error) =>
        Bugsnag.notify(`Unable to read active Live Activities: ${error}`),
      );

    const subscriptions = [
      NativeLiveActivities.onPushTokenUpdate(onPushToken),
      NativeLiveActivities.onActivityEnded(onEnded),
    ];
    return () => subscriptions.forEach((subscription) => subscription.remove());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!fcmToken) return;

    Object.values(activities).forEach(({tripId, apnsToken}) => {
      if (registeredTokens.current.has(apnsToken)) return;
      registeredTokens.current.add(apnsToken);

      register(
        {tripId, apnsToken, fcmToken},
        {
          onError: (error) => {
            registeredTokens.current.delete(apnsToken);
            Bugsnag.notify(`Failed to register Live Activity: ${error}`);
          },
        },
      );
    });
  }, [activities, isAuthenticated, register, fcmToken]);

  useEffect(() => {
    if (!isAuthenticated || staleTokens.length === 0) return;

    const handled = staleTokens;
    handled.forEach((apnsToken) => {
      registeredTokens.current.delete(apnsToken);
      unregister(
        {apnsToken},
        {
          onError: (error) =>
            Bugsnag.notify(`Failed to unregister Live Activity: ${error}`),
        },
      );
    });
    setStaleTokens((tokens) =>
      tokens.filter((token) => !handled.includes(token)),
    );
  }, [staleTokens, isAuthenticated, unregister]);

  return Object.values(activities);
};
