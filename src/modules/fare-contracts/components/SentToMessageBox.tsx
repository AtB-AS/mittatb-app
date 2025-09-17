import {MessageInfoBox} from '@atb/components/message-info-box';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useAuthContext} from '@atb/modules/auth';
import {
  useGetPhoneByAccountIdQuery,
  useFetchOnBehalfOfAccountsQuery,
} from '@atb/modules/on-behalf-of';
import {isSentOrReceivedFareContract} from '@atb/modules/ticketing';
import type {FareContractType} from '@atb-as/utils';

export const SentToPhoneNumberMessageBox = ({fc}: {fc: FareContractType}) => {
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
      type="info"
      message={t(
        FareContractTexts.details.sentTo(
          recipientName || formatPhoneNumber(phoneNumber),
        ),
      )}
    />
  );
};
