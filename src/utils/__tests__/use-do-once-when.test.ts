import {renderHook} from '@testing-library/react-native';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';

let functionRunCount = 0;

describe('useDoOnceWhen', () => {
  beforeEach(() => (functionRunCount = 0));

  it('Should run on initial render when condition true', async () => {
    renderHook(() => useDoOnceWhen(() => functionRunCount++, true));

    expect(functionRunCount).toBe(1);
  });

  it('Should run when condition changes from false to true', async () => {
    const hook = renderHook(
      ({condition}: {condition: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    expect(functionRunCount).toBe(0);
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);
  });

  it('Should rerun if condition switches back to false and to true again', async () => {
    const hook = renderHook(
      ({condition}: {condition: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition),
      {initialProps: {condition: false}},
    );
    hook.rerender({condition: true});
    hook.rerender({condition: false});
    hook.rerender({condition: true});
    expect(functionRunCount).toBe(2);
  });

  it('Should not rerun if given function changes', async () => {
    const hook = renderHook(
      ({func}: {func: () => void}) => useDoOnceWhen(func, true),
      {
        initialProps: {func: () => functionRunCount++},
      },
    );
    expect(functionRunCount).toBe(1);
    hook.rerender({func: () => functionRunCount++});
    expect(functionRunCount).toBe(1);
  });

  it('Should run with the most recent function', async () => {
    const hook = renderHook(
      ({func, cond}: {func: () => void; cond: boolean}) =>
        useDoOnceWhen(func, cond),
      {
        initialProps: {func: () => functionRunCount++, cond: false},
      },
    );
    expect(functionRunCount).toBe(0);
    hook.rerender({func: () => (functionRunCount += 2), cond: true});
    expect(functionRunCount).toBe(2);
  });

  it('Should run only once even if condition switches when onlyOnce is true', async () => {
    const hook = renderHook(
      ({condition}: {condition: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition, true),
      {initialProps: {condition: false}},
    );

    expect(functionRunCount).toBe(0);

    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: false});

    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);
  });

  it('Should run multiple times when condition changes back to true if onlyOnce is false', async () => {
    const hook = renderHook(
      ({condition}: {condition: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition, false),
      {initialProps: {condition: false}},
    );

    expect(functionRunCount).toBe(0);

    hook.rerender({condition: true});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: false});

    hook.rerender({condition: true});
    expect(functionRunCount).toBe(2);
  });

  it('Should rerun when onlyOnce changes from true to false', async () => {
    const hook = renderHook(
      ({condition, onlyOnce}: {condition: boolean; onlyOnce: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition, onlyOnce),
      {initialProps: {condition: false, onlyOnce: true}},
    );

    expect(functionRunCount).toBe(0);

    hook.rerender({condition: true, onlyOnce: true});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: false, onlyOnce: false});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: true, onlyOnce: false});
    expect(functionRunCount).toBe(2);
  });

  it('Should not rerun when onlyOnce switches to true with condition set to true from before', async () => {
    const hook = renderHook(
      ({condition, onlyOnce}: {condition: boolean; onlyOnce: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition, onlyOnce),
      {initialProps: {condition: false, onlyOnce: true}},
    );

    expect(functionRunCount).toBe(0);

    hook.rerender({condition: true, onlyOnce: true});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: true, onlyOnce: false});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: true, onlyOnce: true});
    expect(functionRunCount).toBe(1);
  });

  it('Should stop rerunning when onlyOnce is set back to true', async () => {
    const hook = renderHook(
      ({condition, onlyOnce}: {condition: boolean; onlyOnce: boolean}) =>
        useDoOnceWhen(() => functionRunCount++, condition, onlyOnce),
      {initialProps: {condition: false, onlyOnce: false}},
    );

    expect(functionRunCount).toBe(0);

    hook.rerender({condition: true, onlyOnce: false});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: false, onlyOnce: true});
    expect(functionRunCount).toBe(1);

    hook.rerender({condition: true, onlyOnce: true});
    expect(functionRunCount).toBe(2);

    hook.rerender({condition: false, onlyOnce: true});
    expect(functionRunCount).toBe(2);

    hook.rerender({condition: true, onlyOnce: true});
    expect(functionRunCount).toBe(2);
  });
});
