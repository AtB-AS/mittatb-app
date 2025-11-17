import {
  PreassignedFareProduct,
  FareZone,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {getLastUsedAccess} from '@atb/modules/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {
  isValidFareContract,
  useFareZoneSummary,
  ValidityStatus,
} from '../utils';
import {FareContractDetailItem} from '../components/FareContractDetailItem';
import {InspectionSymbol} from '../components/InspectionSymbol';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {
  arrayMapUniqueWithCount,
  toCountAndName,
  UniqueWithCount,
} from '@atb/utils/array-map-unique-with-count';
import {FareContractInfo} from '../use-fare-contract-info';

export type FareContractInfoProps = {
  status: ValidityStatus;
  testID?: string;
  preassignedFareProduct?: PreassignedFareProduct;
  sentToCustomerAccountId?: string;
};

export type FareContractInfoDetailsProps = {
  fareContract: FareContractInfo;
  preassignedFareProduct?: PreassignedFareProduct;
  fromFareZone?: FareZone;
  toFareZone?: FareZone;
  userProfilesWithCount: UniqueWithCount<UserProfile>[];
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
  const firstTravelRight = fareContract.mostSignificantTicket;

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
                toCountAndName(u, language),
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
            fareContractInfo={fareContract}
            sentTicket={isStatusSent}
          />
        )}
      </View>
    </View>
  );
};

export const getFareContractInfoDetails = (
  fareContract: FareContractInfo,
  now: number,
): FareContractInfoDetailsProps => {
  const {validityStatus, validTo} = fareContract.getValidityInfo(now);

  let validToComputed = validTo;

  const fromFareZone = fareContract.allFareZones?.[0];
  const toFareZone = fareContract.allFareZones?.slice(-1)?.[0];

  const userProfilesWithCount = arrayMapUniqueWithCount(
    fareContract.allUserProfiles,
    (a, b) => a.id === b.id,
  );

  const flattenedAccesses = fareContract.accesses;
  if (flattenedAccesses) {
    const {usedAccesses} = flattenedAccesses;
    const {validTo: usedAccessValidTo} = getLastUsedAccess(now, usedAccesses);
    if (usedAccessValidTo) validToComputed = usedAccessValidTo;
  }

  return {
    fromFareZone: fromFareZone,
    toFareZone: toFareZone,
    userProfilesWithCount: userProfilesWithCount,
    status: validityStatus,
    now: now,
    validTo: validToComputed,
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
