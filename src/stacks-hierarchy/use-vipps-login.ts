import {
  getOrCreateVippsUserCustomToken,
  VIPPS_CALLBACK_URL,
} from '@atb/api/identity';
import {
  useAuthContext,
  useAuthenticateVipps,
  VippsSignInErrorCode,
} from '@atb/modules/auth';
import {
  closeInAppBrowseriOS,
  openInAppBrowser,
} from '@atb/modules/in-app-browser';
import {useOnboardingContext} from '@atb/modules/onboarding';
import {storage} from '@atb/modules/storage';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import queryString from 'query-string';
import {useEffect, useRef, useState} from 'react';
import {Linking} from 'react-native';

/**
 * Vipps login: opens the Vipps authorization URL in the in-app browser,
 * handles the deep-link callback and signs in with the custom token from
 * identity.
 *
 * Several screens using this hook can be mounted at the same time (e.g. the
 * login options screen below the "other login methods" screen), so only the
 * screen that started the flow handles the callback.
 *
 * `subscribeToFocus` is the screen's focus listener, used to clear the loading
 * state when the user returns from the in-app browser without logging in.
 */
export const useVippsLogin = (
  subscribeToFocus: (callback: () => void) => () => void,
) => {
  const {signInWithCustomToken} = useAuthContext();
  const {completeOnboardingSection} = useOnboardingContext();
  const appStatus = useAppStateStatus();
  const [error, setError] = useState<VippsSignInErrorCode>();
  const [isLoading, setIsLoading] = useState(false);
  const [authorizationCode, setAuthorizationCode] = useState<string>();
  const isAwaitingCallback = useRef(false);

  const {mutateAsync: authVipps} = useAuthenticateVipps({
    onSuccess: (url) => openInAppBrowser(url),
    onError: () => {
      isAwaitingCallback.current = false;
      setError('unknown_error');
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onMutate: () => {
      isAwaitingCallback.current = true;
      setError(undefined);
      setIsLoading(true);
    },
  });

  useEffect(
    () =>
      subscribeToFocus(() => {
        setIsLoading(false);
      }),
    [subscribeToFocus],
  );

  useEffect(() => {
    const signInVippsUser = async (authorizationCode: string) => {
      try {
        const customToken =
          await getOrCreateVippsUserCustomToken(authorizationCode);
        const errorCode = await signInWithCustomToken(
          customToken.data as string,
        );
        if (errorCode) {
          setError(errorCode);
        }
        completeOnboardingSection('userCreation');
      } catch {
        setError('unknown_error');
      } finally {
        setIsLoading(false);
      }
    };
    if (authorizationCode) {
      signInVippsUser(authorizationCode);
    }
  }, [authorizationCode, completeOnboardingSection, signInWithCustomToken]);

  useEffect(() => {
    const vippsCallbackHandler = async (event: {url: string}) => {
      if (!event.url.includes(VIPPS_CALLBACK_URL)) return;
      if (!isAwaitingCallback.current) return;
      isAwaitingCallback.current = false;

      closeInAppBrowseriOS();
      setIsLoading(true);
      const {query} = queryString.parseUrl(event.url);
      const code = query.code;
      if (code) {
        const initialState = await storage.get('vipps_state');
        if (initialState?.toString() !== query.state?.toString()) {
          setError('unknown_error');
          setIsLoading(false);
        } else {
          setAuthorizationCode(code.toString());
        }
      } else if (query.error) {
        const error = query.error;
        if (error === 'outdated_app_version' || error === 'access_denied') {
          setError(error);
        } else {
          setError('unknown_error');
        }
        setIsLoading(false);
      }
    };
    const eventSubscription = Linking.addEventListener(
      'url',
      vippsCallbackHandler,
    );
    return () => eventSubscription.remove();
  }, [appStatus]);

  return {authVipps, error, isLoading};
};
