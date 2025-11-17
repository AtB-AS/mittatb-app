import {MessageInfoBox} from '@atb/components/message-info-box';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {useAuthContext} from '@atb/modules/auth';
import {
  useGetPhoneByAccountIdQuery,
  useFetchOnBehalfOfAccountsQuery,
} from '@atb/modules/on-behalf-of';
import {FareContractInfo} from '../use-fare-contract-info';

export const SentToMessageBox = ({fc}: {fc: FareContractInfo}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {t} = useTranslation();
  const isSent = fc.isSentOrReceived && fc.customerAccountId !== currentUserId;
  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(
    isSent ? fc.customerAccountId : undefined,
  );
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });

  if (!isSent || !phoneNumber) return null;

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
