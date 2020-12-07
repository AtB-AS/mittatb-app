import {useCallback, useEffect, useReducer} from 'react';
import {UserProfile} from '../../../../api/userProfiles';
import {listUserProfiles} from '../../../../api';
import {ErrorType, getAxiosErrorType} from '../../../../api/utils';

export type UserProfileWithCount = UserProfile & {count: number};
type UserCountState = {
  userProfilesWithCount: UserProfileWithCount[];
  userProfilesLoading: boolean;
  userProfilesError?: FetchUserProfilesError;
};

export type FetchUserProfilesError = {
  type: ErrorType;
};

type CountReducerAction =
  | {type: 'USER_PROFILES_LOADING'}
  | {type: 'USER_PROFILES_ERROR'; error: FetchUserProfilesError}
  | {type: 'USER_PROFILES_FETCHED'; userProfiles: UserProfile[]}
  | {type: 'INCREMENT_COUNT'; userType: string}
  | {type: 'DECREMENT_COUNT'; userType: string};

type CountReducer = (
  prevState: UserCountState,
  action: CountReducerAction,
) => UserCountState;

const countReducer: CountReducer = (prevState, action): UserCountState => {
  switch (action.type) {
    case 'USER_PROFILES_LOADING': {
      return {
        ...prevState,
        userProfilesLoading: true,
      };
    }
    case 'USER_PROFILES_FETCHED': {
      return {
        ...prevState,
        userProfilesLoading: false,
        userProfilesWithCount: action.userProfiles.map((u) => ({
          ...u,
          count: 0,
        })),
      };
    }
    case 'USER_PROFILES_ERROR': {
      return {
        ...prevState,
        userProfilesError: action.error,
      };
    }
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

const initialState = {
  userProfilesWithCount: [],
  userProfilesLoading: false,
};

export default function useUserCountState() {
  const [userCountState, dispatch] = useReducer(countReducer, initialState);

  useEffect(() => {
    dispatch({type: 'USER_PROFILES_LOADING'});
    listUserProfiles()
      .then((userProfiles) => {
        dispatch({type: 'USER_PROFILES_FETCHED', userProfiles});
      })
      .catch((err) => {
        console.warn(err);

        const errorType = getAxiosErrorType(err);
        dispatch({
          type: 'USER_PROFILES_ERROR',
          error: {
            type: errorType,
          },
        });
      });
  }, []);

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
    addCount,
    removeCount,
  };
}
