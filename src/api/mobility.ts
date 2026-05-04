import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {
  AssetSchema,
  AssetFromQrCodeQuery,
  AssetFromQrCodeResponse,
  InitShmoOneStopBookingRequestBody,
  SendSupportRequestBody,
  ShmoBooking,
  ShmoBookingEvent,
  ShmoBookingSchema,
  OperatorsResponse,
  OperatorsResponseSchema,
  VehiclesRequestBody,
  VehicleSchema,
  Vehicle,
  StationSchema,
  Station,
  ViolationsReportingInitQuery,
  ViolationsReportingInitQueryResult,
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
  ViolationsReportQuery,
  ViolationsReportQueryResult,
} from './types/mobility';

export const getActiveShmoBooking = (
  acceptLanguage: string,
  opts?: AxiosRequestConfig,
): Promise<ShmoBooking | null> => {
  return client
    .get<ShmoBooking | null>('/mobility/v1/bookings/active', {
      ...opts,
      authWithIdToken: true,
      headers: {'Accept-Language': acceptLanguage},
    })
    .then((response) =>
      response.data === null ? null : ShmoBookingSchema.parse(response.data),
    );
};

export const getShmoBooking = (
  bookingId: ShmoBooking['bookingId'],
  acceptLanguage: string,
  opts?: AxiosRequestConfig,
): Promise<ShmoBooking> => {
  return client
    .get<ShmoBooking>(`/mobility/v1/bookings/${bookingId}`, {
      ...opts,
      authWithIdToken: true,
      headers: {'Accept-Language': acceptLanguage},
    })
    .then((response) => ShmoBookingSchema.parse(response.data));
};

export const initShmoOneStopBooking = (
  reqBody: InitShmoOneStopBookingRequestBody,
  acceptLanguage: string,
): Promise<ShmoBooking> => {
  return client
    .post<ShmoBooking>('/mobility/v1/bookings/one-stop', reqBody, {
      authWithIdToken: true,
      headers: {'Accept-Language': acceptLanguage},
    })
    .then((response) => ShmoBookingSchema.parse(response.data));
};

export const sendShmoBookingEvent = (
  bookingId: ShmoBooking['bookingId'],
  shmoBookingEvent: ShmoBookingEvent,
  acceptLanguage: string,
): Promise<ShmoBooking> => {
  return client
    .post<ShmoBooking>(
      `/mobility/v1/bookings/${bookingId}/event`,
      shmoBookingEvent,
      {
        authWithIdToken: true,
        headers: {'Accept-Language': acceptLanguage},
      },
    )
    .then((response) => ShmoBookingSchema.parse(response.data));
};

export const getAssetFromQrCode = (
  params: AssetFromQrCodeQuery,
  acceptLanguage: string,
  opts?: AxiosRequestConfig,
): Promise<AssetFromQrCodeResponse> => {
  params;
  const url = '/mobility/v1/asset/qr';
  const query = qs.stringify(params);
  return client
    .get<AssetFromQrCodeResponse>(stringifyUrl(url, query), {
      ...opts,
      authWithIdToken: true,
      headers: {'Accept-Language': acceptLanguage},
    })
    .then((response) => AssetSchema.parse(response.data));
};

export const sendSupportRequest = (
  reqBody: SendSupportRequestBody,
  acceptLanguage: string,
  operatorId: string,
) =>
  client.post('/mobility/v1/support', reqBody, {
    authWithIdToken: true,
    headers: {
      'Accept-Language': acceptLanguage,
      'Operator-Id': operatorId,
    },
  });

export const getOperators = (
  opts?: AxiosRequestConfig,
): Promise<OperatorsResponse> =>
  client
    .get<OperatorsResponse>('/mobility/v1/operators', {
      ...opts,
    })
    .then((response) => OperatorsResponseSchema.parse(response.data));

type VehicleRequestOpts = Pick<AxiosRequestConfig, 'signal'>;

export const getVehicles = (
  reqBody?: VehiclesRequestBody,
  opts?: AxiosRequestConfig,
): Promise<Vehicle[]> => {
  const filteredParams = Object.fromEntries(
    Object.entries(reqBody || {}).filter(
      ([_, v]) => v !== undefined && v !== null,
    ),
  );
  const url = `/mobility/v1/vehicles`;
  return client
    .get(url, {
      params: filteredParams,
      ...opts,
    })
    .then((response) => VehicleSchema.array().parse(response.data));
};

export const getVehicle = (
  id?: string,
  opts?: VehicleRequestOpts,
): Promise<Vehicle | null> => {
  if (!id || id === '') return Promise.resolve(null);
  return client
    .get(`/mobility/v1/vehicles/${id}`, {
      ...opts,
    })
    .then((response) => {
      const result = VehicleSchema.safeParse(response.data);
      if (!result.success) {
        console.error(result.error.format());
        throw result.error;
      }
      return result.data;
    });
};

export const getStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<Station | null> => {
  return client
    .get<Station>(`/mobility/v1/stations/${id}`, opts)
    .then((res) => StationSchema.parse(res.data))
    .catch((error) => {
      console.error('Error in StationSchema parsing: ', error);
      return null;
    });
};

export const initViolationsReporting = (
  params: ViolationsReportingInitQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsReportingInitQueryResult> => {
  const query = qs.stringify(params);
  return client
    .get<ViolationsReportingInitQueryResult>(
      stringifyUrl('/mobility/v1/violations-reporting/init', query),
      opts,
    )
    .then((res) => res.data);
};

export const lookupVehicleByQr = (
  params: ViolationsVehicleLookupQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsVehicleLookupQueryResult> => {
  const query = qs.stringify(params);
  return client
    .get<ViolationsVehicleLookupQueryResult>(
      stringifyUrl('/mobility/v1/violations-reporting/vehicle', query),
      opts,
    )
    .then((res) => res.data);
};

export const sendViolationsReport = (
  data: ViolationsReportQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsReportQueryResult> => {
  return client
    .post<ViolationsReportQueryResult>(
      '/mobility/v1/violations-reporting/report',
      data,
      opts,
    )
    .then((res) => res.data);
};
