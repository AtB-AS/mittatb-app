import {useCallback, useReducer} from 'react';
import {UserProfile} from '@atb/reference-data/types';

export type UserProfileWithCount = UserProfile & {count: number};
type ReducerState = {
  userProfilesWithCount: UserProfileWithCount[];
};

type CountReducerAction =
  | {type: 'INCREMENT_COUNT'; userType: string}
  | {type: 'DECREMENT_COUNT'; userType: string}
  | {type: 'UPDATE_SELECTABLE'; selectableUserProfiles: UserProfileWithCount[]};

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
    case 'UPDATE_SELECTABLE': {
      return {
        ...prevState,
        userProfilesWithCount: action.selectableUserProfiles.map(
          (selectable) => ({
            ...selectable,
            count:
              prevState.userProfilesWithCount.find(
                (prev) => prev.id === selectable.id,
              )?.count || 0,
          }),
        ),
      };
    }
  }
};

export type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  addCount: (userTypeString: string) => void;
  removeCount: (userTypeString: string) => void;
  updateSelectable: (selectableUserProfiles: UserProfileWithCount[]) => void;
};

export default function useUserCountState(
  userProfilesWithCount: UserProfileWithCount[],
): UserCountState {
  const [userCountState, dispatch] = useReducer(countReducer, {
    userProfilesWithCount,
  });

  const addCount = useCallback(
    (userType: string) => dispatch({type: 'INCREMENT_COUNT', userType}),
    [dispatch],
  );
  const removeCount = useCallback(
    (userType: string) => dispatch({type: 'DECREMENT_COUNT', userType}),
    [dispatch],
  );
  const updateSelectable = useCallback(
    (selectableUserProfiles: UserProfileWithCount[]) =>
      dispatch({type: 'UPDATE_SELECTABLE', selectableUserProfiles}),
    [dispatch],
  );

  return {
    ...userCountState,
    addCount,
    removeCount,
    updateSelectable,
  };
}
