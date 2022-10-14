import ThemeText from '@atb/components/text';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
  TariffZone,
  UserProfile,
} from '@atb/reference-data/types';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {
  CustomerProfile,
  FareContract,
  flattenCarnetTravelRightAccesses,
  isCarnetTravelRight,
  isInspectableTravelRight,
  NormalTravelRight,
  PreActivatedTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {UserProfileWithCount} from '../Purchase/Travellers/use-user-count-state';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  getNonInspectableTokenWarning,
  isValidFareContract,
  mapToUserProfilesWithCount,
  ValidityStatus,
  userProfileCountAndName,
  getValidityStatus,
} from '@atb/screens/Ticketing/FareContracts/utils';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import FareContractDetail from '@atb/screens/Ticketing/FareContracts/Component/FareContractDetail';
import WarningMessage from '@atb/screens/Ticketing/FareContracts/Component/WarningMessage';
import Barcode from '@atb/screens/Ticketing/FareContracts/Details/Barcode';
import SectionSeparator from '@atb/components/sections/section-separator';
import {getLastUsedAccess} from './Carnet/CarnetDetails';
import InspectionSymbol from '@atb/screens/Ticketing/FareContracts/Component/InspectionSymbol';

export type FareContractInfoProps = {
  travelRights: PreActivatedTravelRight[];
  status: ValidityStatus;
  isInspectable: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  fareContract?: FareContract;
  fareProductType?: PreassignedFareProductType;
};

export type FareContractInfoDetailsProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: FareContractInfoProps['status'];
  isInspectable: boolean;
  isCarnetFareContract?: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  now?: number;
  validTo?: number;
};

const FareContractInfo = ({
  travelRights,
  status,
  isInspectable,
  omitUserProfileCount,
  testID,
  fareContract,
  fareProductType,
}: FareContractInfoProps) => {
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

  const firstTravelRight = travelRights[0];
  const {fareProductRef: productRef, tariffZoneRefs} = firstTravelRight;
  const [firstZone] = tariffZoneRefs;
  const [lastZone] = tariffZoneRefs.slice(-1);

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
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
      <FareContractInfoHeader
        preassignedFareProduct={preassignedFareProduct}
        isInspectable={isInspectable}
        testID={testID}
        status={status}
        fareProductType={fareProductType}
      />
      <SectionSeparator />
      {fareContract && (
        <>
          <Barcode
            validityStatus={status}
            isInspectable={isInspectable}
            fc={fareContract}
          />
          {isInspectable && <SectionSeparator />}
        </>
      )}
      <FareContractInfoDetails
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

const FareContractInfoHeader = ({
  preassignedFareProduct,
  isInspectable,
  testID,
  status,
  fareProductType,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  isInspectable?: boolean;
  testID?: string;
  status: FareContractInfoProps['status'];
  fareProductType?: PreassignedFareProductType;
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
    fareProductType,
  );

  return (
    <View style={styles.header}>
      <View style={styles.fareContractHeader}>
        {productName && (
          <ThemeText
            type="body__primary--bold"
            style={styles.product}
            accessibilityLabel={productName + screenReaderPause}
            testID={testID + 'Product'}
          >
            {productName}
          </ThemeText>
        )}
      </View>
      {status === 'valid' && warning && <WarningMessage message={warning} />}
    </View>
  );
};

const FareContractInfoDetails = (props: FareContractInfoDetailsProps) => {
  const {
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
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
      <View style={styles.fareContractDetails}>
        <View style={styles.details}>
          <FareContractDetail
            header={t(FareContractTexts.label.travellers)}
            children={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, omitUserProfileCount, language),
            )}
          />
          {tariffZoneSummary && (
            <FareContractDetail
              header={t(FareContractTexts.label.zone)}
              children={[tariffZoneSummary]}
            />
          )}
        </View>
        {isValidFareContract(status) && <InspectionSymbol {...props} />}
      </View>
    </View>
  );
};

export const getFareContractInfoDetails = (
  fareContract: FareContract,
  now: number,
  customerProfile: CustomerProfile | undefined,
  hasEnabledMobileToken: boolean,
  deviceIsInspectable: boolean,
  mobileTokenError: boolean,
  fallbackEnabled: boolean,
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
): FareContractInfoDetailsProps => {
  const hasActiveTravelCard = !!customerProfile?.travelcard;
  const firstTravelRight = fareContract.travelRights?.[0] as NormalTravelRight;
  const {
    startDateTime,
    endDateTime,
    fareProductRef: productRef,
    tariffZoneRefs,
  } = firstTravelRight;
  const isInspectable = isInspectableTravelRight(
    firstTravelRight,
    hasActiveTravelCard,
    hasEnabledMobileToken,
    deviceIsInspectable,
    mobileTokenError,
    fallbackEnabled,
  );
  const fareContractState = fareContract.state;
  var validTo = endDateTime.toMillis();
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
    preassignedFareProducts,
    productRef,
  );
  const userProfilesWithCount = mapToUserProfilesWithCount(
    fareContract.travelRights.map(
      (tr) => (tr as NormalTravelRight).userProfileRef,
    ),
    userProfiles,
  );

  const carnetTravelRights =
    fareContract.travelRights.filter(isCarnetTravelRight);
  const isACarnetFareContract = carnetTravelRights.length > 0;
  if (isACarnetFareContract) {
    const {usedAccesses} = flattenCarnetTravelRightAccesses(carnetTravelRights);

    const {validTo: usedAccessValidTo} = getLastUsedAccess(now, usedAccesses);
    if (usedAccessValidTo) validTo = usedAccessValidTo;
  }

  return {
    preassignedFareProduct: preassignedFareProduct,
    fromTariffZone: fromTariffZone,
    toTariffZone: toTariffZone,
    userProfilesWithCount: userProfilesWithCount,
    status: validityStatus,
    now: now,
    validTo: validTo,
    isInspectable: isInspectable,
    isCarnetFareContract: isACarnetFareContract,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1, paddingTop: theme.spacings.xSmall},
  product: {
    marginTop: theme.spacings.small,
  },
  fareContractDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {flex: 1},
  header: {
    justifyContent: 'space-between',
    marginBottom: theme.spacings.medium,
  },
  fareContractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacings.xSmall,
  },
}));

export default FareContractInfo;
