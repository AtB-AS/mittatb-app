import {getIdsFromQrCode} from '@atb/api/mobility';
import {IdsFromQrCodeQuery} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useMutation} from '@tanstack/react-query';

export const useGetIdsFromQrCodeMutation = () => {
  const acceptLanguage = useAcceptLanguage();
  return useMutation({
    mutationFn: (idsFromQrCodeQuery: IdsFromQrCodeQuery) =>
      getIdsFromQrCode(idsFromQrCodeQuery, acceptLanguage),
  });
};
