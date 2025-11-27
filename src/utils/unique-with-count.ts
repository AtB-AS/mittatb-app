import {useState} from 'react';
import {ReferenceDataNames} from '@atb/modules/configuration';
import {Language} from '@atb/translations';
import {getReferenceDataName} from '@atb/modules/configuration';

export type UniqueWithCount<T> = T & {count: number};

export type UniqueCountState<T> = {
  state: UniqueWithCount<T>[];
  increment: (item: T) => void;
  decrement: (item: T) => void;
};

const addCount = (count: number) => count + 1;
const subtractCount = (count: number) => count - 1;

export function useUniqueCountState<T>(
  initialState: UniqueWithCount<T>[],
  equalityPredicate: (a: T, b: T) => boolean,
): UniqueCountState<T> {
  const [state, setState] = useState<UniqueWithCount<T>[]>(initialState);

  const setItemCount = (item: T, countOperation: (count: number) => number) => {
    setState((prevState) => {
      const index = prevState.findIndex((value) =>
        equalityPredicate(value, item),
      );

      if (index === -1) {
        return prevState;
      }

      const newState = [...prevState];
      const currentItem = newState[index];
      const newCount = Math.max(0, countOperation(currentItem.count));

      newState[index] = {
        ...currentItem,
        count: newCount,
      };

      return newState;
    });
  };

  const increment = (item: T) => {
    setItemCount(item, addCount);
  };

  const decrement = (item: T) => {
    setItemCount(item, subtractCount);
  };

  return {
    state,
    increment,
    decrement,
  };
}

export const mapUniqueWithCount = <T>(
  array: T[],
  equalityPredicate: (a: T, b: T) => boolean,
): UniqueWithCount<T>[] =>
  array.reduce((arr, value) => {
    const existing = arr.find((v) => equalityPredicate(v, value));
    if (existing) {
      existing.count += 1;
      return arr;
    }
    return [...arr, {...value, count: 1}];
  }, [] as UniqueWithCount<T>[]);

export const toCountAndReferenceDataName = <T extends ReferenceDataNames>(
  u: UniqueWithCount<T>,
  language: Language,
) => `${u.count} ${getReferenceDataName(u, language)}`;
