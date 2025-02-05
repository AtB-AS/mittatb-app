import React from 'react';
import {FareContract, isSentOrReceivedFareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useAuthContext} from '@atb/auth';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {Description} from '@atb/fare-contracts/components/FareContractDescription';
import {ValidTo} from '@atb/fare-contracts/components/ValidTo';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {WithValidityLine} from '@atb/fare-contracts/components/WithValidityLine';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {ValidityTime} from '@atb/fare-contracts/components/ValidityTime';

type Props = {
  fareContract: FareContract;
};

export const FareContractHeaderSectionItem = ({
  fareContract: fc,
  ...props
}: SectionItemProps<Props>) => {
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {topContainer} = useSectionItem(props);

  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(fc.customerAccountId);
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;

  return (
    <View style={[topContainer, {paddingVertical: 0}]}>
      <WithValidityLine fc={fc}>
        <ProductName fc={fc} />
        <ValidityTime fc={fc} />
        <ValidTo fc={fc} />
        <Description fc={fc} />
      </WithValidityLine>
      <View style={styles.fareContractDetails}>
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
        <FareContractFromTo
          backgroundColor={theme.color.background.neutral['0']}
          mode="large"
          fc={fc}
        />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    flex: 1,
    rowGap: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  fareContractDetails: {
    flex: 1,
    paddingBottom: theme.spacing.large,
    rowGap: theme.spacing.medium,
  },
  enlargedWhiteBarcodePaddingView: {
    backgroundColor: '#ffffff',
    paddingVertical: theme.spacing.xLarge * 2,
  },
}));
