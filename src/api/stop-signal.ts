import {client} from '@atb/api/client';

export type SendStopSignalRequestType = {
  serviceJourneyId: string;
  quayId: string;
  serviceDate: string;
};

export const sendStopSignal = async (req: SendStopSignalRequestType) =>
  client.post('/journey/v1/signal/stop', req, {authWithIdToken: true});
