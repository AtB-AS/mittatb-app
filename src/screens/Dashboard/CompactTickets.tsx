import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import * as Sections from '@atb/components/sections';
import {
  ShortTicketInfoView,
  mapToUserProfilesWithCount,
} from '../Ticketing/Ticket/TicketInfo';
import {isPreactivatedTicket, isInspectableTicket} from '@atb/tickets';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import useInterval from '@atb/utils/use-interval';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {
  filterActiveOrCanBeUsedFareContracts,
  isValidRightNowFareContract,
  useTicketState,
} from '@atb/tickets';
import ThemeText from '@atb/components/text';
import {TicketsTexts, useTranslation} from '@atb/translations';

type Props = {
  onPressDetails?: (orderId: string) => void;
};

const CompactTickets: React.FC<Props> = ({onPressDetails}) => {
  const itemStyle = useStyles();

  // TODO: Verify if this is the correct way to update time-to-time the expiration time of the tickets.
  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 1000);

  const {fareContracts, customerProfile} = useTicketState();
  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
  ).sort(function (a, b): number {
    const isA = isValidRightNowFareContract(a);
    const isB = isValidRightNowFareContract(b);

    if (isA === isB) return 0;
    if (isA) return -1;
    return 1;
  });

  // TODO: Double check if this is how it should be implemented, using the customer profile!
  const hasActiveTravelCard = !!customerProfile?.travelcard;
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();
  const {t, language} = useTranslation();

  return (
    <>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={itemStyle.sectionText}
        accessibilityLabel={t(TicketsTexts.header.title)}
      >
        {t(TicketsTexts.header.title)}
      </ThemeText>
      {activeFareContracts?.map((fareContract, index) => {
        const travelRights =
          fareContract.travelRights.filter(isPreactivatedTicket);
        const firstTravelRight = travelRights[0];
        const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
        const ticketIsInspectable = isInspectableTicket(
          firstTravelRight,
          hasActiveTravelCard,
          hasEnabledMobileToken,
          deviceIsInspectable,
          mobileTokenError,
          fallbackEnabled,
        );
        const fareContractState = fareContract.state;
        const {startDateTime, endDateTime} = firstTravelRight;
        const validTo = endDateTime.toMillis();
        const validFrom = startDateTime.toMillis();
        const validityStatus = getValidityStatus(
          now,
          validFrom,
          validTo,
          fareContractState,
        );
        const [firstZone] = tariffZoneRefs;
        const [lastZone] = tariffZoneRefs.slice(-1);
        const fromTariffZone = findReferenceDataById(tariffZones, firstZone);
        const toTariffZone = findReferenceDataById(tariffZones, lastZone);
        const preassignedFareProduct = findReferenceDataById(
          preassignedFareproducts,
          productRef,
        );
        const userProfilesWithCount = mapToUserProfilesWithCount(
          travelRights.map((tr) => tr.userProfileRef),
          userProfiles,
        );

        return (
          <Sections.Section withPadding>
            <Sections.GenericClickableItem
              onPress={() =>
                onPressDetails && onPressDetails(fareContract.orderId)
              }
            >
              <ShortTicketInfoView
                preassignedFareProduct={preassignedFareProduct}
                fromTariffZone={fromTariffZone}
                toTariffZone={toTariffZone}
                userProfilesWithCount={userProfilesWithCount}
                status={validityStatus}
                now={now}
                validTo={validTo}
                validFrom={validFrom}
                isInspectable={ticketIsInspectable}
                testID={'ticket' + index}
                useBackgroundOnInspectionSymbol={true}
              />
            </Sections.GenericClickableItem>
          </Sections.Section>
        );
      })}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

export default CompactTickets;
