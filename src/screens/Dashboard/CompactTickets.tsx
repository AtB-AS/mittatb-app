import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {CompactTicketInfo} from '../Ticketing/Ticket/CompactTicketInfo';
import useInterval from '@atb/utils/use-interval';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  flattenCarnetTicketAccesses,
  isCarnetTicket,
  isPreactivatedTicket,
  useTicketState,
} from '@atb/tickets';
import ThemeText from '@atb/components/text';
import {TicketsTexts, DashboardTexts, useTranslation} from '@atb/translations';
import Button from '@atb/components/button';
import {getTicketInfoDetailsProps} from '../Ticketing/Ticket/TicketInfo';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {getLastUsedAccess} from '../Ticketing/Ticket/Carnet/CarnetDetails';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  onPressDetails?: (
    isCarnet: boolean,
    isInspectable: boolean,
    orderId: string,
  ) => void;
  onPressBuyTickets(): void;
};

const CompactTickets: React.FC<Props> = ({
  onPressDetails,
  onPressBuyTickets,
}) => {
  const itemStyle = useStyles();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 1000);

  const {fareContracts} = useTicketState();
  const activeFareContracts = filterAndSortActiveOrCanBeUsedFareContracts(
    fareContracts,
  ).filter((fareContract) => {
    const travelRights = fareContract.travelRights;
    if (travelRights.length < 1) return false;

    const carnetTravelRights = travelRights.filter(isCarnetTicket);
    if (carnetTravelRights.length > 0) {
      const {usedAccesses} = flattenCarnetTicketAccesses(carnetTravelRights);

      const {status: usedAccessValidityStatus} = getLastUsedAccess(
        now,
        usedAccesses,
      );

      if (usedAccessValidityStatus === 'valid') {
        return true;
      }

      return false;
    }

    const preactivatedTicketTravelRights =
      travelRights.filter(isPreactivatedTicket);
    if (preactivatedTicketTravelRights.length > 0) {
      return true;
    }

    return false;
  });

  const {t} = useTranslation();
  const {customerProfile} = useTicketState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();

  return (
    <>
      <ThemeText
        type="body__secondary"
        color="background_accent_0"
        style={itemStyle.sectionText}
        accessibilityLabel={t(TicketsTexts.header.title)}
      >
        {t(TicketsTexts.header.title)}
      </ThemeText>
      {activeFareContracts.length == 0 ? (
        <Button
          style={itemStyle.buttonSection}
          text={t(DashboardTexts.buyTicketsButton)}
          onPress={onPressBuyTickets}
        />
      ) : (
        activeFareContracts.map((fareContract, index) => {
          const ticketInfoDetailsProps = getTicketInfoDetailsProps(
            fareContract,
            now,
            customerProfile,
            hasEnabledMobileToken,
            deviceIsInspectable,
            mobileTokenError,
            fallbackEnabled,
            tariffZones,
            userProfiles,
            preassignedFareproducts,
          );
          return (
            <CompactTicketInfo
              {...ticketInfoDetailsProps}
              now={now}
              onPressDetails={() => {
                onPressDetails?.(
                  ticketInfoDetailsProps.isCarnetTicket ?? false,
                  ticketInfoDetailsProps.isInspectable ?? false,
                  fareContract.orderId,
                );
              }}
              testID={'ticket' + index}
            />
          );
        })
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  buttonSection: {
    marginLeft: theme.spacings.medium,
    marginRight: theme.spacings.medium,
  },
}));

export default CompactTickets;
