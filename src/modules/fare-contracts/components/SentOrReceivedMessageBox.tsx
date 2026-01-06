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

export const SentOrReceivedMessageBox = ({fc}: {fc: FareContractType}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {t} = useTranslation();
  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;

  const displayUserId = isSent ? fc.customerAccountId : fc.purchasedBy;

  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(displayUserId);
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });

  if (!isSentOrReceived || !phoneNumber) return null;

  const name = onBehalfOfAccounts?.find(
    (a) => a.phoneNumber === phoneNumber,
  )?.name;

  return (
    <MessageInfoBox
      type="info"
      message={
        isSent
          ? t(
              FareContractTexts.details.sentTo(
                name || formatPhoneNumber(phoneNumber),
              ),
            )
          : t(
              FareContractTexts.details.receivedFrom(
                name || formatPhoneNumber(phoneNumber),
              ),
            )
      }
    />
  );
};
