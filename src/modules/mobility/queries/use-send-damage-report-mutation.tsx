import {useMutation} from '@tanstack/react-query';
import {sendSupportRequest} from '@atb/api/mobility';
import {SendSupportRequestBody} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';

export const useSendDamageReportMutation = (
  operatorId: string,
  onAllSent: () => void,
) => {
  const acceptLanguage = useAcceptLanguage();

  return useMutation({
    mutationFn: async (reqBodies: SendSupportRequestBody[]) => {
      for (let i = 0; i < reqBodies.length; i++) {
        try {
          await sendSupportRequest(reqBodies[i], acceptLanguage, operatorId);
        } catch {
          return reqBodies.slice(i);
        }
      }
      return [];
    },
    onSuccess: (unsent) => {
      if (unsent.length === 0) onAllSent();
    },
  });
};
