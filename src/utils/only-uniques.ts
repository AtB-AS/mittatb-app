export const onlyUniques = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const onlyUniquesBasedOnField =
  <T>(field: keyof T, treatUndefinedAsUnique?: boolean) =>
  (element: T, index: number, array: T[]) => {
    if (treatUndefinedAsUnique && element[field] === undefined) return true;
    return array.findIndex((el) => el[field] === element[field]) === index;
  };

export const onlyUniquesBasedOnPredicate =
  <T>(predicate: (a: T, b: T) => boolean) =>
  (value: T, index: number, array: T[]) => {
    return array.findIndex((v) => predicate(v, value)) === index;
  };
