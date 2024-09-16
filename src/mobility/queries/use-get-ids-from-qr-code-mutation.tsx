import {getIdsFromQrCode} from '@atb/api/mobility';
import {IdsFromQrCodeQuery} from '@atb/api/types/mobility';
import {useMutation} from '@tanstack/react-query';

export const useGetIdsFromQrCodeMutation = () => {
  return useMutation({
    mutationFn: (idsFromQrCodeQuery: IdsFromQrCodeQuery) =>
      getIdsFromQrCode(idsFromQrCodeQuery),
  });
};
