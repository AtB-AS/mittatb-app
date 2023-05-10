import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {WS_API_BASE_URL} from '@env';
import {GetServiceJourneyVehicles} from './types/vehicles';
import Bugsnag from '@bugsnag/react-native';

const WEBSOCKET_BASE_URL = WS_API_BASE_URL;

export const getServiceJourneyVehicles = async (
  serviceJourneyIds?: string[],
  opts?: AxiosRequestConfig,
): Promise<GetServiceJourneyVehicles | undefined> => {
  if (!serviceJourneyIds?.length) {
    return;
  }
  const url = '/bff/v2/vehicles/service-journeys';
  const query = qs.stringify({
    serviceJourneyIds,
  });
  const result = await client.get<GetServiceJourneyVehicles>(
    stringifyUrl(url, query),
    {
      ...opts,
    },
  );

  return result.data;
};

export const getLiveVehicleSubscription = async (
  serviceJourneyId: string,
): Promise<WebSocket | undefined> => {
  const url = `${WEBSOCKET_BASE_URL}ws/v2/vehicles/service-journey/subscription`;
  const query = qs.stringify({serviceJourneyId});
  const ws = new WebSocket(stringifyUrl(url, query));
  try {
    const openConnection = await waitForOpenWebSocket(ws);
    return openConnection;
  } catch (e) {
    console.error('Error on opening connection: ' + JSON.stringify(e));
  }
};

function waitForOpenWebSocket(socket: WebSocket) {
  return new Promise<WebSocket>((resolve, reject) => {
    const maxNumberOfAttempts = 20;
    const intervalTime = 100; //ms

    let currentAttempt = 0;
    const interval = setInterval(() => {
      // States:
      // 0 = CONNECTING Socket has been created. The connection is not yet open.
      // 1 = OPEN       The connection is open and ready to communicate.
      // 2 = CLOSING    The connection is in the process of closing.
      // 3 = CLOSED     The connection is closed or couldn't be opened.

      if (socket.readyState !== 0) {
        clearInterval(interval);
        Bugsnag.leaveBreadcrumb(
          `WebSocket readyState=${socket.readyState} after ${
            currentAttempt * intervalTime
          }ms`,
        );
        if (socket.readyState === 1) resolve(socket);
        if (socket.readyState > 1) {
          Bugsnag.notify(
            `WebSocket closed or couldn't be opened (State: ${socket.readyState})`,
          );
          reject(`Closed or couldn't be opened (State: ${socket.readyState})`);
        }
      }
      if (currentAttempt >= maxNumberOfAttempts) {
        clearInterval(interval);
        Bugsnag.notify(
          `WebSocket timed out after ${currentAttempt * intervalTime}ms`,
        );
        reject('TIMEOUT');
      }
      currentAttempt++;
    }, intervalTime);
  });
}
