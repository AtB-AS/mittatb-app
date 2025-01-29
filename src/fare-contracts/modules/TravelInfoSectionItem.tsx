import {MessageInfoBox} from '@atb/components/message-info-box';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useAuthContext} from '@atb/auth';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {
  type FareContract,
  hasTravelRightAccesses,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {View} from 'react-native';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {FareContractDetailItem} from '@atb/fare-contracts/components/FareContractDetailItem';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
} from '@atb/fare-contracts/utils';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {useTimeContext} from '@atb/time';
import {useSectionItem} from '@atb/components/sections';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';

type Props = {fc: FareContract};

export const TravelInfoSectionItem = ({fc}: Props) => {
  // TRANSLATION
  const {t, language} = useTranslation();

  // DATA
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(fc.customerAccountId);
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const {
    travelRights,
    validityStatus,
    numberOfUsedAccesses,
    maximumNumberOfAccesses,
  } = getFareContractInfo(serverNow, fc, currentUserId);
  const firstTravelRight = travelRights[0];
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;
  const {userProfiles, fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfigurationContext();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const fareProductTypeConfig = fareProductTypeConfigs.find((c) => {
    return c.type === preassignedFareProduct?.type;
  });

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  // STYLE
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {topContainer} = useSectionItem({});

  // LOGIC
  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  return (
    <View
      style={[
        topContainer,
        {rowGap: theme.spacing.large, paddingVertical: theme.spacing.large},
      ]}
    >
      <View style={styles.detailRow}>
        <View style={styles.fareContractDetailItems}>
          <FareContractFromTo
            fc={fc}
            preassignedFareProduct={preassignedFareProduct}
            backgroundColor={theme.color.background.neutral[0]}
            mode="small"
          />
          {!!fareProductTypeConfig?.transportModes && (
            <FareContractDetailItem
              content={[
                getTransportModeText(fareProductTypeConfig.transportModes, t),
              ]}
            />
          )}

          {userProfilesWithCount.map((u, i) => (
            <FareContractDetailItem
              key={`userProfile-${i}`}
              content={[userProfileCountAndName(u, language)]}
            />
          ))}
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
          />
        )}
      </View>

      {isSent && !!phoneNumber && (
        <MessageInfoBox
          type="warning"
          message={t(
            FareContractTexts.details.sentTo(
              recipientName || formatPhoneNumber(phoneNumber),
            ),
          )}
        />
      )}

      {!!hasTravelRightAccesses(fc.travelRights) && (
        <CarnetFooter
          active={validityStatus === 'valid'}
          maximumNumberOfAccesses={maximumNumberOfAccesses!}
          numberOfUsedAccesses={numberOfUsedAccesses!}
        />
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: theme.spacing.small,
  },
  fareContractDetailItems: {
    flex: 1,
    rowGap: theme.spacing.xSmall,
  },
}));
