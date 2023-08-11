import {ThemeText, screenReaderPause} from '@atb/components/text';
import {
  PreassignedFareProduct,
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
  TravelRightDirection,
} from '@atb/ticketing';
import {
  FareContractTexts,
  getTextForLanguage,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {
  getNonInspectableTokenWarning,
  isValidFareContract,
  mapToUserProfilesWithCount,
  ValidityStatus,
  userProfileCountAndName,
  getValidityStatus,
  tariffZonesSummary,
} from '../fare-contracts/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {FareContractDetail} from '../fare-contracts/components/FareContractDetail';
import {WarningMessage} from '../fare-contracts/components/WarningMessage';
import {Barcode} from '../fare-contracts/details/Barcode';
import {SectionSeparator} from '@atb/components/sections';
import {getLastUsedAccess} from './carnet/CarnetDetails';
import {InspectionSymbol} from '../fare-contracts/components/InspectionSymbol';
import {UserProfileWithCount} from './types';
import {FareContractHarborStopPlaces} from './components/FareContractHarborStopPlaces';

export type FareContractInfoProps = {
  travelRights: PreActivatedTravelRight[];
  status: ValidityStatus;
  isInspectable: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  fareContract?: FareContract;
  fareProductType?: string;
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
  fareProductType?: string;
};

export const FareContractInfo = ({
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
  const {
    fareProductRef: productRef,
    tariffZoneRefs,
    startPointRef: fromStopPlaceId,
    endPointRef: toStopPlaceId,
  } = firstTravelRight;

  const firstZone = tariffZoneRefs?.[0];
  const lastZone = tariffZoneRefs?.slice(-1)?.[0];

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    productRef,
  );
  const fromTariffZone = firstZone
    ? findReferenceDataById(tariffZones, firstZone)
    : undefined;
  const toTariffZone = lastZone
    ? findReferenceDataById(tariffZones, lastZone)
    : undefined;

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  return (
    <View style={{flex: 1}}>
      <FareContractInfoHeader
        preassignedFareProduct={preassignedFareProduct}
        travelRights={travelRights}
        isInspectable={isInspectable}
        testID={testID}
        status={status}
        fareProductType={fareProductType}
        fromStopPlaceId={fromStopPlaceId}
        toStopPlaceId={toStopPlaceId}
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
        fareProductType={fareProductType}
      />
    </View>
  );
};

const FareContractInfoHeader = ({
  preassignedFareProduct,
  isInspectable,
  testID,
  status,
  travelRights,
  fareProductType,
  fromStopPlaceId,
  toStopPlaceId,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  isInspectable?: boolean;
  testID?: string;
  status: FareContractInfoProps['status'];
  travelRights?: FareContractInfoProps['travelRights'];
  fareProductType?: string;
  fromStopPlaceId?: string;
  toStopPlaceId?: string;
}) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;
  const productDescription = preassignedFareProduct
    ? getTextForLanguage(preassignedFareProduct.description, language)
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
  const showTwoWayIcon =
    travelRights?.[0].direction === TravelRightDirection.Both;

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
        {productDescription && (
          <ThemeText
            type="body__secondary"
            style={styles.product}
            accessibilityLabel={productDescription + screenReaderPause}
            testID={testID + 'ProductDescription'}
          >
            {productDescription}
          </ThemeText>
        )}
      </View>
      {fromStopPlaceId && toStopPlaceId && (
        <FareContractHarborStopPlaces
          fromStopPlaceId={fromStopPlaceId}
          toStopPlaceId={toStopPlaceId}
          showTwoWayIcon={showTwoWayIcon}
        />
      )}
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
    fareProductType,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();

  const tariffZoneSummary =
    fromTariffZone && toTariffZone
      ? tariffZonesSummary(fromTariffZone, toTariffZone, language, t)
      : undefined;

  const isBoat = ['boat-single', 'boat-period'].includes(fareProductType || '');

  return (
    <View style={styles.container} accessible={true}>
      <View style={styles.fareContractDetails}>
        <View style={styles.details}>
          <FareContractDetail
            header={t(FareContractTexts.label.travellers)}
            content={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, omitUserProfileCount, language),
            )}
          />
          {tariffZoneSummary && (
            <FareContractDetail
              header={t(FareContractTexts.label.zone)}
              content={[tariffZoneSummary]}
            />
          )}
        </View>
        {!isBoat && isValidFareContract(status) && (
          <InspectionSymbol {...props} />
        )}
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
  let validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );

  const firstZone = tariffZoneRefs?.[0];
  const lastZone = tariffZoneRefs?.slice(-1)?.[0];
  const fromTariffZone = firstZone
    ? findReferenceDataById(tariffZones, firstZone)
    : undefined;
  const toTariffZone = lastZone
    ? findReferenceDataById(tariffZones, lastZone)
    : undefined;
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: theme.spacings.xSmall,
  },
}));
