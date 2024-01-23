import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  findReferenceDataById,
  getReferenceDataName,
  PreassignedFareProduct,
  TariffZone,
  UserProfile,
} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  flattenCarnetTravelRightAccesses,
  isCarnet,
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
  getValidityStatus,
  isValidFareContract,
  mapToUserProfilesWithCount,
  useNonInspectableTokenWarning,
  userProfileCountAndName,
  useTariffZoneSummary,
  ValidityStatus,
} from '../fare-contracts/utils';
import {FareContractDetail} from '../fare-contracts/components/FareContractDetail';
import {getLastUsedAccess} from './carnet/CarnetDetails';
import {InspectionSymbol} from '../fare-contracts/components/InspectionSymbol';
import {UserProfileWithCount} from './types';
import {FareContractHarborStopPlaces} from './components/FareContractHarborStopPlaces';
import {MessageInfoText} from '@atb/components/message-info-text';
import {BundledMobilityBenefitsInfo} from '@atb/fare-contracts/components/BundledMobilityBenefitsInfo';

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
  const warning = useNonInspectableTokenWarning(preassignedFareProduct?.type);
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
        <MessageInfoText message={warning} type="warning" />
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
    status,
    preassignedFareProduct,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();

  const tariffZoneSummary = useTariffZoneSummary(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
  );

  return (
    <View style={styles.container} accessible={true}>
      <View style={styles.fareContractDetails}>
        <View style={styles.details}>
          <FareContractDetail
            header={t(FareContractTexts.label.travellers)}
            content={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, language),
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
      <BundledMobilityBenefitsInfo
        fareProductId={preassignedFareProduct?.id}
        style={{marginTop: 12}}
      />
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
  const isACarnetFareContract = isCarnet(fareContract);
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
