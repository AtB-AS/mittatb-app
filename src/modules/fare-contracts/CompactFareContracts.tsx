import {Button} from '@atb/components/button';
import {
  FareZone,
  findReferenceDataById,
  PreassignedFareProduct,
  SupplementProduct,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {
  CompactFareContractInfo,
  getValidityStatus,
} from '@atb/modules/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  DashboardTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useTimeContext} from '@atb/modules/time';
import {ContentHeading} from '@atb/components/heading';
import {
  useFareContracts,
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
} from '@atb/modules/ticketing';
import {FareContractInfoDetailsProps} from './sections/FareContractInfoDetailsSectionItem';
import {FareContractType, getAccesses} from '@atb-as/utils/lib/fare-contract';
import {isDefined} from '@atb/utils/presence';
import {mapToUserProfilesWithCount} from './utils';
import {arrayMapUniqueWithCount} from '@atb/utils/array-map-unique-with-count';
import {getBaggageProducts} from './get-baggage-products';
import {getLastUsedAccess} from '@atb/modules/ticketing';

type Props = {
  onPressDetails: (fareContractId: string) => void;
  onPressBuy: () => void;
  style?: ViewStyle;
};

export const CompactFareContracts: React.FC<Props> = ({
  onPressDetails,
  onPressBuy,
  style,
}) => {
  const itemStyle = useStyles();

  const {serverNow} = useTimeContext();
  const {fareContracts: validFareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );

  const {t} = useTranslation();
  const {fareZones, userProfiles} = useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: supplementProducts} = useGetSupplementProductsQuery();

  return (
    <View style={[style, itemStyle.container]}>
      <ContentHeading text={t(TicketingTexts.header.title)} />
      {validFareContracts.length == 0 ? (
        <Button
          expanded={true}
          text={t(DashboardTexts.buyButton)}
          onPress={onPressBuy}
          testID="buyTicketsButton"
        />
      ) : (
        <View style={itemStyle.fareContracts}>
          {validFareContracts.map((fareContract, index) => {
            const fareContractInfoDetailsProps = getFareContractInfoDetails(
              fareContract,
              serverNow,
              fareZones,
              userProfiles,
              preassignedFareProducts,
              supplementProducts,
            );
            return (
              <CompactFareContractInfo
                key={fareContract.id}
                {...fareContractInfoDetailsProps}
                now={serverNow}
                onPressDetails={() => onPressDetails(fareContract.id)}
                testID={'fareContract' + index}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export const getFareContractInfoDetails = (
  fareContract: FareContractType,
  now: number,
  fareZones: FareZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
  supplementProducts: SupplementProduct[],
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

  const productsInFareContract = fareContract.travelRights
    .map((tr) =>
      findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
    )
    .filter(isDefined);

  const baggageProducts = getBaggageProducts(
    productsInFareContract,
    supplementProducts,
  );

  const baggageProductsWithCount = arrayMapUniqueWithCount(
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
    baggageProductsWithCount,
    status: validityStatus,
    now: now,
    validTo: validTo,
    fareContract,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
  fareContracts: {
    rowGap: theme.spacing.medium,
  },
}));
