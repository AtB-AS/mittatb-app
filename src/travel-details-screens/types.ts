export type ServiceJourneyDeparture = {
  serviceJourneyId: string;
  date: string;
  serviceDate: string;
  fromQuayId?: string;
  toQuayId?: string;
  isTripCancelled?: boolean;
};
