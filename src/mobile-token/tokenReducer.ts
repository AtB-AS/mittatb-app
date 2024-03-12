import {ActivatedToken} from '@entur-private/abt-mobile-client-sdk';
import {MobileTokenStatus} from '@atb/mobile-token/types';

export type TokenReducerState = {
  nativeToken?: ActivatedToken;
  status: MobileTokenStatus;
};

type TokenReducerAction =
  | {type: 'LOADING'}
  | {type: 'SUCCESS'; nativeToken: ActivatedToken}
  | {type: 'CLEAR_TOKENS'}
  | {type: 'ERROR'}
  | {type: 'TIMEOUT'};

type TokenReducer = (
  prevState: TokenReducerState,
  action: TokenReducerAction,
) => TokenReducerState;

export const tokenReducer: TokenReducer = (
  prevState,
  action,
): TokenReducerState => {
  switch (action.type) {
    case 'LOADING':
      return {status: 'loading'};
    case 'SUCCESS':
      return {
        status: 'success',
        nativeToken: action.nativeToken,
      };
    case 'CLEAR_TOKENS':
      return {status: 'none'};
    case 'ERROR':
      return {status: 'error'};
    case 'TIMEOUT':
      return {status: 'timeout'};
  }
};
