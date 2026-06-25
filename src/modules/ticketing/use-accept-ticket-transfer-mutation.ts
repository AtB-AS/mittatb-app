import {useMutation, useQueryClient} from '@tanstack/react-query';
import {acceptTicketTransfer} from './api';
import {invalidateFareContractsQuery} from './use-fare-contracts';

export const useAcceptTicketTransferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transferId: string) => acceptTicketTransfer(transferId),
    onSuccess: () => invalidateFareContractsQuery(queryClient),
  });
};
