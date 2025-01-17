import {useMutation} from '@tanstack/react-query';
import {sendSupportRequest} from '@atb/api/mobility';
import {SendSupportRequestBody} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const useSendSupportRequestMutation = (operatorId: string) => {
  const acceptLanguage = useAcceptLanguage();

  return useMutation({
    mutationFn: (reqBody: SendSupportRequestBody) =>
      sendSupportRequest(reqBody, acceptLanguage, operatorId),
  });
};
