export type StopPlaces = Array<{
  name: string;
  id: string;
  latitude?: number;
  longitude?: number;
}>;
export type StopPlace = StopPlaces[0];
