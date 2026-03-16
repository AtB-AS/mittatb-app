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
  ShmoBookingState,
  ShmoBookingEventType,
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

// export const sendShmoBookingEvent = (
//   bookingId: ShmoBooking['bookingId'],
//   shmoBookingEvent: ShmoBookingEvent,
//   acceptLanguage: string,
// ): Promise<ShmoBooking> => {
//   return client
//     .post<ShmoBooking>(
//       `/mobility/v1/bookings/${bookingId}/event`,
//       shmoBookingEvent,
//       {
//         authWithIdToken: true,
//         headers: {'Accept-Language': acceptLanguage},
//       },
//     )
//     .then((response) => ShmoBookingSchema.parse(response.data));
// };

export const sendShmoBookingEvent = (
  bookingId: ShmoBooking['bookingId'],
  shmoBookingEvent: ShmoBookingEvent,
  finishImmediately: boolean,
  acceptLanguage: string,
): Promise<ShmoBooking> => {
  const isStartFinishing =
    shmoBookingEvent.event === ShmoBookingEventType.START_FINISHING;

  const eventToSend =
    finishImmediately && isStartFinishing
      ? {
          event: ShmoBookingEventType.FINISH,
          fileName: 'evidence.png',
          fileType: 'image/png',
          fileData:
            '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',
        }
      : shmoBookingEvent;

  return client
    .post<ShmoBooking>(
      `/mobility/v1/bookings/${bookingId}/event`,
      eventToSend,
      {
        authWithIdToken: true,
        headers: {'Accept-Language': acceptLanguage},
      },
    )
    .then((response) => {
      let data = response.data;

      if (finishImmediately && isStartFinishing) {
        data = {
          ...data,
          state: ShmoBookingState.FINISHING,
          arrivalTime: new Date(),
        };
      }

      return ShmoBookingSchema.parse(data);
    });
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
