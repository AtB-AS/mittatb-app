import {ThemeText, screenReaderPause} from '@atb/components/text';
import {
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  flattenCarnetTravelRightAccesses,
  isCarnetTravelRight,
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
import {useMobileTokenContextState} from '@atb/mobile-token';
import {FareContractDetail} from '../fare-contracts/components/FareContractDetail';
import {getLastUsedAccess} from './carnet/CarnetDetails';
import {InspectionSymbol} from '../fare-contracts/components/InspectionSymbol';
import {UserProfileWithCount} from './types';
import {FareContractHarborStopPlaces} from './components/FareContractHarborStopPlaces';
import {MessageBox} from '@atb/components/message-box';

export type FareContractInfoProps = {
  travelRight: PreActivatedTravelRight;
  status: ValidityStatus;
  testID?: string;
  preassignedFareProduct?: PreassignedFareProduct;
};

export type FareContractInfoDetailsProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: FareContractInfoProps['status'];
  isCarnetFareContract?: boolean;
  omitUserProfileCount?: boolean;
  testID?: string;
  now?: number;
  validTo?: number;
  fareProductType?: string;
};

export const FareContractInfoHeader = ({
  travelRight,
  status,
  testID,
  preassignedFareProduct,
}: FareContractInfoProps) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const {startPointRef: fromStopPlaceId, endPointRef: toStopPlaceId} =
    travelRight;

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;
  const productDescription = preassignedFareProduct
    ? getTextForLanguage(preassignedFareProduct.description, language)
    : undefined;
  const {
    isSuccess,
    tokens,
    deviceInspectionStatus,
  } = useMobileTokenContextState();
  const {t} = useTranslation();
  const warning = getNonInspectableTokenWarning(
    isSuccess,
    deviceInspectionStatus,
    t,
    tokens,
    preassignedFareProduct?.type,
  );
  const showTwoWayIcon = travelRight.direction === TravelRightDirection.Both;

  return (
    <View style={styles.header}>
      {productName && (
        <ThemeText
          type="body__primary--bold"
          accessibilityLabel={productName + screenReaderPause}
          testID={testID + 'Product'}
        >
          {productName}
        </ThemeText>
      )}
      {productDescription && (
        <ThemeText
          type="body__secondary"
          accessibilityLabel={productDescription + screenReaderPause}
          testID={testID + 'ProductDescription'}
        >
          {productDescription}
        </ThemeText>
      )}
      {fromStopPlaceId && toStopPlaceId && (
        <FareContractHarborStopPlaces
          fromStopPlaceId={fromStopPlaceId}
          toStopPlaceId={toStopPlaceId}
          showTwoWayIcon={showTwoWayIcon}
        />
      )}
      {status === 'valid' && warning && (
        <MessageBox message={warning} type="warning" subtle={true} />
      )}
    </View>
  );
};

export const FareContractInfoDetails = (
  props: FareContractInfoDetailsProps,
) => {
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
        {isValidFareContract(status) && <InspectionSymbol {...props} />}
      </View>
    </View>
  );
};

export const getFareContractInfoDetails = (
  fareContract: FareContract,
  now: number,
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
): FareContractInfoDetailsProps => {
  const firstTravelRight = fareContract.travelRights?.[0] as NormalTravelRight;
  const {
    startDateTime,
    endDateTime,
    fareProductRef: productRef,
    tariffZoneRefs,
  } = firstTravelRight;
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
    isCarnetFareContract: isACarnetFareContract,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  fareContractDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    rowGap: theme.spacings.medium,
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    rowGap: theme.spacings.medium,
  },
}));
