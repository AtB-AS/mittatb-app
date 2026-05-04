import {ErrorResponse} from '@atb-as/utils';
import {lookupVehicleByQr} from '@atb/api/mobility';
import {
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
} from '@atb/api/types/mobility';
import {useMutation} from '@tanstack/react-query';

export const useLookupVehicleByQrMutation = () =>
  useMutation<
    ViolationsVehicleLookupQueryResult,
    ErrorResponse,
    ViolationsVehicleLookupQuery
  >({
    mutationFn: (params) => lookupVehicleByQr(params),
  });
