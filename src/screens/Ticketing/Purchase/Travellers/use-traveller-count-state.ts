import {useCallback, useReducer} from 'react';
import {Traveller, TravellerWithCount} from './traveller-types';
import {TravellerType} from '../../../../api/fareContracts';

type TravellerCountState = TravellerWithCount[];

type CountReducerAction =
  | {type: 'INCREMENT_COUNT'; travellerType: TravellerType}
  | {type: 'DECREMENT_COUNT'; travellerType: TravellerType};

type CountReducer = (
  prevState: TravellerCountState,
  action: CountReducerAction,
) => TravellerCountState;

const countReducer: CountReducer = (prevState, action) => {
  switch (action.type) {
    case 'INCREMENT_COUNT': {
      return prevState.map((traveller) =>
        traveller.type === action.travellerType
          ? {...traveller, count: traveller.count + 1}
          : traveller,
      );
    }
    case 'DECREMENT_COUNT': {
      return prevState.map((traveller) =>
        traveller.type === action.travellerType && traveller.count > 0
          ? {...traveller, count: traveller.count - 1}
          : traveller,
      );
    }
  }
};

const createInitialState = (travellers: Traveller[]): TravellerCountState =>
  travellers.map((traveller) => ({
    ...traveller,
    count: 0,
  }));

export default function useTravellerCountState(travellers: Traveller[]) {
  const initialState = createInitialState(travellers);
  const [travellerCountState, dispatch] = useReducer(
    countReducer,
    initialState,
  );

  const addCount = useCallback(
    (travellerType: TravellerType) =>
      dispatch({type: 'INCREMENT_COUNT', travellerType}),
    [dispatch],
  );
  const removeCount = useCallback(
    (travellerType: TravellerType) =>
      dispatch({type: 'DECREMENT_COUNT', travellerType}),
    [dispatch],
  );

  return {
    travellersWithCount: travellerCountState,
    addCount,
    removeCount,
  };
}
