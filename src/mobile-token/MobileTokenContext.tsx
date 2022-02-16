import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {setupMobileTokenClient} from '@atb/mobile-token/client';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import {useAuthState} from '@atb/auth';
import Bugsnag from '@bugsnag/react-native';
import {updateMetadata} from '@atb/chat/metadata';
import {PayloadAction} from '@entur/react-native-traveller';
import {useTicketState} from '@atb/tickets';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type MobileContextState = {
  generateQrCode?: () => Promise<string | undefined>;
  tokenStatus?: TokenStatus;
  retry?: (forceRestart: boolean) => void;
};

const MobileTokenContext = createContext<MobileContextState | undefined>(
  undefined,
);

const MobileTokenContextProvider: React.FC = ({children}) => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>();
  const {abtCustomerId, userCreationFinished} = useAuthState();
  const [currentCustomerId, setCurrentCustomerId] = useState(abtCustomerId);

  const setStatus = (status?: TokenStatus) => {
    Bugsnag.leaveBreadcrumb('mobiletoken_status_change', status);
    updateMetadata({
      'AtB-Mobile-Token-State': status?.state,
      'AtB-Mobile-Token-VisualState': status?.visualState,
      'AtB-Mobile-Token-Error': status?.error?.message,
    });
    setTokenStatus(status);
  };

  const hasEnabledMobileToken = useHasEnabledMobileToken();

  const client = useMemo(
    () =>
      hasEnabledMobileToken ? setupMobileTokenClient(setStatus) : undefined,
    [hasEnabledMobileToken],
  );

  useEffect(() => {
    if (client && abtCustomerId !== currentCustomerId && userCreationFinished) {
      client.setAccount(abtCustomerId);
      setCurrentCustomerId(abtCustomerId);
    }
  }, [userCreationFinished, client, abtCustomerId, abtCustomerId]);

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

export function useHasEnabledMobileToken() {
  const {customerProfile} = useTicketState();
  const {enable_period_tickets} = useRemoteConfig();

  return customerProfile?.enableMobileToken || enable_period_tickets;
}

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
