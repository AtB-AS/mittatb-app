import {ErrorResponse} from '@atb-as/utils';
import {getAssetFromQrCode} from '@atb/api/mobility';
import {
  AssetFromQrCodeQuery,
  AssetFromQrCodeResponse,
} from '@atb/api/types/mobility';
import {useAcceptLanguage} from '@atb/api/use-accept-language';
import {useMutation} from '@tanstack/react-query';

export const useGetAssetFromQrCodeMutation = () => {
  const acceptLanguage = useAcceptLanguage();
  return useMutation<
    AssetFromQrCodeResponse,
    ErrorResponse,
    AssetFromQrCodeQuery
  >({
    mutationFn: (assetFromQrCodeQuery: AssetFromQrCodeQuery) =>
      getAssetFromQrCode(assetFromQrCodeQuery, acceptLanguage),
  });
};
