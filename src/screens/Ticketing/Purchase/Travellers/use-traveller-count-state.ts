import {useCallback, useReducer} from 'react';
import {
  TravellerType,
  travellerTypes,
  TravellerWithCount,
} from '../traveller-types';

type TravellerCountState = TravellerWithCount[];

type CountReducerAction =
  | {type: 'INCREMENT_COUNT'; travellerType: TravellerType}
  | {type: 'DECREMENT_COUNT'; travellerType: TravellerType}
  | {type: 'CLEAR_COUNTS'};

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
    case 'CLEAR_COUNTS': {
      return prevState.map((traveller) => ({...traveller, count: 0}));
    }
  }
};

const initialState: TravellerCountState = travellerTypes.map((traveller) => ({
  ...traveller,
  count: 0,
}));

export default function useTravellerCountState() {
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
  const clearCounts = useCallback(() => dispatch({type: 'CLEAR_COUNTS'}), [
    dispatch,
  ]);

  return {
    travellerCountState,
    addCount,
    removeCount,
    clearCounts,
  };
}
