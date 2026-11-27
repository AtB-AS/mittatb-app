import {LifecycleStatus} from './use-token-lifecycle';

type Args = {
  lifecycleStatus: LifecycleStatus;
  hasTokenDetails: boolean;
  hasError: boolean;
  isStartFailed: boolean;
  isWaitingForTokenList: boolean;
};

/**
 * Whether the mobile token is still loading. While it is, a timeout runs that
 * shows the fallback barcode if it takes too long. This includes while auth
 * isn't ready and the SDK isn't started, so the user still gets a barcode.
 */
export const isTokenLoading = ({
  lifecycleStatus,
  hasTokenDetails,
  hasError,
  isStartFailed,
  isWaitingForTokenList,
}: Args) =>
  lifecycleStatus !== 'done' ||
  (!hasTokenDetails && !hasError && !isStartFailed) ||
  isWaitingForTokenList;
