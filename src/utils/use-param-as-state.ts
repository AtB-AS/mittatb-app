import {type Dispatch, type SetStateAction, useEffect, useState} from 'react';
import isEqual from 'lodash.isequal';

/**
 * Utility hook to sync a React state with a parameter. If the parameter changes
 * it will update the React state.
 *
 * @param param the param which will cause state change when updated
 * @param checkEquality set to true if the state should remain unchanged if the
 * updated param deep equals the existing state
 *
 */
export function useParamAsState<T>(
  param: T,
  checkEquality?: boolean,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(param);
  useEffect(
    () =>
      setValue((prev) =>
        checkEquality && isEqual(prev, param) ? prev : param,
      ),
    [param, checkEquality],
  );
  return [value, setValue];
}
