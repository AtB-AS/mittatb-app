import {act, renderHook} from '@testing-library/react-native';
import {useSaveLastTokenUser} from '../use-save-last-token-user';
import {storage} from '@atb/modules/storage';

jest.mock('@atb/modules/storage', () => ({
  storage: {set: jest.fn()},
}));

const setStorage = storage.set as jest.Mock;

const render = (tokenId: string | undefined) =>
  renderHook(({id}: {id: string | undefined}) => useSaveLastTokenUser(id), {
    initialProps: {id: tokenId},
  });

describe('useSaveLastTokenUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('saves the user when a new token appears after logging in', () => {
    const hook = render('old-token');
    act(() => hook.result.current('user-b', 'old-token'));
    expect(setStorage).not.toHaveBeenCalled();

    hook.rerender({id: 'new-token'});
    expect(setStorage).toHaveBeenCalledWith(
      '@ATB_last_mobile_token_user',
      'user-b',
    );
  });

  it('saves the user when the first token appears after logging in', () => {
    const hook = render(undefined);
    act(() => hook.result.current('user-b', undefined));

    hook.rerender({id: 'new-token'});
    expect(setStorage).toHaveBeenCalledWith(
      '@ATB_last_mobile_token_user',
      'user-b',
    );
  });

  it('saves the user when the new token appeared before the login finished', () => {
    const hook = render('old-token');
    hook.rerender({id: 'new-token'});
    act(() => hook.result.current('user-b', 'old-token'));

    expect(setStorage).toHaveBeenCalledWith(
      '@ATB_last_mobile_token_user',
      'user-b',
    );
  });

  it('does not save the user while the token is the one from before the login', () => {
    const hook = render('old-token');
    act(() => hook.result.current('user-b', 'old-token'));

    hook.rerender({id: 'old-token'});
    hook.rerender({id: undefined});
    expect(setStorage).not.toHaveBeenCalled();
  });

  it('does not save a user without a login', () => {
    const hook = render('old-token');
    hook.rerender({id: 'new-token'});
    expect(setStorage).not.toHaveBeenCalled();
  });

  it('saves the user once per login', () => {
    const hook = render('old-token');
    act(() => hook.result.current('user-b', 'old-token'));

    hook.rerender({id: 'new-token'});
    hook.rerender({id: 'renewed-token'});
    expect(setStorage).toHaveBeenCalledTimes(1);
  });
});
