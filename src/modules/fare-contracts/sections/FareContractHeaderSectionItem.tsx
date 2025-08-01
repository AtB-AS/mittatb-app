import React from 'react';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  useGetPhoneByAccountIdQuery,
  useFetchOnBehalfOfAccountsQuery,
} from '@atb/modules/on-behalf-of';
import {useAuthContext} from '@atb/modules/auth';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {FareContractFromTo} from '../components/FareContractFromTo';
import {Description} from '../components/FareContractDescription';
import {ValidTo} from '../components/ValidTo';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {isSentOrReceivedFareContract} from '@atb/modules/ticketing';
import {WithValidityLine} from '../components/WithValidityLine';
import {ProductName} from '../components/ProductName';
import {ValidityTime} from '../components/ValidityTime';

type Props = {
  fareContract: FareContractType;
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

  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(
    isSent ? fc.purchasedBy : undefined,
  );
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;

  return (
    <View style={[topContainer, styles.sectionItemOverrides]}>
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
  sectionItemOverrides: {
    borderWidth: 0,
    paddingVertical: 0,
  },
  fareContractDetails: {
    flex: 1,
    paddingBottom: theme.spacing.large,
    rowGap: theme.spacing.medium,
  },
}));
