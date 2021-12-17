import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {setupMobileTokenClient} from '@atb/mobile-token/client';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import useInterval from '@atb/utils/use-interval';
import {useAuthState} from '@atb/auth';
import Bugsnag from '@bugsnag/react-native';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {updateMetadata} from '@atb/chat/metadata';
import {PayloadAction} from '@entur/react-native-traveller';

type MobileContextState = {
  generateQrCode?: () => Promise<string | undefined>;
  tokenStatus?: TokenStatus;
  retry?: (forceRestart: boolean) => void;
};

const MobileTokenContext = createContext<MobileContextState | undefined>(
  undefined,
);

const MobileTokenContextProvider: React.FC = ({children}) => {
  const {enable_period_tickets} = useRemoteConfig();
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>();
  const {abtCustomerId, userCreationFinished} = useAuthState();

  const [currentCustomerId, setCurrentCustomerId] = useState(abtCustomerId);
  const [retryCount, setRetryCount] = useState(0);

  const setStatus = (status?: TokenStatus) => {
    Bugsnag.leaveBreadcrumb('mobiletoken_status_change', status);
    updateMetadata({
      'AtB-Mobile-Token-State': status?.state,
      'AtB-Mobile-Token-VisualState': status?.visualState,
      'AtB-Mobile-Token-Error': status?.error?.message,
    });
    setTokenStatus(status);
  };

  const client = useMemo(
    () =>
      enable_period_tickets ? setupMobileTokenClient(setStatus) : undefined,
    [enable_period_tickets],
  );

  useEffect(() => {
    if (client && abtCustomerId !== currentCustomerId && userCreationFinished) {
      client.setAccount(abtCustomerId);
      setCurrentCustomerId(abtCustomerId);
    }
  }, [userCreationFinished, client, abtCustomerId, abtCustomerId]);

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      client?.retry(false); // todo: better retry logic
    },
    5000,
    [client?.retry, tokenStatus?.error],
    !client || !tokenStatus?.error || retryCount >= 5,
  );

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      const {err, ...otherErrorData} = tokenStatus!.error!;
      Bugsnag.notify(err || otherErrorData.message, (event) => {
        event.addMetadata('mobiletoken', otherErrorData);
        event.severity = 'error';
      });
      client?.retry(true); // todo: better retry logic
    },
    30000,
    [client?.retry, tokenStatus?.error],
    !client || !tokenStatus?.error || retryCount < 5,
  );

  return (
    <MobileTokenContext.Provider
      value={{
        generateQrCode: async () =>
          client?.getSecureToken([PayloadAction.ticketInspection]),
        tokenStatus,
        retry: client?.retry,
      }}
    >
      {children}
    </MobileTokenContext.Provider>
  );
};

export function useMobileContextState() {
  const context = useContext(MobileTokenContext);
  if (context === undefined) {
    throw new Error(
      'useMobileContextState must be used within a MobileTokenContextProvider',
    );
  }
  return context;
}

export default MobileTokenContextProvider;
