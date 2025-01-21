import {MessageInfoBox} from '@atb/components/message-info-box';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useAuthContext} from '@atb/auth';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {type FareContract, isSentOrReceivedFareContract} from '@atb/ticketing';
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
  const {travelRights, validityStatus} = getFareContractInfo(
    serverNow,
    fc,
    currentUserId,
  );
  const firstTravelRight = travelRights[0];
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;
  const {userProfiles, fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
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
    <View style={topContainer}>
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
      <View style={styles.detailRow}>
        <View style={styles.fareContractDetailItems}>
          <FareContractFromTo
            fc={fc}
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

          <FareContractDetailItem
            content={userProfilesWithCount.map((u) =>
              userProfileCountAndName(u, language),
            )}
          />
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
          />
        )}
      </View>
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
