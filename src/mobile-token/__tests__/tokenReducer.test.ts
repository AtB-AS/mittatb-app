import {tokenReducer, TokenReducerState} from '@atb/mobile-token/tokenReducer';

describe('tokenReducer', () => {
  it('should set state to loading', function () {
    const prevState: TokenReducerState = {status: 'none'};
    const newState = tokenReducer(prevState, {type: 'LOADING'});
    expect(newState).toEqual({status: 'loading'});
  });
  it('should set state to error', function () {
    const prevState: TokenReducerState = {status: 'loading'};
    const newState = tokenReducer(prevState, {type: 'ERROR'});
    expect(newState).toEqual({status: 'error'});
  });
  it('should set state to timeout', function () {
    const prevState: TokenReducerState = {status: 'loading'};
    const newState = tokenReducer(prevState, {type: 'TIMEOUT'});
    expect(newState).toEqual({status: 'timeout'});
  });
  it('should set state to success', function () {
    const prevState: TokenReducerState = {status: 'loading'};
    const nativeToken = {} as any;
    const remoteTokens = [] as any;
    const newState = tokenReducer(prevState, {
      type: 'SUCCESS',
      nativeToken,
      remoteTokens,
    });
    expect(newState.status).toEqual('success');
    expect(newState.nativeToken).toBe(nativeToken);
    expect(newState.remoteTokens).toBe(remoteTokens);
  });
  it('should update remote tokens if success', function () {
    const prevState: TokenReducerState = {
      status: 'success',
      nativeToken: {} as any,
      remoteTokens: [],
    };
    const remoteTokens = [] as any;
    const newState = tokenReducer(prevState, {
      type: 'UPDATE_REMOTE_TOKENS',
      remoteTokens,
    });
    expect(newState.status).toEqual(prevState.status);
    expect(newState.nativeToken).toBe(prevState.nativeToken);
    expect(newState.remoteTokens).toBe(remoteTokens);
  });
  it('should not update remote tokens if not success', function () {
    const prevState: TokenReducerState = {status: 'loading'};
    const remoteTokens = [] as any;
    const newState = tokenReducer(prevState, {
      type: 'UPDATE_REMOTE_TOKENS',
      remoteTokens,
    });
    expect(newState).toEqual(prevState);
  });
  it('should clear tokens', function () {
    const prevState: TokenReducerState = {
      status: 'success',
      nativeToken: {} as any,
      remoteTokens: [],
    };
    const newState = tokenReducer(prevState, {type: 'CLEAR_TOKENS'});
    expect(newState).toEqual({status: 'none'});
  });
});
