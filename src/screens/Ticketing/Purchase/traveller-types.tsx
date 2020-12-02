export type TravellerType =
  | 'ADULT'
  | 'CHILD'
  | 'BICYCLE'
  | 'SENIOR'
  | 'MILITARY'
  | 'YOUTH'
  | 'STUDENT';

export type Traveller = {
  type: TravellerType;
  price: number;
  text: string;
};

export type TravellerWithCount = Traveller & {count: number};

export const travellerTypes: Traveller[] = [
  {
    type: 'ADULT',
    price: 40,
    text: 'Voksen',
  },
  {
    type: 'CHILD',
    price: 20,
    text: 'Barn',
  },
  {
    type: 'BICYCLE',
    price: 20,
    text: 'sykkel',
  },
  {
    type: 'SENIOR',
    price: 20,
    text: 'Honnør',
  },
  {
    type: 'MILITARY',
    price: 20,
    text: 'Militær',
  },
  {
    type: 'YOUTH',
    price: 40,
    text: 'Ungdom',
  },
  {
    type: 'STUDENT',
    price: 40,
    text: 'Student',
  },
];
