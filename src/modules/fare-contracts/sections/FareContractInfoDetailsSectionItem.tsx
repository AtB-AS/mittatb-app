import {
  PreassignedFareProduct,
  SupplementProduct,
  FareZone,
  useFirestoreConfigurationContext,
  UserProfile,
} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {FareContractType} from '@atb-as/utils';
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
  toCountAndReferenceDataName,
  UniqueWithCount,
} from '@atb/utils/unique-with-count';

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
  baggageProductsWithCount: UniqueWithCount<SupplementProduct>[];
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
  baggageProductsWithCount,
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
                .map((u) => toCountAndReferenceDataName(u, language))
                .concat(
                  baggageProductsWithCount.map((p) =>
                    toCountAndReferenceDataName(p, language),
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
