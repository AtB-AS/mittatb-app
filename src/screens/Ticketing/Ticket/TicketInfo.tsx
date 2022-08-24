import ThemeText from '@atb/components/text';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
  TariffZone,
} from '@atb/reference-data/types';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {FareContract, PreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  getNonInspectableTokenWarning,
  isValidTicket,
  mapToUserProfilesWithCount,
  ValidityStatus,
  userProfileCountAndName,
} from '@atb/screens/Ticketing/Ticket/utils';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import NonTicketInspectionSymbol from '@atb/screens/Ticketing/Ticket/Component/NotForInspectionSymbol';
import TicketDetail from '@atb/screens/Ticketing/Ticket/Component/TicketDetail';
import WarningMessage from '@atb/screens/Ticketing/Ticket/Component/WarningMessage';
import QrCode from '@atb/screens/Ticketing/Ticket/Details/QrCode';
import SectionSeparator from '@atb/components/sections/section-separator';
import ZoneSymbol from '@atb/screens/Ticketing/Ticket/Component/ZoneSymbol';

export type TicketInfoProps = {
  travelRights: PreactivatedTicket[];
  status: ValidityStatus;
  isInspectable: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  fareContract?: FareContract;
  ticketType?: PreassignedFareProductType;
};

export type TicketInfoDetailsProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: TicketInfoProps['status'];
  isInspectable?: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  now?: number;
  validTo?: number;
};

const TicketInfo = ({
  travelRights,
  status,
  isInspectable,
  omitUserProfileCount,
  testID,
  fareContract,
  ticketType,
}: TicketInfoProps) => {
  const {tariffZones, userProfiles, preassignedFareproducts} =
    useFirestoreConfiguration();

  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareproducts,
    productRef,
  );
  const fromTariffZone = findReferenceDataById(tariffZones, firstZone);
  const toTariffZone = findReferenceDataById(tariffZones, lastZone);

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  return (
    <View style={{flex: 1}}>
      <TicketInfoHeader
        preassignedFareProduct={preassignedFareProduct}
        isInspectable={isInspectable}
        testID={testID}
        status={status}
        ticketType={ticketType}
      />
      {fareContract && (
        <>
          <SectionSeparator />
          <QrCode
            validityStatus={status}
            ticketIsInspectable={isInspectable}
            fc={fareContract}
          />
          <SectionSeparator />
        </>
      )}
      <TicketInfoDetails
        fromTariffZone={fromTariffZone}
        toTariffZone={toTariffZone}
        userProfilesWithCount={userProfilesWithCount}
        status={status}
        isInspectable={isInspectable}
        omitUserProfileCount={omitUserProfileCount}
        preassignedFareProduct={preassignedFareProduct}
      />
    </View>
  );
};

const TicketInfoHeader = ({
  preassignedFareProduct,
  isInspectable,
  testID,
  status,
  ticketType,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  isInspectable?: boolean;
  testID?: string;
  status: TicketInfoProps['status'];
  ticketType?: PreassignedFareProductType;
}) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;
  const {isError, remoteTokens, fallbackEnabled} = useMobileTokenContextState();
  const {t} = useTranslation();
  const warning = getNonInspectableTokenWarning(
    isError,
    fallbackEnabled,
    t,
    remoteTokens,
    isInspectable,
    ticketType,
  );
  return (
    <View style={styles.header}>
      <View style={styles.ticketHeader}>
        {productName && (
          <ThemeText
            type="body__primary--bold"
            style={styles.product}
            accessibilityLabel={productName + screenReaderPause}
            testID={testID + 'Product'}
          >
            {productName + ', AtB'}
          </ThemeText>
        )}
        {status === 'valid' && !isInspectable && <NonTicketInspectionSymbol />}
      </View>
      {warning && <WarningMessage message={warning} />}
    </View>
  );
};

const TicketInfoDetails = (props: TicketInfoDetailsProps) => {
  const {
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    isInspectable,
    omitUserProfileCount,
    status,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();

  const tariffZoneSummary =
    fromTariffZone && toTariffZone
      ? tariffZonesSummary(fromTariffZone, toTariffZone, language, t)
      : undefined;

  return (
    <View style={styles.container} accessible={true}>
      <View style={styles.ticketDetails}>
        <View>
          <TicketDetail
            header={t(TicketTexts.label.travellers)}
            children={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, omitUserProfileCount, language),
            )}
          />
          {tariffZoneSummary && (
            <TicketDetail
              header={t(TicketTexts.label.zone)}
              children={[tariffZoneSummary]}
            />
          )}
        </View>
        {isValidTicket(status) && isInspectable && <ZoneSymbol {...props} />}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, paddingTop: theme.spacings.xSmall},
  product: {
    marginTop: theme.spacings.small,
  },
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    justifyContent: 'space-between',
    marginBottom: theme.spacings.medium,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacings.xSmall,
  },
}));

export default TicketInfo;
