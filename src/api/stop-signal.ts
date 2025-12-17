import {client} from '@atb/api/client';

export type SendStopSignalRequestType = {
  quayId: string;
  serviceJourneyId: string;
  serviceJourneyDate: string;
};

export const sendStopSignal = async (req: SendStopSignalRequestType) =>
  client.post('/journey/v1/signal/pickup', req, {authWithIdToken: true});
