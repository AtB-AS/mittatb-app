import {useMutation} from '@tanstack/react-query';
import {sendSupportRequest} from '@atb/api/mobility';
import {SendSupportRequestBody, SupportResponse} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const useSendSupportRequestMutation = (
  operatorId: string,
  /* Handed the response so a caller sending several damages can tell a complete
     report from one that stopped part way. The support form ignores it. */
  onSuccessCallback: (response: SupportResponse) => void,
) => {
  const acceptLanguage = useAcceptLanguage();

  const res = useMutation({
    mutationFn: (reqBody: SendSupportRequestBody) =>
      sendSupportRequest(reqBody, acceptLanguage, operatorId),
    onSuccess: onSuccessCallback,
  });

  return res;
};
