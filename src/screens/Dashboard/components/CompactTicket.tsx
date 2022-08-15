import React from 'react';
import {StyleSheet} from '@atb/theme';
import {AccessibilityProps} from 'react-native';
import {screenReaderPause} from '@atb/components/accessible-text';
import * as Sections from '@atb/components/sections';
import {
  ShortTicketInfoView,
  mapToUserProfilesWithCount,
} from '../../Ticketing/Ticket/TicketInfo';
import {
  FareContract,
  isPreactivatedTicket,
  isInspectableTicket,
} from '@atb/tickets';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  fareContract: FareContract;
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
  testID?: string;
};

const CompactTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  onPressDetails,
  testID,
  hasActiveTravelCard = false,
}) => {
  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: 'OK' + screenReaderPause,
    accessibilityHint: 'OK',
  };

  const travelRights = fc.travelRights.filter(isPreactivatedTicket);
  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const ticketIsInspectable = isInspectableTicket(
    firstTravelRight,
    hasActiveTravelCard,
    hasEnabledMobileToken,
    deviceIsInspectable,
    mobileTokenError,
    fallbackEnabled,
  );
  const fareContractState = fc.state;
  const {startDateTime, endDateTime} = firstTravelRight;
  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();
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
    <Sections.Section withPadding withBottomPadding>
      <Sections.GenericClickableItem onPress={onPressDetails}>
        <ShortTicketInfoView
          preassignedFareProduct={preassignedFareProduct}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
          userProfilesWithCount={userProfilesWithCount}
          status={validityStatus}
          isInspectable={ticketIsInspectable}
          testID={testID}
          filled={true}
        />
      </Sections.GenericClickableItem>
    </Sections.Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionText: {
    marginBottom: theme.spacings.medium,
  },
}));

export default CompactTicket;
