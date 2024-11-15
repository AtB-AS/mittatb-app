import {useMutation} from '@tanstack/react-query';
import {sendStopSignal} from '@atb/api/stop-signal';

export const useStopSignalMutation = ({onSuccess}: {onSuccess: () => void}) =>
  useMutation({
    mutationFn: sendStopSignal,
    onSuccess,
  });
