import {MessageInfoBox} from '@atb/components/message-info-box';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useAuthContext} from '@atb/modules/auth';
import {
  useGetPhoneByAccountIdQuery,
  useFetchOnBehalfOfAccountsQuery,
} from '@atb/modules/on-behalf-of';
import {
  isSentOrReceivedFareContract,
  useGetFareProductsQuery,
} from '@atb/modules/ticketing';
import {getAccesses, type FareContractType} from '@atb-as/utils';
import {View} from 'react-native';
import {FareContractFromTo} from './FareContractFromTo';
import {FareContractDetailItem} from './FareContractDetailItem';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
} from '../utils';
import {InspectionSymbol} from './InspectionSymbol';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useTimeContext} from '@atb/modules/time';
import {useSectionItem} from '@atb/components/sections';
import {
  CarnetFooter,
  MAX_ACCESSES_FOR_CARNET_FOOTER,
} from '../carnet/CarnetFooter';
import {isDefined} from '@atb/utils/presence';

type Props = {fc: FareContractType};

export const TravelInfoSectionItem = ({fc}: Props) => {
  const {t, language} = useTranslation();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {validityStatus, numberOfUsedAccesses, maximumNumberOfAccesses} =
    getFareContractInfo(serverNow, fc, currentUserId);
  const firstTravelRight = fc.travelRights[0];
  const {userProfiles, fareProductTypeConfigs} =
    useFirestoreConfigurationContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );
  const fareProductTypeConfig = fareProductTypeConfigs.find((c) => {
    return c.type === preassignedFareProduct?.type;
  });

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const styles = useStyles();
  const {theme} = useThemeContext();
  const {topContainer} = useSectionItem({});

  const accesses = getAccesses(fc);
  const shouldShowCarnetFooter =
    accesses &&
    accesses.maximumNumberOfAccesses <= MAX_ACCESSES_FOR_CARNET_FOOTER;

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

          {firstTravelRight.travelerName ? (
            <FareContractDetailItem content={[firstTravelRight.travelerName]} />
          ) : (
            userProfilesWithCount.map((u, i) => (
              <FareContractDetailItem
                key={`userProfile-${i}`}
                content={[userProfileCountAndName(u, language)]}
              />
            ))
          )}
        </View>
        {(validityStatus === 'valid' || validityStatus === 'sent') && (
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
          />
        )}
      </View>

      <SentToPhoneNumberMessageBox fc={fc} />

      {shouldShowCarnetFooter && (
        <CarnetFooter
          active={validityStatus === 'valid'}
          maximumNumberOfAccesses={maximumNumberOfAccesses!}
          numberOfUsedAccesses={numberOfUsedAccesses!}
        />
      )}
    </View>
  );
};

const SentToPhoneNumberMessageBox = ({fc}: {fc: FareContractType}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {t} = useTranslation();
  const isSent =
    isSentOrReceivedFareContract(fc) && fc.customerAccountId !== currentUserId;
  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(
    isSent ? fc.customerAccountId : undefined,
  );
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });

  if (!isSent) return null;
  if (!phoneNumber) return null;

  const recipientName = onBehalfOfAccounts?.find(
    (a) => a.phoneNumber === phoneNumber,
  )?.name;

  return (
    <MessageInfoBox
      type="warning"
      message={t(
        FareContractTexts.details.sentTo(
          recipientName || formatPhoneNumber(phoneNumber),
        ),
      )}
    />
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
