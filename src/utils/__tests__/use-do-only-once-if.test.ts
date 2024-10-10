import {renderHook} from '@testing-library/react-hooks';
import {useDoOnlyOnceIf} from '@atb/utils/use-do-only-once-if';

let functionRunCount = 0;

describe('useDoOnlyOnceIf', () => {
  beforeEach(() => {
    functionRunCount = 0;
  });

  it('Should run the function on initial render when condition is true', () => {
    renderHook(() => useDoOnlyOnceIf(() => functionRunCount++, true));
    expect(functionRunCount).toBe(1);
  });

  it('Should not run the function on initial render when condition is false', () => {
    renderHook(() => useDoOnlyOnceIf(() => functionRunCount++, false));
    expect(functionRunCount).toBe(0);
  });

  it('Should run the function when condition changes from false to true', () => {
    const hook = renderHook(
      ({condition}) => useDoOnlyOnceIf(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    expect(functionRunCount).toBe(0);
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);
  });

  it('Should not rerun if condition switches back to false and then to true again', () => {
    const hook = renderHook(
      ({condition}) => useDoOnlyOnceIf(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    hook.rerender({condition: true});
    hook.rerender({condition: false});
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1); // Should not run again
  });

  it('Should use the most recent function if it changes before condition becomes true', () => {
    const hook = renderHook(({func, cond}) => useDoOnlyOnceIf(func, cond), {
      initialProps: {func: () => functionRunCount++, cond: false},
    });
    expect(functionRunCount).toBe(0);
    hook.rerender({func: () => (functionRunCount += 2), cond: true});
    expect(functionRunCount).toBe(2); // Should use the updated function
  });

  it('Should not rerun if given function changes after it has already run', () => {
    const hook = renderHook(({func}) => useDoOnlyOnceIf(func, true), {
      initialProps: {func: () => functionRunCount++},
    });
    expect(functionRunCount).toBe(1);
    hook.rerender({func: () => (functionRunCount += 2)});
    expect(functionRunCount).toBe(1); // Should not rerun
  });
});
