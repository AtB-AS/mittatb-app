import React, {
  createContext,
  useCallback,
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
import {TravelToken} from '@atb/mobile-token/types';
import useInterval from '@atb/utils/use-interval';
import {StoredToken} from '../../.yalc/@entur/react-native-traveller';

type MobileTokenContextState = {
  generateQrCode?: () => Promise<string | undefined>;
  tokenStatus?: TokenStatus;
  retry?: (forceRestart: boolean) => void;
  travelTokens?: TravelToken[];
  toggleTravelToken?: (tokenId: string) => Promise<boolean>;
  updateTravelTokens: () => void;
};

const MobileTokenContext = createContext<MobileTokenContextState | undefined>(
  undefined,
);

const MobileTokenContextProvider: React.FC = ({children}) => {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>();
  const {abtCustomerId, userCreationFinished} = useAuthState();

  const [rawTokens, setRawTokens] = useState<StoredToken[]>();
  const [mappedTravelTokens, setMappedTravelTokens] = useState<TravelToken[]>();
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

  const updateTravelTokens = useCallback(() => {
    if (!client) return;

    client.listTokens().then(setRawTokens);
  }, [client]);

  const toggleTravelToken = useCallback(
    async (tokenId: string) => {
      if (!client) return false;

      try {
        const storedTokens = await client.toggleToken(tokenId);
        setRawTokens(storedTokens);
        return true;
      } catch (err: any) {
        Bugsnag.notify(err);
        return false;
      }
    },
    [client],
  );

  useEffect(() => {
    const mappedTokens = rawTokens?.map((t) =>
      mapToken(t, tokenStatus?.tokenId),
    );
    setMappedTravelTokens(mappedTokens);
  }, [rawTokens, tokenStatus]);

  useEffect(() => {
    if (tokenStatus?.state === 'Valid') {
      updateTravelTokens();
    }
  }, [tokenStatus, updateTravelTokens]);

  useEffect(() => {
    if (client && abtCustomerId && userCreationFinished) {
      Bugsnag.leaveBreadcrumb('mobiletoken_set_account', {
        accountId: abtCustomerId,
      });
      client.setAccount(abtCustomerId);
      updateTravelTokens();
    }
  }, [userCreationFinished, client, abtCustomerId]);

  // Try again every minute if travel tokens undefined
  useInterval(
    updateTravelTokens,
    1000 * 60 * 15,
    [updateTravelTokens],
    rawTokens !== undefined,
  );

  // Refresh travel tokens every 15 minutes
  useInterval(
    updateTravelTokens,
    1000 * 60 * 15,
    [updateTravelTokens],
    rawTokens === undefined,
  );

  return (
    <MobileTokenContext.Provider
      value={{
        generateQrCode: async () =>
          client?.getSecureToken([PayloadAction.ticketInspection]),
        tokenStatus,
        retry: client?.retry,
        travelTokens: mappedTravelTokens,
        toggleTravelToken,
        updateTravelTokens,
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

export function useMobileTokenContextState() {
  const context = useContext(MobileTokenContext);
  if (context === undefined) {
    throw new Error(
      'useMobileTokenContextState must be used within a MobileTokenContextProvider',
    );
  }
  return context;
}

export default MobileTokenContextProvider;

const mapToken = (
  st: StoredToken,
  thisDeviceTokenId?: string,
): TravelToken => ({
  id: st.id,
  name: st.deviceName,
  inspectable: st.allowedActions.includes('TOKEN_ACTION_TICKET_INSPECTION'),
  activated: st.state === 'TOKEN_LIFECYCLE_STATE_ACTIVATED',
  type: st.type === 'TOKEN_TYPE_TRAVELCARD' ? 'travelCard' : 'mobile',
  travelCardId: st.keyValues?.['travelCardId'],
  isThisDevice: st.id === thisDeviceTokenId,
});
