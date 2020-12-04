import {TravellerType} from '../../../../api/fareContracts';

export type Traveller = {
  type: TravellerType;
  text: string;
};

export type TravellerWithCount = Traveller & {count: number};

export const travellerTypes: Traveller[] = [
  {
    type: 'ADULT',
    text: 'Voksen',
  },
  {
    type: 'CHILD',
    text: 'Barn',
  },
  {
    type: 'SENIOR',
    text: 'Honnør',
  },
  {
    type: 'MILITARY',
    text: 'Militær',
  },
  {
    type: 'YOUTH',
    text: 'Ungdom',
  },
  {
    type: 'STUDENT',
    text: 'Student',
  },
];
