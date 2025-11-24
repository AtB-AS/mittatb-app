import {ReferenceDataNames} from '@atb/modules/configuration';
import {Language} from '@atb/translations';
import {getReferenceDataName} from '@atb/modules/configuration';

export type UniqueWithCount<T> = T & {count: number};

export const arrayMapUniqueWithCount = <T>(
  array: T[],
  findUniquesPredicate: (a: T, b: T) => boolean,
): UniqueWithCount<T>[] =>
  array.reduce((arr, value) => {
    const existing = arr.find((v) => findUniquesPredicate(v, value));
    if (existing) {
      existing.count += 1;
      return arr;
    }
    return [...arr, {...value, count: 1}];
  }, [] as UniqueWithCount<T>[]);

export const toCountAndName = <T extends ReferenceDataNames>(
  u: UniqueWithCount<T>,
  language: Language,
) => `${u.count} ${getReferenceDataName(u, language)}`;
