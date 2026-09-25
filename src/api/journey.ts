import {client} from '@atb/api/client';
import {TripPattern} from './types/trips';

export type SendStopSignalRequestType = {
  quayId: string;
  serviceJourneyId: string;
  serviceJourneyDate: string;
};

export const sendStopSignal = async (req: SendStopSignalRequestType) =>
  client.post('/journey/v1/signal/pickup', req, {authWithIdToken: true});

export type SaveTripRequestType = {
  tripPattern: TripPattern;
};

export type SaveTripResponseType = {
  tripId: string;
  shareLink: string;
};

export const saveJourney = async (req: SaveTripRequestType) =>
  client.post<SaveTripResponseType>('/journey/v1/trip', req, {
    authWithIdToken: true,
  });

export type RegisterLiveActivityRequestType = {
  tripId: string;
  fcmToken: string;
  apnsToken: string;
};

export const registerLiveActivity = async (
  req: RegisterLiveActivityRequestType,
) =>
  client.post('/journey/v1/live-activity/register', req, {
    authWithIdToken: true,
  });

export type UnregisterLiveActivityRequestType = {
  apnsToken: string;
};

export const unregisterLiveActivity = async (
  req: UnregisterLiveActivityRequestType,
) =>
  client.post('/journey/v1/live-activity/unregister', req, {
    authWithIdToken: true,
  });
