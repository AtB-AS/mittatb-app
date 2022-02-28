export type TravelTokenType = 'travelCard' | 'mobile';

export type TravelToken = {
  id: string;
  name: string;
  inspectable: boolean;
  activated: boolean;
  type: TravelTokenType;
  travelCardId?: string;
};
