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
  getLastUsedAccess,
  isCarnet,
  isCarnetTravelRight,
  NormalTravelRight,
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
import {FareContractDetailItem} from './components/FareContractDetailItem';
import {InspectionSymbol} from '../fare-contracts/components/InspectionSymbol';
import {UserProfileWithCount} from './types';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';

export type FareContractInfoProps = {
  status: ValidityStatus;
  testID?: string;
  preassignedFareProduct?: PreassignedFareProduct;
  sentToCustomerAccountId?: string;
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
  status,
  testID,
  preassignedFareProduct,
  sentToCustomerAccountId,
}: FareContractInfoProps) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;
  const productDescription = preassignedFareProduct
    ? getTextForLanguage(preassignedFareProduct.description, language)
    : undefined;
  const warning = useNonInspectableTokenWarning();

  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(
    sentToCustomerAccountId,
  );

  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;

  return (
    <View style={styles.header}>
      {productName && (
        <ThemeText
          typography="body__primary--bold"
          accessibilityLabel={productName + screenReaderPause}
          testID={testID + 'Product'}
        >
          {productName}
        </ThemeText>
      )}
      {productDescription && (
        <ThemeText
          typography="body__secondary"
          accessibilityLabel={productDescription + screenReaderPause}
          testID={testID + 'ProductDescription'}
        >
          {productDescription}
        </ThemeText>
      )}
      {phoneNumber && (
        <MessageInfoText
          type="warning"
          message={t(
            FareContractTexts.details.sentTo(
              recipientName || formatPhoneNumber(phoneNumber),
            ),
          )}
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

  const isStatusSent = status === 'sent';

  const isValidOrSentFareContract: boolean =
    isValidFareContract(status) || isStatusSent;

  return (
    <View style={styles.container} accessible={true}>
      <View style={styles.fareContractDetails}>
        <View style={styles.details}>
          <FareContractDetailItem
            header={t(FareContractTexts.label.travellers)}
            content={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, language),
            )}
          />
          {tariffZoneSummary && (
            <FareContractDetailItem
              header={t(FareContractTexts.label.zone)}
              content={[tariffZoneSummary]}
            />
          )}
        </View>
        {isValidOrSentFareContract && (
          <InspectionSymbol {...props} sentTicket={isStatusSent} />
        )}
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
    endDateTime,
    fareProductRef: productRef,
    tariffZoneRefs,
  } = firstTravelRight;
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
    rowGap: theme.spacing.medium,
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    rowGap: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
}));
