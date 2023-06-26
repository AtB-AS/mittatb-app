export type GetStopPlaceQuery = {
  stopPlace?: {
    quays?: Array<{
      journeyPatterns: Array<{
        quays: Array<{stopPlace?: {name: string; id: string}}>;
      }>;
    }>;
  };
};
