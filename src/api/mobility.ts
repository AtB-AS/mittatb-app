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

  export const getOperatorsEntur = (
  opts?: AxiosRequestConfig,
): Promise<OperatorsResponse> => 
  client.get<OperatorsResponse>('/mobility/v1/operators', {
      ...opts,
      authWithIdToken: true,
  }).then((response) => OperatorsResponseSchema.parse(response.data))