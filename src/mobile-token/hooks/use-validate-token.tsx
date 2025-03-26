import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {RemoteToken} from '../types';
import {useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {mobileTokenClient} from '@atb/mobile-token/mobileTokenClient';
import {
  getMobileTokenErrorHandlingStrategy,
  MOBILE_TOKEN_QUERY_KEY,
  wipeToken,
} from '../utils';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import {LOAD_NATIVE_TOKEN_QUERY_KEY} from './use-load-native-token-query';
import {useAuthContext} from '@atb/auth';

const RETRY_MAX_COUNT = 3;

/**
 * This hook is used to check if the token needs renewal/reset.
 *
 * After loading both local/native token and remote tokens list,
 * check if the local token has a counterpart remote token.
 *
 * If the local token id exists in remote tokens list id, do nothing.
 * If the local token id doesn't exit in remote tokens list, the
 * remote token might be expired or removed, do this:
 *
 *      1.  Try renewing the token
 *      2a. If the renewal success, good
 *      2b. If renewal fails, check the error, in a normal operation
 *          it should return TokenMustBeReplacedError.
 *      3.  Wipe the token and re-create token.
 *      4.  Reset the queries so it can re-check if the token is
 *          created properly.
 *      5.  If the token creation/renewal fails, show fallback
 *
 *
 * If the local token has a counterpart remote token, do a check whether
 * we need to renew the token or not. If any of the information on the
 * remote token details is different to the local token information,
 * renew the token.
 *
 * The information that we use to check token renewal are:
 * - OS version
 * - OS API Level
 * - App version
 * - App version code (build number)
 * - Library version
 * - Device ID
 *
 */

const MOBILE_TOKEN_LIBRARY_VERSION = '3.3.2';

export const useValidateToken = (
  nativeToken: ActivatedToken | undefined,
  remoteTokens: RemoteToken[] | undefined,
  traceId: string,
) => {
  const queryClient = useQueryClient();
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRenewingOrResetting, setIsRenewingOrResetting] = useState(false);
  const {userId} = useAuthContext();

  useEffect(() => {
    const renewOrResetToken = async (
      token: ActivatedToken,
      traceId: string,
    ) => {
      try {
        logToBugsnag(`Try renewing token ${token.tokenId}`);
        setIsRenewingOrResetting(true);
        const renewedToken = await mobileTokenClient.renew(token, traceId);
        logToBugsnag(`Succesfully renewed token ${renewedToken.tokenId}`);
        queryClient.setQueryData(
          [MOBILE_TOKEN_QUERY_KEY, LOAD_NATIVE_TOKEN_QUERY_KEY, userId],
          renewedToken,
        );
      } catch (error: any) {
        logToBugsnag(
          `Error renewing token ${token.tokenId} with trace ID ${traceId}`,
        );
        if (getMobileTokenErrorHandlingStrategy(error) === 'reset') {
          logToBugsnag(`Error handling during renewal suggests resetting`);
          logToBugsnag(
            `Wiping token ${token.tokenId} with trace ID ${traceId}`,
          );
          await wipeToken([token.tokenId], traceId);
          logToBugsnag(`Token wiped`);
          logToBugsnag(`Resetting queries to restart token process`);
          queryClient.resetQueries([MOBILE_TOKEN_QUERY_KEY]);
        } else {
          notifyBugsnag(error, {
            errorGroupHash: 'token',
            metadata: {
              description: `Got an error while renewing token ${token.tokenId}`,
            },
          });
        }
      }
      setIsRenewingOrResetting(false);
      setRetryCount((previous) => previous + 1);
    };

    const checkShouldRenew = async (remoteToken: RemoteToken) => {
      const apiLevel =
        Platform.OS === 'ios'
          ? DeviceInfo.getSystemVersion()
          : DeviceInfo.getApiLevelSync();
      const isOsVersionSame =
        remoteToken.osVersion === DeviceInfo.getSystemVersion();
      const isOsApiLevelSame = remoteToken.osApiLevel === apiLevel.toString();
      const isAppVersionSame =
        remoteToken.appVersion === DeviceInfo.getVersion();
      const isAppVersionCodeSame =
        remoteToken.appVersionCode === DeviceInfo.getBuildNumber();
      const isDeviceIdSame =
        remoteToken.deviceId === (await DeviceInfo.getUniqueId());
      // match the library version here with the package.json version;
      const isLibraryVersionSame = remoteToken.libraryVersion === MOBILE_TOKEN_LIBRARY_VERSION;

      logToBugsnag(
        `Checking token details to see if we should renew the token`,
      );

      logToBugsnag(`OS version`, {
        token: remoteToken.osVersion,
        device: DeviceInfo.getSystemVersion(),
      });

      logToBugsnag(`OS API level`, {
        token: remoteToken.osApiLevel,
        device: apiLevel.toString(),
      });

      logToBugsnag(`App version`, {
        token: remoteToken.appVersion,
        device: DeviceInfo.getVersion(),
      });

      logToBugsnag(`App version code`, {
        token: remoteToken.appVersionCode,
        device: DeviceInfo.getBuildNumber(),
      });

      logToBugsnag(`Device ID`, {
        token: remoteToken.deviceId,
        device: DeviceInfo.getUniqueId(),
      });

      logToBugsnag(`Library version`, {
        token: remoteToken.libraryVersion,
        device: MOBILE_TOKEN_LIBRARY_VERSION,
      });
      return !(
        isOsVersionSame &&
        isOsApiLevelSame &&
        isAppVersionSame &&
        isAppVersionCodeSame &&
        isDeviceIdSame &&
        isLibraryVersionSame
      );
    };

    if (remoteTokens && nativeToken) {
      const token = remoteTokens.find(
        (token) => token.id === nativeToken.tokenId,
      );
      if (!token && retryCount < RETRY_MAX_COUNT) {
        logToBugsnag(
          `Token ${nativeToken.tokenId} does not exist on remote, should try to renew or reset the token.`,
        );
        renewOrResetToken(nativeToken, traceId);
      }

      if (token && token.type === 'mobile') {
        checkShouldRenew(token).then((shouldRenew) => {
          if (shouldRenew) {
            logToBugsnag('Token should be renewed because there are difference between details on the token and the device')
            renewOrResetToken(nativeToken, traceId);
          }
        });
      }
    }
  }, [queryClient, nativeToken, remoteTokens, retryCount, traceId, userId]);

  return {
    isRenewingOrResetting,
  };
};
