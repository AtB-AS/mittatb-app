export type SendStopSignalRequestType = {
  serviceJourneyId: string;
  quayId: string;
  date: string;
};

export const sendStopSignal = (_: SendStopSignalRequestType) =>
  // Mock 3000 ms wait time
  new Promise((resolve) => setTimeout(resolve, 3000));
