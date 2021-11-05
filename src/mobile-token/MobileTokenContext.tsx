import React, {createContext, useContext, useMemo, useState} from 'react';
import {setupMobileTokenClient} from '@atb/mobile-token/client';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import useInterval from '@atb/utils/use-interval';
import {useAuthState} from '@atb/auth';

type MobileContextState = {
  generateQrCode: () => Promise<string>;
  tokenStatus?: TokenStatus;
  switchAccount: (accountId: string) => void;
};

const MobileTokenContext = createContext<MobileContextState | undefined>(
  undefined,
);

const MobileTokenContextProvider: React.FC = ({children}) => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>();
  const {abtCustomerId} = useAuthState();

  const client = useMemo(
    () =>
      abtCustomerId
        ? setupMobileTokenClient(abtCustomerId, setTokenStatus)
        : undefined,
    [abtCustomerId],
  );

  const [retryCount, setRetryCount] = useState(0);

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
      client?.retry(true); // todo: better retry logic
    },
    30000,
    [client?.retry, tokenStatus?.error],
    !client || !tokenStatus?.error || retryCount < 5,
  );

  return (
    <MobileTokenContext.Provider
      value={
        client
          ? {
              generateQrCode: client.generateQrCode,
              switchAccount: client.switch,
              tokenStatus,
            }
          : undefined
      }
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
