import {useMutation} from '@tanstack/react-query';
import {sendStopSignal} from '@atb/api/journey';

export const useStopSignalMutation = ({onSuccess}: {onSuccess: () => void}) =>
  useMutation({
    mutationFn: sendStopSignal,
    onSuccess,
  });
