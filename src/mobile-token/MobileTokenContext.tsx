import React, {createContext, useContext, useMemo, useState} from 'react';
import {setupMobileTokenClient} from '@atb/mobile-token/client';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import useInterval from '@atb/utils/use-interval';

type MobileContextState = {
  generateQrCode: () => Promise<string>;
  tokenStatus?: TokenStatus;
};

const MobileTokenContext = createContext<MobileContextState | undefined>(
  undefined,
);

const MobileTokenContextProvider: React.FC = ({children}) => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>();

  const {generateQrCode, retry} = useMemo(
    () => setupMobileTokenClient(setTokenStatus),
    [],
  );

  const [retryCount, setRetryCount] = useState(0);

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      retry(false); // todo: better retry logic
    },
    5000,
    [retry, tokenStatus?.error],
    !tokenStatus?.error || retryCount >= 5,
  );

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      retry(true); // todo: better retry logic
    },
    30000,
    [retry, tokenStatus?.error],
    !tokenStatus?.error || retryCount < 5,
  );

  return (
    <MobileTokenContext.Provider
      value={{
        generateQrCode,
        tokenStatus,
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
