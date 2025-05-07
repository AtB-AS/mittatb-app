import {
  findReferenceDataById,
  PreassignedFareProduct,
  TariffZone,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {getLastUsedAccess} from '@atb/ticketing';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {
  getValidityStatus,
  isValidFareContract,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
  useTariffZoneSummary,
  ValidityStatus,
} from '../utils';
import {FareContractDetailItem} from '../components/FareContractDetailItem';
import {InspectionSymbol} from '../components/InspectionSymbol';
import {UserProfileWithCount} from '../types';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {getAccesses} from '@atb-as/utils';
import {isDefined} from '@atb/utils/presence';

export type FareContractInfoProps = {
  status: ValidityStatus;
  testID?: string;
  preassignedFareProduct?: PreassignedFareProduct;
  sentToCustomerAccountId?: string;
};

export type FareContractInfoDetailsProps = {
  fareContract: FareContractType;
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  userProfilesWithCount: UserProfileWithCount[];
  status: FareContractInfoProps['status'];
  testID?: string;
  now?: number;
  validTo?: number;
  fareProductType?: string;
};

export const FareContractInfoDetailsSectionItem = ({
  fareContract,
  preassignedFareProduct,
  fromTariffZone,
  toTariffZone,
  userProfilesWithCount,
  status,
  ...props
}: SectionItemProps<FareContractInfoDetailsProps>) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {topContainer} = useSectionItem(props);

  const tariffZoneSummary = useTariffZoneSummary(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
  );

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const firstTravelRight = fareContract.travelRights[0];

  const isStatusSent = status === 'sent';

  const isValidOrSentFareContract: boolean =
    isValidFareContract(status) || isStatusSent;

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
              content={userProfilesWithCount.map((u) =>
                userProfileCountAndName(u, language),
              )}
            />
          )}
          {tariffZoneSummary && (
            <FareContractDetailItem
              header={t(FareContractTexts.label.zone)}
              content={[tariffZoneSummary]}
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
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
): FareContractInfoDetailsProps => {
  const {
    endDateTime,
    fareProductRef: productRef,
    tariffZoneRefs,
  } = fareContract.travelRights[0];
  let validTo = endDateTime.getTime();
  const validityStatus = getValidityStatus(now, fareContract);

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
    fareContract.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const flattenedAccesses = getAccesses(fareContract);
  if (flattenedAccesses) {
    const {usedAccesses} = flattenedAccesses;
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
