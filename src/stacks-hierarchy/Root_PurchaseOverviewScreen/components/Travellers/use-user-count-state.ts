import {useCallback, useReducer} from 'react';
import {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {UserCountState} from './types';
import {
  useSelectableUserProfiles,
  type PurchaseSelectionType,
} from '@atb/modules/purchase-selection';

type ReducerState = {
  userProfilesWithCount: UserProfileWithCount[];
};

type CountReducerAction =
  | {type: 'INCREMENT_COUNT'; userType: string}
  | {type: 'DECREMENT_COUNT'; userType: string};

type CountReducer = (
  prevState: ReducerState,
  action: CountReducerAction,
) => ReducerState;

const countReducer: CountReducer = (prevState, action): ReducerState => {
  switch (action.type) {
    case 'INCREMENT_COUNT': {
      return {
        ...prevState,
        userProfilesWithCount: prevState.userProfilesWithCount.map(
          (userProfile) =>
            userProfile.userTypeString === action.userType
              ? {...userProfile, count: userProfile.count + 1}
              : userProfile,
        ),
      };
    }
    case 'DECREMENT_COUNT': {
      const existingCount =
        prevState.userProfilesWithCount.find(
          (u) => u.userTypeString === action.userType,
        )?.count || 0;
      if (existingCount == 0) {
        return prevState;
      }

      return {
        ...prevState,
        userProfilesWithCount: prevState.userProfilesWithCount.map(
          (userProfile) =>
            userProfile.userTypeString === action.userType
              ? {...userProfile, count: userProfile.count - 1}
              : userProfile,
        ),
      };
    }
  }
};

export function useUserCountState(
  selection: PurchaseSelectionType,
): UserCountState {
  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );
  const initialUserProfilesWithCount = selectableUserProfiles.map((u) => ({
    ...u,
    count:
      selection.userProfilesWithCount.find(({id}) => id === u.id)?.count ?? 0,
  }));

  const [userCountState, dispatch] = useReducer(countReducer, {
    userProfilesWithCount: initialUserProfilesWithCount,
  });

  const addCount = useCallback(
    (userType: string) => dispatch({type: 'INCREMENT_COUNT', userType}),
    [dispatch],
  );
  const removeCount = useCallback(
    (userType: string) => dispatch({type: 'DECREMENT_COUNT', userType}),
    [dispatch],
  );

  return {
    ...userCountState,
    increment: addCount,
    decrement: removeCount,
  };
}
