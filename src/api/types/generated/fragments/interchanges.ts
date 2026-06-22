export type InterchangeFragment = {
  guaranteed?: boolean;
  maximumWaitTime?: number;
  staySeated?: boolean;
  fromServiceJourney?: {
    id: string;
    publicCode?: string;
    line: {publicCode?: string};
  };
  toServiceJourney?: {
    id: string;
    publicCode?: string;
    line: {publicCode?: string};
  };
};
