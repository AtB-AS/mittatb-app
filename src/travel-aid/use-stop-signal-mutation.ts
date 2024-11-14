import {useMutation} from '@tanstack/react-query';
import {
  sendStopSignal,
  type SendStopSignalRequestType,
} from '@atb/api/stop-signal';

export const useStopSignalMutation = () =>
  useMutation({
    mutationFn: async (req: SendStopSignalRequestType): Promise<void> => {
      await sendStopSignal(req);
      return Promise.resolve();
    },
  });
