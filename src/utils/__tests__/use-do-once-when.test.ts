import {renderHook} from '@testing-library/react-hooks';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';

let functionRunCount = 0;
describe('useDelayGate', () => {
  beforeEach(() => (functionRunCount = 0));

  it('Should run on initial render when condition true', async () => {
    renderHook(() => useDoOnceWhen(() => functionRunCount++, true));

    expect(functionRunCount).toBe(1);
  });

  it('Should run when condition changes from false to true', async () => {
    const hook = renderHook(
      ({condition}) => useDoOnceWhen(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    expect(functionRunCount).toBe(0);
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);
  });

  it('Should rerun if condition switches back to false and to true again', async () => {
    const hook = renderHook(
      ({condition}) => useDoOnceWhen(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    hook.rerender({condition: true});
    hook.rerender({condition: false});
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(2);
  });

  it('Should not rerun if given function changes', async () => {
    const hook = renderHook(({func}) => useDoOnceWhen(func, true), {
      initialProps: {func: () => functionRunCount++},
    });
    expect(functionRunCount).toBe(1);
    hook.rerender({func: () => functionRunCount++});
    expect(functionRunCount).toBe(1);
  });

  it('Should run with the most recent function', async () => {
    const hook = renderHook(({func, cond}) => useDoOnceWhen(func, cond), {
      initialProps: {func: () => functionRunCount++, cond: false},
    });
    expect(functionRunCount).toBe(0);
    hook.rerender({func: () => (functionRunCount += 2), cond: true});
    expect(functionRunCount).toBe(2);
  });
});
