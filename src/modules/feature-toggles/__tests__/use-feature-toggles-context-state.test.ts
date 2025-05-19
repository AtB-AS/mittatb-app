import {act, renderHook} from '@testing-library/react-hooks';
import {useFeatureTogglesContextState} from '../use-feature-toggle-context-state.ts';
import type {StorageService} from '@atb/modules/storage';
import type {RemoteConfig} from '@atb/modules/remote-config';
import {toggleSpecifications} from '../toggle-specifications.ts';
import {toStorageKey} from '../utils.ts';
import {FeatureToggleNames} from '../types.ts';

const getStorageMock = (
  getMultiResponse: [FeatureToggleNames, string | undefined][],
): StorageService =>
  ({
    getMulti: async () =>
      getMultiResponse.map(([n, v]) => [toStorageKey(n), v || null]),
    set: async () => {},
  } as any as StorageService);

const getRCMock = (conf: {[K in string]: boolean}) =>
  conf as any as RemoteConfig;

describe('useFeatureTogglesContextState', () => {
  it('Should react to remote config changes of no override', async () => {
    const toggle = toggleSpecifications[0];
    const rc = getRCMock({[toggle.remoteConfigKey]: false});
    const storage = getStorageMock([]);

    const hook = renderHook(
      (rc: RemoteConfig) => useFeatureTogglesContextState(rc, storage),
      {initialProps: rc},
    );

    await hook.waitForNextUpdate();
    expect(hook.result.current[toggle.name]).toBe(false);

    hook.rerender(getRCMock({[toggle.remoteConfigKey]: true}));
    expect(hook.result.current[toggle.name]).toBe(true);

    hook.rerender(getRCMock({[toggle.remoteConfigKey]: false}));
    expect(hook.result.current[toggle.name]).toBe(false);
  });

  it('Should not react to remote config changes of override is set to false', async () => {
    const toggle = toggleSpecifications[0];
    const storage = getStorageMock([[toggle.name, 'false']]);

    const hook = renderHook(
      ({rc}) => useFeatureTogglesContextState(rc, storage),
      {
        initialProps: {
          rc: getRCMock({[toggle.remoteConfigKey]: true}),
        },
      },
    );

    await hook.waitForNextUpdate();
    expect(hook.result.current[toggle.name]).toBe(false);

    hook.rerender({rc: getRCMock({[toggle.remoteConfigKey]: false})});
    expect(hook.result.current[toggle.name]).toBe(false);

    hook.rerender({rc: getRCMock({[toggle.remoteConfigKey]: true})});
    expect(hook.result.current[toggle.name]).toBe(false);
  });

  it('Should not react to remote config changes of override is set to true', async () => {
    const toggle = toggleSpecifications[0];
    const storage = getStorageMock([[toggle.name, 'true']]);

    const hook = renderHook(
      ({rc}) => useFeatureTogglesContextState(rc, storage),
      {
        initialProps: {
          rc: getRCMock({[toggle.remoteConfigKey]: false}),
        },
      },
    );

    await hook.waitForNextUpdate();
    expect(hook.result.current[toggle.name]).toBe(true);

    hook.rerender({rc: getRCMock({[toggle.remoteConfigKey]: true})});
    expect(hook.result.current[toggle.name]).toBe(true);

    hook.rerender({rc: getRCMock({[toggle.remoteConfigKey]: false})});
    expect(hook.result.current[toggle.name]).toBe(true);
  });

  it('Should override value when setting debug override', async () => {
    const toggle = toggleSpecifications[0];
    const rc = getRCMock({[toggle.remoteConfigKey]: true});
    const storage = getStorageMock([]);

    const hook = renderHook(() => useFeatureTogglesContextState(rc, storage));

    await hook.waitForNextUpdate();
    expect(hook.result.current[toggle.name]).toBe(true);

    act(() => hook.result.current.debug.setOverride(toggle.name, false));
    expect(hook.result.current[toggle.name]).toBe(false);

    act(() => hook.result.current.debug.setOverride(toggle.name, true));
    expect(hook.result.current[toggle.name]).toBe(true);

    act(() => hook.result.current.debug.setOverride(toggle.name, false));
    expect(hook.result.current[toggle.name]).toBe(false);

    act(() => hook.result.current.debug.setOverride(toggle.name, undefined));
    expect(hook.result.current[toggle.name]).toBe(true);
  });

  it('Set debug overrides should be returned', async () => {
    const toggle1 = toggleSpecifications[0];
    const toggle2 = toggleSpecifications[1];
    const rc = getRCMock({
      [toggle1.remoteConfigKey]: false,
      [toggle2.remoteConfigKey]: true,
    });
    const storage = getStorageMock([]);

    const hook = renderHook(() => useFeatureTogglesContextState(rc, storage));

    await hook.waitForNextUpdate();
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle1.name,
      value: undefined,
    });
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle2.name,
      value: undefined,
    });

    act(() => hook.result.current.debug.setOverride(toggle1.name, false));
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle1.name,
      value: false,
    });
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle2.name,
      value: undefined,
    });

    act(() => hook.result.current.debug.setOverride(toggle2.name, true));
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle1.name,
      value: false,
    });
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle2.name,
      value: true,
    });

    act(() => hook.result.current.debug.setOverride(toggle1.name, undefined));
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle1.name,
      value: undefined,
    });
    expect(hook.result.current.debug.overrides).toContainEqual({
      name: toggle2.name,
      value: true,
    });
  });
});
