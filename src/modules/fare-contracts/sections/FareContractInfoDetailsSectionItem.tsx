import {
  findReferenceDataById,
  PreassignedFareProduct,
  FareZone,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {
  getLastUsedAccess,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {
  getValidityStatus,
  isValidFareContract,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
  useFareZoneSummary,
  ValidityStatus,
} from '../utils';
import {FareContractDetailItem} from '../components/FareContractDetailItem';
import {InspectionSymbol} from '../components/InspectionSymbol';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {getAccesses} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';
import {
  arrayMapUniqueWithCount,
  toCountAndName,
  UniqueWithCount,
} from '@atb/utils/array-map-unique-with-count';

export type FareContractInfoProps = {
  status: ValidityStatus;
  testID?: string;
  preassignedFareProduct?: PreassignedFareProduct;
  sentToCustomerAccountId?: string;
};

export type FareContractInfoDetailsProps = {
  fareContract: FareContractType;
  preassignedFareProduct?: PreassignedFareProduct;
  fromFareZone?: FareZone;
  toFareZone?: FareZone;
  userProfilesWithCount: UniqueWithCount<UserProfile>[];
  baggeProductsWithCount: UniqueWithCount<PreassignedFareProduct>[];
  status: FareContractInfoProps['status'];
  testID?: string;
  now?: number;
  validTo?: number;
  fareProductType?: string;
};

export const FareContractInfoDetailsSectionItem = ({
  fareContract,
  preassignedFareProduct,
  fromFareZone,
  toFareZone,
  userProfilesWithCount,
  status,
  ...props
}: SectionItemProps<FareContractInfoDetailsProps>) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {topContainer} = useSectionItem(props);

  const fareZoneSummary = useFareZoneSummary(
    preassignedFareProduct,
    fromFareZone,
    toFareZone,
  );

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const firstTravelRight = fareContract.travelRights[0];

  const isStatusSent = status === 'sent';

  const isValidOrSentFareContract: boolean =
    isValidFareContract(status) || isStatusSent;

  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  const baggageProducts = fareContract.travelRights
    .map((tr) =>
      findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
    )
    .filter(isDefined)
    .filter((p) => p.isBaggageProduct);

  const baggeProductsWithCount = arrayMapUniqueWithCount(
    baggageProducts,
    (a, b) => a.id === b.id,
  );

  return (
    <View style={[topContainer, styles.container]} accessible={true}>
      <View style={styles.fareContractDetails}>
        <View style={styles.details}>
          {!!fareProductTypeConfig?.transportModes.length && (
            <FareContractDetailItem
              header={t(FareContractTexts.label.transportModes)}
              content={[
                getTransportModeText(fareProductTypeConfig.transportModes, t),
              ]}
            />
          )}
          {firstTravelRight.travelerName ? (
            <FareContractDetailItem
              header={t(FareContractTexts.label.travellers)}
              content={[firstTravelRight.travelerName]}
            />
          ) : (
            <FareContractDetailItem
              header={t(FareContractTexts.label.travellers)}
              content={userProfilesWithCount
                .map((u) => userProfileCountAndName(u, language))
                .concat(
                  baggeProductsWithCount.map((p) =>
                    toCountAndName(p, language),
                  ),
                )}
            />
          )}
          {fareZoneSummary && (
            <FareContractDetailItem
              header={t(FareContractTexts.label.zone)}
              content={[fareZoneSummary]}
            />
          )}
        </View>
        {isValidOrSentFareContract && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={isStatusSent}
          />
        )}
      </View>
    </View>
  );
};

export const getFareContractInfoDetails = (
  fareContract: FareContractType,
  now: number,
  fareZones: FareZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
): FareContractInfoDetailsProps => {
  const {
    endDateTime,
    fareProductRef: productRef,
    fareZoneRefs,
  } = fareContract.travelRights[0];
  let validTo = endDateTime.getTime();
  const validityStatus = getValidityStatus(now, fareContract);

  const firstZone = fareZoneRefs?.[0];
  const lastZone = fareZoneRefs?.slice(-1)?.[0];
  const fromFareZone = firstZone
    ? findReferenceDataById(fareZones, firstZone)
    : undefined;
  const toFareZone = lastZone
    ? findReferenceDataById(fareZones, lastZone)
    : undefined;
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    productRef,
  );
  const userProfilesWithCount = mapToUserProfilesWithCount(
    fareContract.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const baggageProducts = fareContract.travelRights
    .map((tr) =>
      findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
    )
    .filter(isDefined)
    .filter((p) => p.isBaggageProduct);

  const baggeProductsWithCount = arrayMapUniqueWithCount(
    baggageProducts,
    (a, b) => a.id === b.id,
  );

  const flattenedAccesses = getAccesses(fareContract);
  if (flattenedAccesses) {
    const {usedAccesses} = flattenedAccesses;
    const {validTo: usedAccessValidTo} = getLastUsedAccess(now, usedAccesses);
    if (usedAccessValidTo) validTo = usedAccessValidTo;
  }

  return {
    preassignedFareProduct: preassignedFareProduct,
    fromFareZone: fromFareZone,
    toFareZone: toFareZone,
    userProfilesWithCount,
    baggeProductsWithCount,
    status: validityStatus,
    now: now,
    validTo: validTo,
    fareContract,
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
    rowGap: theme.spacing.medium,
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    rowGap: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
}));
