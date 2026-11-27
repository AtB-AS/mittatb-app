import {RefObject, useCallback, useEffect, useRef, useState} from 'react';
import {StartTokenResult, startToken} from './start-token';

/**
 * Status of the SDK `start`/`login` call for the current user.
 */
export type LifecycleStatus = 'pending' | 'done';

type Args = {
  enabled: boolean;
  userId: string | undefined;
  /** A new value starts the SDK again */
  retryCount: number;
  /** The latest token id, to tell whether a login gave the device a new token */
  latestTokenId: RefObject<string | undefined>;
  /** Called when a login has finished, with the token id from before it */
  onLogin: (userId: string, tokenIdBefore: string | undefined) => void;
};

/**
 * Starts the SDK for the logged in user. If the user has changed since the
 * last time, a fresh token is created with `login`. Otherwise `start` loads
 * the stored token, and renews or creates it if needed.
 */
export const useTokenLifecycle = ({
  enabled,
  userId,
  retryCount,
  latestTokenId,
  onLogin,
}: Args) => {
  const [lifecycle, setLifecycle] = useState<{
    userId?: string;
    status: LifecycleStatus;
    failed?: boolean;
  }>({status: 'pending'});
  const lifecycleRun = useRef<
    | {
        key: string;
        promise: Promise<StartTokenResult>;
        tokenIdBefore: string | undefined;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    // Keep the state while disabled. For the same user the SDK's token is
    // still there, for example while auth fetches a new id token.
    if (!enabled || !userId) return;
    let cancelled = false;
    const key = `${userId}:${retryCount}`;
    if (lifecycleRun.current?.key !== key) {
      // The SDK runs `start`, `login` and `logout` one at a time, so a new run
      // doesn't overlap a running one
      lifecycleRun.current = {
        key,
        promise: startToken(userId),
        tokenIdBefore: latestTokenId.current,
      };
      setLifecycle({userId, status: 'pending'});
    }
    const run = lifecycleRun.current;
    run.promise.then((result) => {
      if (cancelled) return;
      setLifecycle({userId, status: 'done', failed: result === 'failed'});
      if (result === 'logged-in') onLogin(userId, run.tokenIdBefore);
    });
    return () => {
      cancelled = true;
    };
  }, [enabled, userId, retryCount, latestTokenId, onLogin]);

  /**
   * The lifecycle status for the current user. Right after a user change the
   * state still belongs to the previous user, so treat it as pending.
   */
  const lifecycleStatus: LifecycleStatus =
    lifecycle.userId === userId ? lifecycle.status : 'pending';

  /**
   * `start`/`login` failed. The SDK doesn't always report the error in
   * `errorDetails`, so don't wait for it.
   */
  const isStartFailed = lifecycle.userId === userId && !!lifecycle.failed;

  /** Forgets the run, so the SDK is started again. Call it after a logout. */
  const resetRun = useCallback(() => {
    lifecycleRun.current = undefined;
  }, []);

  return {lifecycleStatus, isStartFailed, resetRun};
};
