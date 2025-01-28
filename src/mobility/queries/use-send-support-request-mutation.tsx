import {useMutation} from '@tanstack/react-query';
import {sendSupportRequest} from '@atb/api/mobility';
import {SendSupportRequestBody} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useEffect} from 'react';

export const useSendSupportRequestMutation = (
  operatorId: string,
  onSuccessCallback: () => void,
) => {
  const acceptLanguage = useAcceptLanguage();

  const res = useMutation({
    mutationFn: (reqBody: SendSupportRequestBody) =>
      sendSupportRequest(reqBody, acceptLanguage, operatorId),
  });

  useEffect(() => {
    if (res.status === 'success' && onSuccessCallback) {
      onSuccessCallback();
    }
  }, [res.status, res.data, onSuccessCallback]);

  return res;
};
