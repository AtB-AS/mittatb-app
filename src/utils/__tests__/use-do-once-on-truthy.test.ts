import {renderHook} from '@testing-library/react-hooks';
import {useDoOnceOnTruthy} from '@atb/utils/use-do-once-on-truthy';

let functionRunCount = 0;

type ItemType = any | null | undefined;
const NullItem = {item: null as ItemType};

describe('useDoOnceOnTruthy', () => {
  beforeEach(() => {
    functionRunCount = 0; // Reset the counter before each test
  });

  it('should not run the action if item is falsy on initial render', () => {
    renderHook(() => useDoOnceOnTruthy(() => functionRunCount++, null));
    expect(functionRunCount).toBe(0);

    renderHook(() => useDoOnceOnTruthy(() => functionRunCount++, undefined));
    expect(functionRunCount).toBe(0);
  });

  it('should run the action when item becomes truthy', () => {
    const hook = renderHook(
      ({item}: {item: ItemType}) =>
        useDoOnceOnTruthy(() => functionRunCount++, item),
      {initialProps: NullItem},
    );

    // Action should not be called initially
    expect(functionRunCount).toBe(0);

    // When item becomes truthy
    hook.rerender({item: 'truthy value'});
    expect(functionRunCount).toBe(1);
  });

  it('should run the action when item is an object and becomes truthy', () => {
    const hook = renderHook(
      ({item}: {item: ItemType}) =>
        useDoOnceOnTruthy(() => functionRunCount++, item),
      {initialProps: NullItem},
    );

    // Action should not be called initially
    expect(functionRunCount).toBe(0);

    // When item becomes an object
    hook.rerender({item: {key: 'value'}});
    expect(functionRunCount).toBe(1);
  });

  it('should not rerun the action if item changes but stays truthy (with object)', () => {
    const hook = renderHook(
      ({item}: {item: ItemType}) =>
        useDoOnceOnTruthy(() => functionRunCount++, item),
      {initialProps: {item: {key: 'initial'}}},
    );

    // Action should be called once
    expect(functionRunCount).toBe(1);

    // Rerender with a different object but still truthy
    hook.rerender({item: {key: 'new value'}});
    expect(functionRunCount).toBe(1); // No additional calls
  });

  it('should run the action only once, even if item becomes truthy multiple times (with object)', () => {
    const hook = renderHook(
      ({item}: {item: ItemType}) =>
        useDoOnceOnTruthy(() => functionRunCount++, item),
      {initialProps: NullItem},
    );

    // Initial render with falsy value, action should not run
    expect(functionRunCount).toBe(0);

    // Item becomes truthy (an object)
    hook.rerender({item: {key: 'first value'}});
    expect(functionRunCount).toBe(1);

    // Changing to another truthy value (another object) should not rerun the action
    hook.rerender({item: {key: 'second value'}});
    expect(functionRunCount).toBe(1);
  });

  it('should not run the action if action is undefined (with object)', () => {
    renderHook(() => useDoOnceOnTruthy(undefined, {key: 'truthy value'}));
    // Action is undefined, so it should not run
    expect(functionRunCount).toBe(0);
  });

  it('should rerun the action if item goes from falsy to truthy again (reset scenario with object)', () => {
    const hook = renderHook(
      ({item}: {item: ItemType}) =>
        useDoOnceOnTruthy(() => functionRunCount++, item),
      {initialProps: NullItem},
    );

    // Initial render, action should not run
    expect(functionRunCount).toBe(0);

    // Item becomes truthy (an object)
    hook.rerender({item: {key: 'truthy value'}});
    expect(functionRunCount).toBe(1);

    // Item becomes falsy again
    hook.rerender({item: null});

    // Item becomes truthy again (another object)
    hook.rerender({item: {key: 'another truthy value'}});
    // Even though item became truthy again, action should NOT rerun (due to useRef)
    expect(functionRunCount).toBe(1);
  });
});
